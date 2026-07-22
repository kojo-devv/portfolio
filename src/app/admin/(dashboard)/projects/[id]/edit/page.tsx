import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProjectByIdForAdmin } from "@/services/content";

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProjectByIdForAdmin(id);

  if (!project) {
    notFound();
  }

  return (
    <ProjectForm
      project={project}
      title="Edit project"
      description="Update project content, images, featured status, and publish settings."
    />
  );
}
