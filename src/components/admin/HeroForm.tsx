"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { saveHeroContent } from "@/app/admin/actions/content";
import {
  AdminField,
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/AdminForm";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  AdminErrorMessage,
  AdminSuccessMessage,
} from "@/components/admin/AdminShell";
import {
  HERO_IMAGE_ACCEPT,
  HERO_IMAGE_BUCKET,
  HERO_IMAGE_FOLDER,
  formatBytes,
  type HeroImageMime,
} from "@/lib/images/constants";
import {
  HeroImageError,
  inspectHeroImageFile,
  prepareHeroImageForUpload,
} from "@/lib/images/prepare-hero-image";
import { getStoragePublicUrl } from "@/lib/storage";
import { uploadFileClient } from "@/lib/storage/client";
import {
  getHeroSaveErrorMessage,
  getStorageUploadErrorMessage,
} from "@/lib/storage/errors";
import type { HeroContentRecord } from "@/types/content";

type HeroFormProps = {
  hero: HeroContentRecord | null;
  projects: Array<{ id: string; name: string }>;
};

type PendingImage = {
  file: File;
  mimeType: HeroImageMime;
  width: number;
  height: number;
};

export function HeroForm({ hero, projects }: HeroFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(
    null,
  );
  const [heroImagePath, setHeroImagePath] = useState(
    hero?.hero_image_path ?? "",
  );
  const [removedImagePath, setRemovedImagePath] = useState<string | null>(null);

  const hasSavedImage = Boolean(heroImagePath.trim());
  const hasPendingImage = Boolean(pendingImage);
  const hasImage = hasSavedImage || hasPendingImage;
  const savedImageUrl = getStoragePublicUrl(
    HERO_IMAGE_BUCKET,
    heroImagePath || null,
  );
  const previewUrl = pendingPreviewUrl ?? savedImageUrl;
  const previewName = pendingImage?.file.name ?? "Current image";
  const previewDetails = pendingImage
    ? `${formatBytes(pendingImage.file.size)} · ${pendingImage.width}×${pendingImage.height}px · ${pendingImage.mimeType.replace("image/", "").toUpperCase()}`
    : hasSavedImage
      ? "Saved homepage hero image"
      : undefined;

  useEffect(() => {
    setHeroImagePath(hero?.hero_image_path ?? "");
  }, [hero?.hero_image_path]);

  useEffect(() => {
    return () => {
      if (pendingPreviewUrl) {
        URL.revokeObjectURL(pendingPreviewUrl);
      }
    };
  }, [pendingPreviewUrl]);

  async function handleFilesSelected(files: File[]) {
    const file = files[0];

    if (!file) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const inspected = await inspectHeroImageFile(file);

      if (pendingPreviewUrl) {
        URL.revokeObjectURL(pendingPreviewUrl);
      }

      setPendingImage({
        file,
        mimeType: inspected.mimeType,
        width: inspected.width,
        height: inspected.height,
      });
      setPendingPreviewUrl(inspected.previewUrl);
    } catch (error) {
      setPendingImage(null);
      setErrorMessage(
        error instanceof HeroImageError
          ? error.message
          : "This file could not be used as a homepage hero image.",
      );
    }
  }

  function handleRemoveImage() {
    if (heroImagePath.trim()) {
      setRemovedImagePath(heroImagePath.trim());
    }

    if (pendingPreviewUrl) {
      URL.revokeObjectURL(pendingPreviewUrl);
    }

    setHeroImagePath("");
    setPendingImage(null);
    setPendingPreviewUrl(null);
    setErrorMessage(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const form = event.currentTarget;
    const previousPath = heroImagePath.trim() || null;
    let uploadedPath: string | null = null;

    try {
      let nextImagePath = previousPath;
      let imagePathToDelete = removedImagePath;

      if (pendingImage) {
        const prepared = await prepareHeroImageForUpload(
          pendingImage.file,
          pendingImage.mimeType,
        );

        uploadedPath = await uploadFileClient(
          HERO_IMAGE_BUCKET,
          HERO_IMAGE_FOLDER,
          prepared.file,
          { contentType: prepared.file.type },
        );
        nextImagePath = uploadedPath;

        if (previousPath && previousPath !== uploadedPath) {
          imagePathToDelete = previousPath;
        }
      }

      const imageInput = form.elements.namedItem(
        "hero_image_path",
      ) as HTMLInputElement | null;

      if (imageInput) {
        imageInput.value = nextImagePath ?? "";
      }

      const submissionFormData = new FormData(form);

      await saveHeroContent(submissionFormData, {
        imagePath: nextImagePath,
        removedImagePath: imagePathToDelete,
      });

      if (pendingPreviewUrl) {
        URL.revokeObjectURL(pendingPreviewUrl);
      }

      setHeroImagePath(nextImagePath ?? "");
      setPendingImage(null);
      setPendingPreviewUrl(null);
      setRemovedImagePath(null);
      setSuccessMessage("Changes saved successfully.");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        pendingImage && uploadedPath
          ? getHeroSaveErrorMessage(error)
          : pendingImage
            ? getStorageUploadErrorMessage(error)
            : getHeroSaveErrorMessage(error),
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="hero_image_path" value={heroImagePath} />

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
            placeholder="/work"
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

      <ImageUpload
        label="Homepage hero image"
        hasImage={hasImage}
        previewUrl={previewUrl}
        previewName={previewName}
        previewDetails={previewDetails}
        accept={HERO_IMAGE_ACCEPT}
        statusMessage={
          hasPendingImage
            ? "Status: New image selected (save to apply). JPG, PNG, and WebP up to 50 MB."
            : hasSavedImage
              ? "Status: Image attached. Replacing this image does not change project images."
              : "Status: No image. JPG, PNG, and WebP up to 50 MB."
        }
        onFilesSelected={handleFilesSelected}
        onRemove={handleRemoveImage}
      />

      <div className="space-y-3 pt-2">
        <AdminSuccessMessage message={successMessage} />
        <AdminErrorMessage message={errorMessage} />
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-md border border-foreground bg-foreground px-5 py-3 text-sm font-medium tracking-[-0.01em] text-background transition-colors duration-300 hover:bg-neutral-800 disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save hero"}
        </button>
      </div>
    </form>
  );
}
