"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { saveProject } from "@/app/admin/actions/projects";
import {
  AdminCard,
  AdminField,
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminForm";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  AdminErrorMessage,
  AdminPageHeader,
  AdminSuccessMessage,
} from "@/components/admin/AdminShell";
import { slugify } from "@/lib/slugify";
import { getStoragePublicUrl } from "@/lib/storage";
import { uploadFileClient } from "@/lib/storage/client";
import type { ProjectRecord } from "@/types/content";

type ProjectFormProps = {
  project?: ProjectRecord | null;
  title: string;
  description: string;
};

export function ProjectForm({ project, title, description }: ProjectFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingFeaturedFile, setPendingFeaturedFile] = useState<File | null>(
    null,
  );
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(
    null,
  );
  const [featuredImagePath, setFeaturedImagePath] = useState(
    project?.featured_image_path ?? "",
  );
  const [removedImagePath, setRemovedImagePath] = useState<string | null>(null);

  const hasSavedImage = Boolean(featuredImagePath.trim());
  const hasPendingImage = Boolean(pendingFeaturedFile);
  const hasImage = hasSavedImage || hasPendingImage;

  const featuredImageUrl = getStoragePublicUrl(
    "project-images",
    featuredImagePath || null,
  );
  const previewUrl = pendingPreviewUrl ?? featuredImageUrl;
  const previewName = pendingFeaturedFile?.name ?? "Current image";

  useEffect(() => {
    return () => {
      if (pendingPreviewUrl) {
        URL.revokeObjectURL(pendingPreviewUrl);
      }
    };
  }, [pendingPreviewUrl]);

  function handleFilesSelected(files: File[]) {
    const file = files[0] ?? null;

    if (pendingPreviewUrl) {
      URL.revokeObjectURL(pendingPreviewUrl);
    }

    setPendingFeaturedFile(file);
    setPendingPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  function handleRemoveImage() {
    if (featuredImagePath.trim()) {
      setRemovedImagePath(featuredImagePath.trim());
    }

    if (pendingPreviewUrl) {
      URL.revokeObjectURL(pendingPreviewUrl);
    }

    setFeaturedImagePath("");
    setPendingFeaturedFile(null);
    setPendingPreviewUrl(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);
      const name = String(formData.get("name") ?? "").trim();
      const slugInput = String(formData.get("slug") ?? "").trim();
      const slug = slugInput || slugify(name);
      const uploadFolder = `${slug}/featured`;

      let nextFeaturedPath = featuredImagePath.trim() || null;
      let imagePathToDelete = removedImagePath;

      if (pendingFeaturedFile) {
        if (featuredImagePath.trim()) {
          imagePathToDelete = featuredImagePath.trim();
        }

        nextFeaturedPath = await uploadFileClient(
          "project-images",
          uploadFolder,
          pendingFeaturedFile,
        );
        setFeaturedImagePath(nextFeaturedPath);
        setPendingFeaturedFile(null);

        if (pendingPreviewUrl) {
          URL.revokeObjectURL(pendingPreviewUrl);
        }
        setPendingPreviewUrl(null);
        setRemovedImagePath(null);
      }

      const featuredInput = form.elements.namedItem(
        "featured_image_path",
      ) as HTMLInputElement | null;

      if (featuredInput) {
        featuredInput.value = nextFeaturedPath ?? "";
      }

      const submissionFormData = new FormData(form);

      await saveProject(submissionFormData, {
        featured: submissionFormData.get("featured") === "on",
        published: submissionFormData.get("published") === "on",
        featuredImagePath: nextFeaturedPath,
        removedImagePath: imagePathToDelete,
      });
      setSuccessMessage("Changes saved successfully.");
      setRemovedImagePath(null);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save project.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <AdminPageHeader title={title} description={description} />
      <AdminCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          {project ? <input type="hidden" name="id" value={project.id} /> : null}
          <input
            type="hidden"
            name="featured_image_path"
            value={featuredImagePath}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <AdminField label="Project name">
              <AdminInput name="name" defaultValue={project?.name ?? ""} required />
            </AdminField>
            <AdminField label="Slug" hint="Used in the project URL.">
              <AdminInput name="slug" defaultValue={project?.slug ?? ""} />
            </AdminField>
          </div>

          <AdminField label="Category">
            <AdminInput name="category" defaultValue={project?.category ?? ""} required />
          </AdminField>

          <AdminField label="Short description">
            <AdminTextarea
              name="short_description"
              defaultValue={project?.short_description ?? ""}
              required
            />
          </AdminField>

          <AdminField label="Full description">
            <AdminTextarea
              name="full_description"
              className="min-h-40"
              defaultValue={project?.full_description ?? ""}
            />
          </AdminField>

          <AdminField label="Technology stack" hint="Separate items with commas.">
            <AdminInput
              name="tech_stack"
              defaultValue={project?.tech_stack.join(", ") ?? ""}
            />
          </AdminField>

          <div className="grid gap-5 md:grid-cols-2">
            <AdminField label="GitHub URL">
              <AdminInput
                name="github_url"
                defaultValue={project?.github_url ?? ""}
              />
            </AdminField>
            <AdminField label="Live demo URL">
              <AdminInput
                name="live_demo_url"
                defaultValue={project?.live_demo_url ?? ""}
              />
            </AdminField>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <AdminField label="Display order">
              <AdminInput
                type="number"
                name="display_order"
                defaultValue={project?.display_order ?? 0}
              />
            </AdminField>
            <label className="flex items-center gap-3 pt-8 text-sm text-foreground">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={project?.featured ?? false}
                className="h-4 w-4 rounded border-border"
              />
              Featured on homepage
            </label>
            <label className="flex items-center gap-3 pt-8 text-sm text-foreground">
              <input
                type="checkbox"
                name="published"
                defaultChecked={project?.published ?? false}
                className="h-4 w-4 rounded border-border"
              />
              Published
            </label>
          </div>

          <ImageUpload
            label="Featured image"
            hasImage={hasImage}
            previewUrl={previewUrl}
            previewName={previewName}
            statusMessage={
              hasImage
                ? hasPendingImage
                  ? "Status: New image selected (save to apply)"
                  : "Status: Image attached"
                : "Status: No image"
            }
            onFilesSelected={handleFilesSelected}
            onRemove={handleRemoveImage}
          />

          <AdminSuccessMessage message={successMessage} />
          <AdminErrorMessage message={errorMessage} />

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-md border border-foreground bg-foreground px-5 py-3 text-sm font-medium tracking-[-0.01em] text-background transition-colors duration-300 hover:bg-neutral-800 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : project ? "Save project" : "Create project"}
          </button>
        </form>
      </AdminCard>
    </>
  );
}
