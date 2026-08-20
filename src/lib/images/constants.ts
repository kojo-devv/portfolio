export const HERO_IMAGE_BUCKET = "site-assets" as const;
export const HERO_IMAGE_FOLDER = "hero";
export const HERO_IMAGE_MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
export const HERO_IMAGE_MAX_ORIGINAL_BYTES = 80 * 1024 * 1024;
export const HERO_IMAGE_TARGET_BYTES = 8 * 1024 * 1024;
export const HERO_IMAGE_MAX_LONG_EDGE = 3200;
export const HERO_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

export const HERO_IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export type HeroImageMime = keyof typeof HERO_IMAGE_TYPES;

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
