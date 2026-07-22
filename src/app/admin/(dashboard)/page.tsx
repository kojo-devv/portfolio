import Link from "next/link";

import { AdminCard } from "@/components/admin/AdminForm";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { getAdminContentSnapshot } from "@/services/content";

export default async function AdminDashboardPage() {
  const snapshot = await getAdminContentSnapshot();

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Choose a section below to update your portfolio."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            title: "Projects",
            value: snapshot?.projects.length ?? 0,
            href: "/admin/projects",
            copy: "Add, edit, publish, and reorder projects.",
          },
          {
            title: "Hero",
            value: snapshot?.hero ? "Ready" : "Empty",
            href: "/admin/hero",
            copy: "Edit your homepage headline and buttons.",
          },
          {
            title: "About",
            value: snapshot?.strengths.length ?? 0,
            href: "/admin/about",
            copy: "Edit your story and strength cards.",
          },
          {
            title: "Contact",
            value: snapshot?.contact ? "Ready" : "Empty",
            href: "/admin/contact",
            copy: "Update email, LinkedIn, and GitHub.",
          },
          {
            title: "Settings",
            value: snapshot?.settings ? "Ready" : "Empty",
            href: "/admin/settings",
            copy: "Update the footer copyright text.",
          },
        ].map((card) => (
          <AdminCard key={card.title}>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
              {card.title}
            </p>
            <p className="mt-3 text-2xl font-medium tracking-[-0.02em] text-foreground">
              {card.value}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{card.copy}</p>
            <Link
              href={card.href}
              className="mt-6 inline-flex text-sm font-medium text-foreground transition-opacity duration-300 hover:opacity-65"
            >
              Open →
            </Link>
          </AdminCard>
        ))}
      </div>
    </>
  );
}
