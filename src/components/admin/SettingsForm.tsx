"use client";

import { saveSiteSettings } from "@/app/admin/actions/content";
import {
  AdminCard,
  AdminField,
  AdminTextarea,
} from "@/components/admin/AdminForm";
import { AdminSaveForm } from "@/components/admin/AdminSaveForm";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import type { SiteSettingsRecord } from "@/types/content";

type SettingsFormProps = {
  settings: SiteSettingsRecord | null;
};

export function SettingsForm({ settings }: SettingsFormProps) {
  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Update the footer copyright text."
      />
      <AdminCard>
        <AdminSaveForm
          action={saveSiteSettings}
          submitLabel="Save settings"
          className="space-y-6"
        >
          <AdminField
            label="Copyright text"
            hint="Leave blank to use the default year and your name."
          >
            <AdminTextarea
              name="copyright_text"
              defaultValue={settings?.copyright_text ?? ""}
            />
          </AdminField>
        </AdminSaveForm>
      </AdminCard>
    </>
  );
}
