import Image from "next/image";

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
  const imageClassName = [
    "relative min-h-[16rem] w-full sm:min-h-[20rem] lg:min-h-[24rem]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (imageUrl) {
    return (
      <div className={imageClassName}>
        <Image
          src={imageUrl}
          alt={`${name} screenshot`}
          fill
          priority={priority}
          className="object-cover object-top"
          sizes={sizes}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`relative flex h-full min-h-[16rem] w-full items-center justify-center overflow-hidden bg-[#f3f1ed] sm:min-h-[20rem] lg:min-h-[24rem] ${className}`.trim()}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e8e4de_1px,transparent_1px),linear-gradient(to_bottom,#e8e4de_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40" />
      <div className="relative rounded-xl border border-border bg-surface px-6 py-5 shadow-[0_16px_40px_-24px_rgba(17,17,17,0.18)]">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          Project preview
        </p>
        <p className="mt-2 font-serif text-xl tracking-[-0.02em] text-foreground">
          {name}
        </p>
      </div>
    </div>
  );
}
