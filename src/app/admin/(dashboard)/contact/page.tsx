import { saveContactSettings } from "@/app/admin/actions/content";
import {
  AdminCard,
  AdminField,
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminForm";
import { AdminSaveForm } from "@/components/admin/AdminSaveForm";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { getAdminContentSnapshot } from "@/services/content";
import type { ContactSettingsRecord } from "@/types/content";

export default async function AdminContactPage() {
  const snapshot = await getAdminContentSnapshot();
  const contact = snapshot?.contact as ContactSettingsRecord | null;

  return (
    <>
      <AdminPageHeader
        title="Contact"
        description="Update the contact section and the links used across your site."
      />
      <AdminCard>
        <AdminSaveForm action={saveContactSettings} submitLabel="Save contact">
          <div className="space-y-6">
            <AdminField label="Section label">
              <AdminInput
                name="section_label"
                defaultValue={contact?.section_label ?? ""}
                required
              />
            </AdminField>

            <AdminField label="Heading">
              <AdminInput name="heading" defaultValue={contact?.heading ?? ""} required />
            </AdminField>

            <AdminField label="Intro paragraph">
              <AdminTextarea
                name="intro_paragraph"
                defaultValue={contact?.intro_paragraph ?? ""}
                required
              />
            </AdminField>

            <div className="grid gap-5 md:grid-cols-2">
              <AdminField label="Email">
                <AdminInput
                  name="email"
                  type="email"
                  defaultValue={contact?.email ?? ""}
                  placeholder="you@example.com"
                  required
                />
              </AdminField>
              <AdminField label="LinkedIn">
                <AdminInput
                  name="linkedin"
                  defaultValue={contact?.linkedin ?? ""}
                  placeholder="https://linkedin.com/in/your-handle"
                  required
                />
              </AdminField>
              <AdminField label="GitHub">
                <AdminInput
                  name="github"
                  defaultValue={contact?.github ?? ""}
                  placeholder="https://github.com/your-username"
                  required
                />
              </AdminField>
            </div>
          </div>
        </AdminSaveForm>
      </AdminCard>
    </>
  );
}
