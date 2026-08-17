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

type HeroSectionProps = {
  hero: PortfolioContent["hero"];
};

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <Section id="hero" className="pt-14 md:pt-20 lg:pt-24">
      <Container>
        <div className="max-w-xl">
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
      </Container>
    </Section>
  );
}
