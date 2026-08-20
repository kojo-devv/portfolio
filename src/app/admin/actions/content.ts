"use server";

import { requireAdminClient } from "@/lib/admin";
import { revalidatePublicContent } from "@/lib/revalidate";
import { removeStorageFiles } from "@/lib/storage";
import { getHeroSaveErrorMessage } from "@/lib/storage/errors";
import {
  normalizeEmailAddress,
  normalizeExternalUrl,
} from "@/lib/urls";

function parseFeaturedProjectId(formData: FormData): string | null {
  const value = String(formData.get("featured_project_id") ?? "").trim();
  return value || null;
}

type SaveHeroMedia = {
  imagePath?: string | null;
  removedImagePath?: string | null;
};

export async function saveHeroContent(
  formData: FormData,
  media?: SaveHeroMedia,
): Promise<void> {
  const { supabase } = await requireAdminClient();

  const featuredProjectId = parseFeaturedProjectId(formData);
  const heroImagePath =
    media?.imagePath !== undefined
      ? media.imagePath?.trim() || null
      : String(formData.get("hero_image_path") ?? "").trim() || null;

  const { data: existingHero } = await supabase
    .from("hero_content")
    .select("hero_image_path")
    .eq("id", 1)
    .maybeSingle();

  const payload = {
    id: 1,
    label: String(formData.get("label") ?? "").trim(),
    headline: String(formData.get("headline") ?? "").trim(),
    supporting_paragraph: String(formData.get("supporting_paragraph") ?? "").trim(),
    primary_button_label: String(formData.get("primary_button_label") ?? "").trim(),
    primary_button_href: String(formData.get("primary_button_href") ?? "").trim(),
    secondary_button_label: String(
      formData.get("secondary_button_label") ?? "",
    ).trim(),
    secondary_button_href: String(formData.get("secondary_button_href") ?? "").trim(),
    featured_project_id: featuredProjectId,
    hero_image_path: heroImagePath,
  };

  const { error } = await supabase
    .from("hero_content")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    throw new Error(getHeroSaveErrorMessage(error));
  }

  const pathsToDelete = new Set<string>();

  if (media?.removedImagePath?.trim()) {
    pathsToDelete.add(media.removedImagePath.trim());
  }

  const previousImagePath = existingHero?.hero_image_path?.trim();

  if (
    previousImagePath &&
    previousImagePath !== heroImagePath &&
    !pathsToDelete.has(previousImagePath)
  ) {
    pathsToDelete.add(previousImagePath);
  }

  if (pathsToDelete.size > 0) {
    try {
      await removeStorageFiles(supabase, "site-assets", [...pathsToDelete]);
    } catch {
      // The new image is already saved. Cleaning up the previous object is best-effort.
    }
  }

  revalidatePublicContent();
}

export async function saveAboutContent(formData: FormData): Promise<void> {
  const { supabase } = await requireAdminClient();

  const bodyParagraphs = String(formData.get("body_paragraphs") ?? "")
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const { error: aboutError } = await supabase.from("about_content").upsert({
    id: 1,
    section_label: String(formData.get("section_label") ?? "About").trim(),
    heading: String(formData.get("heading") ?? "").trim(),
    body_paragraphs: bodyParagraphs,
  });

  if (aboutError) {
    throw new Error(aboutError.message);
  }

  const strengths = [0, 1, 2, 3].map((index) => ({
    id: String(formData.get(`strength_id_${index}`) ?? "").trim() || undefined,
    title: String(formData.get(`strength_title_${index}`) ?? "").trim(),
    description: String(formData.get(`strength_description_${index}`) ?? "").trim(),
    display_order: index,
  }));

  for (const strength of strengths) {
    if (!strength.title || !strength.description) {
      continue;
    }

    if (strength.id) {
      const { error } = await supabase
        .from("about_strengths")
        .update({
          title: strength.title,
          description: strength.description,
          display_order: strength.display_order,
        })
        .eq("id", strength.id);

      if (error) {
        throw new Error(error.message);
      }
    } else {
      const { error } = await supabase.from("about_strengths").insert({
        title: strength.title,
        description: strength.description,
        display_order: strength.display_order,
      });

      if (error) {
        throw new Error(error.message);
      }
    }
  }

  revalidatePublicContent();
}

export async function saveProjectsSection(formData: FormData): Promise<void> {
  const { supabase } = await requireAdminClient();

  const { error } = await supabase.from("projects_section").upsert({
    id: 1,
    heading: String(formData.get("heading") ?? "").trim(),
    intro_paragraph: String(formData.get("intro_paragraph") ?? "").trim(),
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePublicContent();
}

export async function saveContactSettings(formData: FormData): Promise<void> {
  const { supabase } = await requireAdminClient();

  const email = normalizeEmailAddress(String(formData.get("email") ?? ""));
  const linkedin = normalizeExternalUrl(String(formData.get("linkedin") ?? ""));
  const github = normalizeExternalUrl(String(formData.get("github") ?? ""));

  const { error } = await supabase.from("contact_settings").upsert({
    id: 1,
    section_label: String(formData.get("section_label") ?? "Contact").trim(),
    heading: String(formData.get("heading") ?? "").trim(),
    intro_paragraph: String(formData.get("intro_paragraph") ?? "").trim(),
    email,
    linkedin,
    github,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePublicContent();
}

export async function saveSiteSettings(formData: FormData): Promise<void> {
  const { supabase } = await requireAdminClient();

  const { data: existingSettings } = await supabase
    .from("site_settings")
    .select("site_name")
    .eq("id", 1)
    .maybeSingle();

  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    site_name: existingSettings?.site_name ?? "David Dapaah",
    copyright_text: String(formData.get("copyright_text") ?? "").trim() || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePublicContent();
}
