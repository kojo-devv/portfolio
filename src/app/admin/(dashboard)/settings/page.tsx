import { SettingsForm } from "@/components/admin/SettingsForm";
import { getAdminContentSnapshot } from "@/services/content";
import type { SiteSettingsRecord } from "@/types/content";

export default async function AdminSettingsPage() {
  const snapshot = await getAdminContentSnapshot();
  const settings = snapshot?.settings as SiteSettingsRecord | null;

  return <SettingsForm settings={settings} />;
}
