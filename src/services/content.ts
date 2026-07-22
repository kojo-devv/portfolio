import { unstable_noStore as noStore } from "next/cache";
import { connection } from "next/server";
import { cache } from "react";

import { getFallbackPortfolioContent } from "@/lib/fallbacks";
import { createPublicSupabaseClient } from "@/lib/supabase/public-server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { mapProjectRecord } from "@/lib/storage";
import {
  normalizeEmailAddress,
  normalizeExternalUrl,
  toMailtoLink,
} from "@/lib/urls";
import type {
  AboutContentRecord,
  AboutStrengthRecord,
  ContactSettingsRecord,
  HeroContentRecord,
  PortfolioContent,
  ProjectRecord,
  ProjectsSectionRecord,
  PublicProject,
  SiteSettingsRecord,
} from "@/types/content";

type PublicSupabaseClient = NonNullable<
  ReturnType<typeof createPublicSupabaseClient>
>;

function buildCopyright(siteName: string, copyrightText: string | null): string {
  if (copyrightText) {
    return copyrightText;
  }

  return `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;
}

function mapProjects(projects: ProjectRecord[]): PublicProject[] {
  return projects.map(mapProjectRecord);
}

async function fetchFeaturedProject(
  supabase: PublicSupabaseClient,
  publishedProjects: PublicProject[],
  featuredProjectId: string | null | undefined,
): Promise<PublicProject | null> {
  if (featuredProjectId) {
    const selected = publishedProjects.find(
      (project) => project.id === featuredProjectId,
    );

    if (selected) {
      return selected;
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", featuredProjectId)
      .eq("published", true)
      .maybeSingle();

    if (!error && data) {
      return mapProjectRecord(data as ProjectRecord);
    }
  }

  return publishedProjects.find((project) => project.featured) ?? null;
}

function buildPortfolioContent({
  hero,
  projects,
  featuredProject,
  about,
  strengths,
  projectsSection,
  contact,
  settings,
}: {
  hero: HeroContentRecord | null;
  projects: PublicProject[];
  featuredProject: PublicProject | null;
  about: AboutContentRecord | null;
  strengths: AboutStrengthRecord[];
  projectsSection: ProjectsSectionRecord | null;
  contact: ContactSettingsRecord | null;
  settings: SiteSettingsRecord | null;
}): PortfolioContent {
  const siteName = settings?.site_name ?? "David Dapaah";
  const email = contact?.email ? normalizeEmailAddress(contact.email) : "";
  const linkedin = contact?.linkedin
    ? normalizeExternalUrl(contact.linkedin)
    : "";
  const github = contact?.github ? normalizeExternalUrl(contact.github) : "";

  return {
    siteName,
    copyrightText: buildCopyright(siteName, settings?.copyright_text ?? null),
    hero: {
      label: hero?.label ?? "",
      headline: hero?.headline ?? "",
      supportingParagraph: hero?.supporting_paragraph ?? "",
      primaryButtonLabel: hero?.primary_button_label ?? "",
      primaryButtonHref: hero?.primary_button_href ?? "",
      secondaryButtonLabel: hero?.secondary_button_label ?? "",
      secondaryButtonHref: hero?.secondary_button_href ?? "",
      featuredProject,
    },
    projectsSection: {
      heading: projectsSection?.heading ?? "",
      introParagraph: projectsSection?.intro_paragraph ?? "",
    },
    projects,
    about: {
      sectionLabel: about?.section_label ?? "",
      heading: about?.heading ?? "",
      bodyParagraphs: about?.body_paragraphs ?? [],
      strengths: strengths.map((strength) => ({
        id: strength.id,
        title: strength.title,
        description: strength.description,
      })),
    },
    contact: {
      sectionLabel: contact?.section_label ?? "",
      heading: contact?.heading ?? "",
      introParagraph: contact?.intro_paragraph ?? "",
      email,
      linkedin,
      github,
    },
    socialLinks: {
      email: email ? toMailtoLink(email) : "",
      linkedin,
      github,
    },
  };
}

async function loadPortfolioContent(): Promise<PortfolioContent> {
  await connection();
  noStore();

  if (!isSupabaseConfigured()) {
    return getFallbackPortfolioContent();
  }

  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return getFallbackPortfolioContent();
  }

  const [
    heroResult,
    projectsResult,
    aboutResult,
    strengthsResult,
    projectsSectionResult,
    contactResult,
    settingsResult,
  ] = await Promise.all([
    supabase.from("hero_content").select("*").eq("id", 1).maybeSingle(),
    supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true }),
    supabase.from("about_content").select("*").eq("id", 1).maybeSingle(),
    supabase
      .from("about_strengths")
      .select("*")
      .order("display_order", { ascending: true }),
    supabase.from("projects_section").select("*").eq("id", 1).maybeSingle(),
    supabase.from("contact_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
  ]);

  const projects = mapProjects(
    projectsResult.error ? [] : ((projectsResult.data ?? []) as ProjectRecord[]),
  );

  const hero = heroResult.error
    ? null
    : (heroResult.data as HeroContentRecord | null);

  const featuredProject = await fetchFeaturedProject(
    supabase,
    projects,
    hero?.featured_project_id,
  );

  return buildPortfolioContent({
    hero,
    projects,
    featuredProject,
    about: aboutResult.error ? null : (aboutResult.data as AboutContentRecord | null),
    strengths: strengthsResult.error
      ? []
      : ((strengthsResult.data ?? []) as AboutStrengthRecord[]),
    projectsSection: projectsSectionResult.error
      ? null
      : (projectsSectionResult.data as ProjectsSectionRecord | null),
    contact: contactResult.error
      ? null
      : (contactResult.data as ContactSettingsRecord | null),
    settings: settingsResult.error
      ? null
      : (settingsResult.data as SiteSettingsRecord | null),
  });
}

async function loadProjectBySlug(slug: string): Promise<PublicProject | null> {
  await connection();
  noStore();

  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapProjectRecord(data as ProjectRecord);
}

export const getPortfolioContent = cache(loadPortfolioContent);
export const getProjectBySlug = cache(loadProjectBySlug);

export async function getAllProjectsForAdmin(): Promise<ProjectRecord[]> {
  const supabase = await createClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as ProjectRecord[];
}

export async function getProjectByIdForAdmin(
  id: string,
): Promise<ProjectRecord | null> {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as ProjectRecord;
}

export async function getAdminContentSnapshot() {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const [
    hero,
    about,
    strengths,
    projectsSection,
    contact,
    settings,
    projects,
  ] = await Promise.all([
    supabase.from("hero_content").select("*").eq("id", 1).maybeSingle(),
    supabase.from("about_content").select("*").eq("id", 1).maybeSingle(),
    supabase
      .from("about_strengths")
      .select("*")
      .order("display_order", { ascending: true }),
    supabase.from("projects_section").select("*").eq("id", 1).maybeSingle(),
    supabase.from("contact_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase
      .from("projects")
      .select("id, name, slug, featured, published, display_order")
      .order("display_order", { ascending: true }),
  ]);

  return {
    hero: hero.data,
    about: about.data,
    strengths: strengths.data ?? [],
    projectsSection: projectsSection.data,
    contact: contact.data,
    settings: settings.data,
    projects: projects.data ?? [],
  };
}
