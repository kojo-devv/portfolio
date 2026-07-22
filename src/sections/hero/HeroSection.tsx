import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import type { PortfolioContent } from "@/types/content";

const buttonBaseClassName =
  "inline-flex items-center justify-center rounded-md px-6 py-3.5 text-sm font-medium tracking-[-0.01em] transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

const buttonVariants = {
  primary:
    "border border-foreground bg-foreground text-background hover:bg-neutral-800",
  secondary:
    "border border-border bg-transparent text-foreground hover:border-neutral-400 hover:bg-neutral-100/60",
} as const;

function HeroLink({
  href,
  variant,
  children,
}: {
  href: string;
  variant: keyof typeof buttonVariants;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={cn(buttonBaseClassName, buttonVariants[variant])}
    >
      {children}
    </a>
  );
}

function HeroProjectPreview({
  project,
}: {
  project: NonNullable<PortfolioContent["hero"]["featuredProject"]>;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[34rem] lg:mx-0 lg:max-w-none">
      <div
        aria-hidden="true"
        className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_64px_-28px_rgba(17,17,17,0.14)] transition-transform duration-500 ease-out motion-safe:hover:-translate-y-1"
      >
        <div className="flex items-center gap-3 border-b border-border bg-[#f3f1ed] px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#d4cfc7]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#c8c2b8]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#bbb4a8]" />
          </div>
          <div className="flex-1 rounded-md border border-border/80 bg-surface px-3 py-1.5">
            <p className="text-center text-[11px] tracking-wide text-muted">
              {project.slug}.app
            </p>
          </div>
        </div>

        <div className="relative min-h-[16rem] bg-surface sm:min-h-[20rem]">
          {project.featuredImageUrl ? (
            <Image
              src={project.featuredImageUrl}
              alt={`${project.name} preview`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 540px"
            />
          ) : (
            <div className="flex h-full min-h-[16rem] items-center justify-center bg-[#f3f1ed] sm:min-h-[20rem]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e8e4de_1px,transparent_1px),linear-gradient(to_bottom,#e8e4de_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40" />
              <div className="relative rounded-xl border border-border bg-surface px-6 py-5 shadow-[0_16px_40px_-24px_rgba(17,17,17,0.18)]">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                  Project preview
                </p>
                <p className="mt-2 font-serif text-xl tracking-[-0.02em] text-foreground">
                  {project.name}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 px-1">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
          {project.category}
        </p>
        <h2 className="mt-2 font-serif text-2xl tracking-[-0.02em] text-foreground">
          {project.name}
        </h2>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
          {project.shortDescription}
        </p>
      </div>
    </div>
  );
}

type HeroSectionProps = {
  hero: PortfolioContent["hero"];
};

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <Section id="hero" className="pt-14 md:pt-20 lg:pt-24">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20 xl:gap-24">
          <div className="max-w-xl lg:max-w-none">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              {hero.label}
            </p>

            <h1 className="font-serif text-[2.125rem] font-normal leading-[1.12] tracking-[-0.025em] text-foreground sm:text-5xl lg:text-[3.375rem] lg:leading-[1.08]">
              {hero.headline}
            </h1>

            <p className="mt-7 max-w-[34rem] text-base leading-[1.75] text-muted md:mt-8 md:text-[1.0625rem]">
              {hero.supportingParagraph}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3 md:mt-12">
              <HeroLink href={hero.primaryButtonHref} variant="primary">
                {hero.primaryButtonLabel}
              </HeroLink>
              <HeroLink href={hero.secondaryButtonHref} variant="secondary">
                {hero.secondaryButtonLabel}
              </HeroLink>
            </div>
          </div>

          {hero.featuredProject ? (
            <HeroProjectPreview project={hero.featuredProject} />
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
