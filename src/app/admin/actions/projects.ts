"use server";

import { redirect } from "next/navigation";

import { requireAdminClient } from "@/lib/admin";
import { revalidatePublicContent } from "@/lib/revalidate";
import { slugify } from "@/lib/slugify";
import { removeStorageFiles } from "@/lib/storage";
import { normalizeExternalUrl } from "@/lib/urls";

function parseTechStack(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

type SaveProjectMedia = {
  featured?: boolean;
  published?: boolean;
  featuredImagePath?: string | null;
  removedImagePath?: string | null;
};

async function deleteProjectImageIfUnreferenced(
  supabase: Awaited<ReturnType<typeof requireAdminClient>>["supabase"],
  path: string,
  excludeProjectId?: string,
): Promise<void> {
  const { data: references, error } = await supabase
    .from("projects")
    .select("id")
    .eq("featured_image_path", path);

  if (error) {
    throw new Error(error.message);
  }

  const isReferencedElsewhere = references?.some(
    (reference) => reference.id !== excludeProjectId,
  );

  if (isReferencedElsewhere) {
    return;
  }

  await removeStorageFiles(supabase, "project-images", [path]);
}

function parseCheckbox(
  formData: FormData,
  name: string,
  override?: boolean,
): boolean {
  if (override !== undefined) {
    return override;
  }

  const value = formData.get(name);
  return value === "on" || value === "true" || value === "1";
}

export async function saveProject(
  formData: FormData,
  media?: SaveProjectMedia,
): Promise<void> {
  const { supabase } = await requireAdminClient();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugInput || slugify(name);
  const category = String(formData.get("category") ?? "").trim();
  const shortDescription = String(formData.get("short_description") ?? "").trim();
  const fullDescription = String(formData.get("full_description") ?? "").trim();
  const techStack = parseTechStack(formData.get("tech_stack"));
  const githubUrlRaw = String(formData.get("github_url") ?? "").trim();
  const liveDemoUrlRaw = String(formData.get("live_demo_url") ?? "").trim();
  const githubUrl = githubUrlRaw ? normalizeExternalUrl(githubUrlRaw) : null;
  const liveDemoUrl = liveDemoUrlRaw ? normalizeExternalUrl(liveDemoUrlRaw) : null;
  const featured = parseCheckbox(formData, "featured", media?.featured);
  const published = parseCheckbox(formData, "published", media?.published);
  const displayOrder = Number(formData.get("display_order") ?? 0);
  const featuredImagePath =
    media?.featuredImagePath !== undefined
      ? media.featuredImagePath?.trim() || null
      : String(formData.get("featured_image_path") ?? "").trim() || null;

  const payload = {
    slug,
    name,
    category,
    short_description: shortDescription,
    full_description: fullDescription,
    tech_stack: techStack,
    github_url: githubUrl,
    live_demo_url: liveDemoUrl,
    featured,
    published,
    display_order: displayOrder,
    featured_image_path: featuredImagePath,
    gallery_image_paths: [],
  };

  if (id) {
    const { data: existingProject } = await supabase
      .from("projects")
      .select("slug, featured_image_path")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase.from("projects").update(payload).eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    const pathsToDelete = new Set<string>();

    if (media?.removedImagePath?.trim()) {
      pathsToDelete.add(media.removedImagePath.trim());
    }

    const previousImagePath = existingProject?.featured_image_path?.trim();

    if (
      previousImagePath &&
      previousImagePath !== featuredImagePath &&
      !pathsToDelete.has(previousImagePath)
    ) {
      pathsToDelete.add(previousImagePath);
    }

    for (const path of pathsToDelete) {
      await deleteProjectImageIfUnreferenced(supabase, path, id);
    }

    const slugsToRevalidate = [slug];
    if (existingProject?.slug && existingProject.slug !== slug) {
      slugsToRevalidate.push(existingProject.slug);
    }

    revalidatePublicContent(slugsToRevalidate);
    return;
  }

  const { error } = await supabase.from("projects").insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePublicContent(slug);
}

export async function createBlankProject(): Promise<void> {
  const { supabase } = await requireAdminClient();

  const { data: lastProject } = await supabase
    .from("projects")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const displayOrder = (lastProject?.display_order ?? -1) + 1;
  const slug = `untitled-${crypto.randomUUID().slice(0, 8)}`;

  const { data, error } = await supabase
    .from("projects")
    .insert({
      slug,
      name: "Untitled project",
      category: "General",
      short_description: "Add a short description.",
      full_description: "",
      tech_stack: [],
      github_url: null,
      live_demo_url: null,
      featured: false,
      published: false,
      display_order: displayOrder,
      featured_image_path: null,
      gallery_image_paths: [],
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to create project.");
  }

  redirect(`/admin/projects/${data.id}/edit`);
}

export async function deleteProject(formData: FormData): Promise<void> {
  const { supabase } = await requireAdminClient();
  const id = String(formData.get("id") ?? "");

  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !project) {
    throw new Error("Project not found.");
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePublicContent(project.slug);
}

export async function updateProjectOrder(formData: FormData): Promise<void> {
  const { supabase } = await requireAdminClient();
  const orderedIds = String(formData.get("ordered_ids") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("projects").update({ display_order: index }).eq("id", id),
    ),
  );

  const { data: projects } = await supabase.from("projects").select("slug");

  revalidatePublicContent(projects?.map((project) => project.slug) ?? []);
}
