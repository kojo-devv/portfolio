import Image from "next/image";

import { cn } from "@/lib/cn";

type ProjectImageProps = {
  name: string;
  imageUrl: string | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function ProjectImage({
  name,
  imageUrl,
  className = "",
  sizes = "(max-width: 1024px) 100vw, 640px",
  priority = false,
}: ProjectImageProps) {
  if (imageUrl) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden bg-surface", className)}>
        <Image
          src={imageUrl}
          alt={`${name} screenshot`}
          fill
          priority={priority}
          className="site-image-zoom object-cover object-top"
          sizes={sizes}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex h-full w-full items-end overflow-hidden bg-[#101010]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(244,240,230,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,240,230,0.06)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      <div className="relative px-6 py-6 sm:px-8 sm:py-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
          Selected work
        </p>
        <p className="mt-2 font-display text-2xl tracking-[-0.03em] text-foreground sm:text-3xl">
          {name}
        </p>
      </div>
    </div>
  );
}
