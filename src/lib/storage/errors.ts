import { formatBytes, HERO_IMAGE_MAX_UPLOAD_BYTES } from "@/lib/images/constants";

function readErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return String(error);
}

export function getStorageUploadErrorMessage(error: unknown): string {
  const message = readErrorMessage(error);
  const lower = message.toLowerCase();

  if (
    lower.includes("hero_image_path") &&
    (lower.includes("schema cache") || lower.includes("could not find"))
  ) {
    return "The homepage hero image field is missing from the database. Run supabase/migrations/004_add_hero_image_path.sql in the Supabase SQL editor, then save again.";
  }

  if (
    lower.includes("payload too large") ||
    lower.includes("maximum allowed size") ||
    lower.includes("object exceeded") ||
    lower.includes("file size") ||
    lower.includes("413")
  ) {
    return `This image is larger than the configured upload limit of ${formatBytes(HERO_IMAGE_MAX_UPLOAD_BYTES)}. Choose a smaller file or let the editor optimize it, then try again.`;
  }

  if (
    lower.includes("row-level security") ||
    lower.includes("not allowed") ||
    lower.includes("unauthorized") ||
    lower.includes("permission") ||
    lower.includes("jwt") ||
    lower.includes("403")
  ) {
    return "You do not have permission to upload this image. Sign in again as admin and retry.";
  }

  if (lower.includes("bucket") && lower.includes("not found")) {
    return "The site-assets storage bucket was not found. Confirm the existing Supabase storage setup is intact.";
  }

  if (lower.includes("network") || lower.includes("failed to fetch")) {
    return "The image upload failed because of a network error. Check your connection and try again.";
  }

  return message || "The image could not be uploaded.";
}

export function getHeroSaveErrorMessage(error: unknown): string {
  const message = readErrorMessage(error);
  const lower = message.toLowerCase();

  if (
    lower.includes("hero_image_path") &&
    (lower.includes("schema cache") || lower.includes("could not find"))
  ) {
    return "The homepage hero image field is missing from the database. Run supabase/migrations/004_add_hero_image_path.sql in the Supabase SQL editor, then save again.";
  }

  if (
    lower.includes("row-level security") ||
    lower.includes("permission") ||
    lower.includes("unauthorized")
  ) {
    return "You do not have permission to save hero content. Sign in again as admin and retry.";
  }

  return message || "Hero content could not be saved.";
}
