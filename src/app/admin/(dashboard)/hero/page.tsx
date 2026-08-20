import { AdminCard } from "@/components/admin/AdminForm";
import { HeroForm } from "@/components/admin/HeroForm";
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
        description="Edit the homepage headline, supporting copy, buttons, homepage hero image, and featured project."
      />
      <AdminCard>
        <HeroForm hero={hero} projects={projects} />
      </AdminCard>
    </>
  );
}
