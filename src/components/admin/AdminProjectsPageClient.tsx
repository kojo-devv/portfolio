"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { deleteProject, createBlankProject, updateProjectOrder } from "@/app/admin/actions/projects";
import { saveProjectsSection } from "@/app/admin/actions/content";
import {
  AdminCard,
  AdminField,
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminForm";
import { AdminSaveForm } from "@/components/admin/AdminSaveForm";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import type { ProjectRecord } from "@/types/content";

type AdminProjectsPageProps = {
  projects: ProjectRecord[];
  projectsSection: {
    heading: string;
    intro_paragraph: string;
  } | null;
};

export function AdminProjectsPageClient({
  projects,
  projectsSection,
}: AdminProjectsPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function moveProject(id: string, direction: "up" | "down") {
    const index = projects.findIndex((project) => project.id === id);
    if (index === -1) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) {
      return;
    }

    const reordered = [...projects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const formData = new FormData();
    formData.set("ordered_ids", reordered.map((project) => project.id).join(","));

    startTransition(async () => {
      await updateProjectOrder(formData);
      router.refresh();
    });
  }

  return (
    <>
      <AdminPageHeader
        title="Projects"
        description="Add, edit, publish, and reorder the projects shown on your portfolio."
      />

      <div className="space-y-8">
        <AdminCard>
          <AdminSaveForm action={saveProjectsSection} submitLabel="Save section intro">
            <div className="space-y-5">
              <AdminField label="Section heading">
                <AdminInput
                  name="heading"
                  defaultValue={projectsSection?.heading ?? ""}
                  required
                />
              </AdminField>
              <AdminField label="Section intro">
                <AdminTextarea
                  name="intro_paragraph"
                  defaultValue={projectsSection?.intro_paragraph ?? ""}
                  required
                />
              </AdminField>
            </div>
          </AdminSaveForm>
        </AdminCard>

        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium tracking-[-0.02em] text-foreground">
            All projects
          </h2>
          <form action={createBlankProject}>
            <button
              type="submit"
              className="rounded-md border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors duration-300 hover:bg-neutral-800"
            >
              + New Project
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {projects.map((project, index) => (
            <AdminCard key={project.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="text-lg font-medium tracking-[-0.02em] text-foreground transition-colors duration-300 hover:text-neutral-600"
                    >
                      {project.name}
                    </Link>
                    {project.featured ? (
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                        Featured
                      </span>
                    ) : null}
                    {project.published ? (
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted">{project.category}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                    {project.short_description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isPending || index === 0}
                    onClick={() => moveProject(project.id, "up")}
                    className="rounded-md border border-border px-3 py-2 text-sm transition-colors duration-300 hover:bg-background disabled:opacity-40"
                  >
                    Move up
                  </button>
                  <button
                    type="button"
                    disabled={isPending || index === projects.length - 1}
                    onClick={() => moveProject(project.id, "down")}
                    className="rounded-md border border-border px-3 py-2 text-sm transition-colors duration-300 hover:bg-background disabled:opacity-40"
                  >
                    Move down
                  </button>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="rounded-md border border-border px-3 py-2 text-sm transition-colors duration-300 hover:bg-background"
                  >
                    Edit
                  </Link>
                  <form action={deleteProject}>
                    <input type="hidden" name="id" value={project.id} />
                    <button
                      type="submit"
                      className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 transition-colors duration-300 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      </div>
    </>
  );
}
