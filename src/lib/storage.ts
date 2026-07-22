import type { ProjectRecord, PublicProject } from "@/types/content";
import { normalizeExternalUrl } from "@/lib/urls";

export function getStoragePublicUrl(
  bucket: "project-images" | "site-assets",
  path: string | null | undefined,
): string | null {
  if (!path) {
    return null;
  }

  const trimmed = path.trim();

  if (!trimmed) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!baseUrl) {
    return null;
  }

  const normalizedPath = trimmed.replace(/^\/+/, "");
  const pathWithoutBucket = normalizedPath.startsWith(`${bucket}/`)
    ? normalizedPath.slice(bucket.length + 1)
    : normalizedPath;

  return `${baseUrl}/storage/v1/object/public/${bucket}/${pathWithoutBucket}`;
}

export function mapProjectRecord(project: ProjectRecord): PublicProject {
  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    category: project.category,
    shortDescription: project.short_description,
    fullDescription: project.full_description,
    techStack: project.tech_stack,
    githubUrl: project.github_url
      ? normalizeExternalUrl(project.github_url)
      : null,
    liveDemoUrl: project.live_demo_url
      ? normalizeExternalUrl(project.live_demo_url)
      : null,
    featured: project.featured,
    displayOrder: project.display_order,
    published: project.published,
    featuredImageUrl: getStoragePublicUrl(
      "project-images",
      project.featured_image_path,
    ),
    galleryImageUrls: [],
    caseStudyHref: `/projects/${project.slug}`,
  };
}

export async function uploadFileToStorage(
  supabase: {
    storage: {
      from: (bucket: string) => {
        upload: (
          path: string,
          file: File,
          options?: { upsert?: boolean },
        ) => Promise<{ error: Error | null }>;
        remove: (paths: string[]) => Promise<{ error: Error | null }>;
      };
    };
  },
  bucket: "project-images" | "site-assets",
  folder: string,
  file: File,
): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: false,
  });

  if (error) {
    throw error;
  }

  return path;
}

export async function removeStorageFiles(
  supabase: {
    storage: {
      from: (bucket: string) => {
        remove: (paths: string[]) => Promise<{ error: Error | null }>;
      };
    };
  },
  bucket: "project-images" | "site-assets",
  paths: string[],
): Promise<void> {
  if (paths.length === 0) {
    return;
  }

  const { error } = await supabase.storage.from(bucket).remove(paths);

  if (error) {
    throw error;
  }
}
