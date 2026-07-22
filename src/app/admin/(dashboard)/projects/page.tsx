import { AdminProjectsPageClient } from "@/components/admin/AdminProjectsPageClient";
import { getAdminContentSnapshot, getAllProjectsForAdmin } from "@/services/content";
import type { ProjectsSectionRecord } from "@/types/content";

export default async function AdminProjectsPage() {
  const [projects, snapshot] = await Promise.all([
    getAllProjectsForAdmin(),
    getAdminContentSnapshot(),
  ]);

  const projectsSection = snapshot?.projectsSection as ProjectsSectionRecord | null;

  return (
    <AdminProjectsPageClient
      projects={projects}
      projectsSection={
        projectsSection
          ? {
              heading: projectsSection.heading,
              intro_paragraph: projectsSection.intro_paragraph,
            }
          : null
      }
    />
  );
}
