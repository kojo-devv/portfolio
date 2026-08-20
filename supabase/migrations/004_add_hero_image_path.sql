-- Homepage hero image is independent from project images.
-- Stored as a path into the existing public site-assets bucket.

alter table public.hero_content
add column if not exists hero_image_path text;

-- Allow high-resolution hero portraits (50 MB). Does not change project-images.
update storage.buckets
set file_size_limit = 52428800
where id = 'site-assets';

notify pgrst, 'reload schema';
