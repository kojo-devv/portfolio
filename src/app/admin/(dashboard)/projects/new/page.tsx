import { createBlankProject } from "@/app/admin/actions/projects";

export default async function NewProjectPage() {
  await createBlankProject();
}
