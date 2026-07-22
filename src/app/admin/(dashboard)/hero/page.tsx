import { saveHeroContent } from "@/app/admin/actions/content";
import {
  AdminCard,
  AdminField,
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/AdminForm";
import { AdminSaveForm } from "@/components/admin/AdminSaveForm";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { getAdminContentSnapshot } from "@/services/content";
import type { HeroContentRecord } from "@/types/content";

export default async function AdminHeroPage() {
  const snapshot = await getAdminContentSnapshot();
  const hero = snapshot?.hero as HeroContentRecord | null;
  const projects = snapshot?.projects ?? [];

  return (
    <>
      <AdminPageHeader
        title="Hero"
        description="Edit the homepage headline, supporting copy, buttons, and featured project."
      />
      <AdminCard>
        <AdminSaveForm action={saveHeroContent} submitLabel="Save hero">
          <div className="space-y-6">
            <AdminField label="Label">
              <AdminInput name="label" defaultValue={hero?.label ?? ""} required />
            </AdminField>

            <AdminField label="Headline">
              <AdminInput name="headline" defaultValue={hero?.headline ?? ""} required />
            </AdminField>

            <AdminField label="Supporting paragraph">
              <AdminTextarea
                name="supporting_paragraph"
                defaultValue={hero?.supporting_paragraph ?? ""}
                required
              />
            </AdminField>

            <div className="grid gap-5 md:grid-cols-2">
              <AdminField label="Primary button label">
                <AdminInput
                  name="primary_button_label"
                  defaultValue={hero?.primary_button_label ?? ""}
                  required
                />
              </AdminField>
              <AdminField label="Primary button link">
                <AdminInput
                  name="primary_button_href"
                  defaultValue={hero?.primary_button_href ?? ""}
                  placeholder="/projects"
                  required
                />
              </AdminField>
              <AdminField label="Secondary button label">
                <AdminInput
                  name="secondary_button_label"
                  defaultValue={hero?.secondary_button_label ?? ""}
                  required
                />
              </AdminField>
              <AdminField label="Secondary button link">
                <AdminInput
                  name="secondary_button_href"
                  defaultValue={hero?.secondary_button_href ?? ""}
                  placeholder="/#contact"
                  required
                />
              </AdminField>
            </div>

            <AdminField label="Featured project">
              <AdminSelect
                name="featured_project_id"
                defaultValue={hero?.featured_project_id ?? ""}
              >
                <option value="">No featured project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>
          </div>
        </AdminSaveForm>
      </AdminCard>
    </>
  );
}
