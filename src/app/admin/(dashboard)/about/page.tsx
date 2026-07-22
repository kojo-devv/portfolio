import { saveAboutContent } from "@/app/admin/actions/content";
import {
  AdminCard,
  AdminField,
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminForm";
import { AdminSaveForm } from "@/components/admin/AdminSaveForm";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { getAdminContentSnapshot } from "@/services/content";
import type { AboutContentRecord, AboutStrengthRecord } from "@/types/content";

export default async function AdminAboutPage() {
  const snapshot = await getAdminContentSnapshot();
  const about = snapshot?.about as AboutContentRecord | null;
  const strengths = (snapshot?.strengths ?? []) as AboutStrengthRecord[];

  const paddedStrengths = Array.from({ length: 4 }, (_, index) =>
    strengths.find((strength) => strength.display_order === index),
  );

  return (
    <>
      <AdminPageHeader
        title="About"
        description="Edit your about section heading, story, and four strength cards."
      />
      <AdminCard>
        <AdminSaveForm action={saveAboutContent} submitLabel="Save about section">
          <div className="space-y-6">
            <AdminField label="Section label">
              <AdminInput
                name="section_label"
                defaultValue={about?.section_label ?? ""}
                required
              />
            </AdminField>

            <AdminField label="Heading">
              <AdminInput name="heading" defaultValue={about?.heading ?? ""} required />
            </AdminField>

            <AdminField label="Body" hint="Separate paragraphs with a blank line.">
              <AdminTextarea
                name="body_paragraphs"
                className="min-h-48"
                defaultValue={about?.body_paragraphs?.join("\n\n") ?? ""}
                required
              />
            </AdminField>

            <div className="space-y-5">
              <h2 className="text-lg font-medium tracking-[-0.02em] text-foreground">
                Strength cards
              </h2>
              {paddedStrengths.map((strength, index) => (
                <div
                  key={strength?.id ?? `strength-${index}`}
                  className="rounded-xl border border-border bg-background p-5"
                >
                  {strength?.id ? (
                    <input
                      type="hidden"
                      name={`strength_id_${index}`}
                      value={strength.id}
                    />
                  ) : null}
                  <div className="grid gap-5">
                    <AdminField label={`Card ${index + 1} title`}>
                      <AdminInput
                        name={`strength_title_${index}`}
                        defaultValue={strength?.title ?? ""}
                      />
                    </AdminField>
                    <AdminField label={`Card ${index + 1} description`}>
                      <AdminTextarea
                        name={`strength_description_${index}`}
                        defaultValue={strength?.description ?? ""}
                      />
                    </AdminField>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AdminSaveForm>
      </AdminCard>
    </>
  );
}
