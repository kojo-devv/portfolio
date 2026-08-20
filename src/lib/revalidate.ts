import { revalidatePath } from "next/cache";

export function revalidatePublicContent(projectSlugs?: string | string[]): void {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/work", "layout");
  revalidatePath("/projects");
  revalidatePath("/projects", "layout");

  const slugs = projectSlugs
    ? Array.isArray(projectSlugs)
      ? projectSlugs
      : [projectSlugs]
    : [];

  for (const slug of slugs) {
    if (slug) {
      revalidatePath(`/projects/${slug}`);
    }
  }
}
