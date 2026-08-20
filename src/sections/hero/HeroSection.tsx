import Image from "next/image";

import { SiteCta } from "@/components/site/SiteCta";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { resolveWorkPageHref } from "@/lib/urls";
import type { PortfolioContent } from "@/types/content";

type HeroSectionProps = {
  hero: PortfolioContent["hero"];
};

export function HeroSection({ hero }: HeroSectionProps) {
  const hasPrimary = Boolean(hero.primaryButtonLabel && hero.primaryButtonHref);
  const hasSecondary = Boolean(
    hero.secondaryButtonLabel && hero.secondaryButtonHref,
  );
  const primaryHref = resolveWorkPageHref(hero.primaryButtonHref);
  const secondaryHref = hero.secondaryButtonHref;

  return (
    <Section
      id="hero"
      className="flex flex-col justify-between overflow-hidden pt-8 md:pt-10 lg:min-h-[calc(100svh-4.5rem)] lg:pb-10"
    >
      <Container className="flex flex-1 flex-col">
        <div className="grid flex-1 items-start gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(15rem,22rem)] lg:gap-16 xl:grid-cols-[minmax(0,1.35fr)_minmax(16rem,26rem)]">
          <div className="flex min-w-0 flex-col">
            {hero.label ? (
              <p className="site-enter text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
                {hero.label}
              </p>
            ) : null}

            {hero.supportingParagraph ? (
              <p className="site-enter site-enter-delay-1 mt-6 max-w-xl text-[1.05rem] leading-[1.55] tracking-[-0.02em] text-foreground sm:text-xl sm:leading-[1.45] lg:mt-7">
                {hero.supportingParagraph}
              </p>
            ) : null}

            {hasPrimary || hasSecondary ? (
              <div className="site-enter site-enter-delay-2 mt-8 flex flex-wrap items-center gap-5 md:mt-10">
                {hasPrimary ? (
                  <SiteCta href={primaryHref}>
                    {hero.primaryButtonLabel}
                  </SiteCta>
                ) : null}
                {hasSecondary ? (
                  <SiteCta href={secondaryHref} variant="secondary">
                    {hero.secondaryButtonLabel}
                    <span aria-hidden="true">→</span>
                  </SiteCta>
                ) : null}
              </div>
            ) : null}
          </div>

          {hero.imageUrl ? (
            <div className="site-enter site-enter-delay-3 relative w-full max-w-md lg:max-w-none lg:justify-self-end">
              <div className="relative aspect-[16/10] overflow-hidden rounded-md lg:aspect-auto lg:h-[min(52vh,28rem)]">
                <div className="relative h-full min-h-full w-full overflow-hidden bg-surface">
                  <Image
                    src={hero.imageUrl}
                    alt="Homepage portrait"
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 90vw, 420px"
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {hero.headline ? (
          <h1 className="site-enter site-enter-delay-4 mt-14 max-w-[16ch] break-words font-display text-[clamp(2.6rem,7.2vw,6.75rem)] leading-[0.92] tracking-[-0.045em] text-foreground md:mt-16 lg:mt-auto lg:pt-16">
            {hero.headline}
          </h1>
        ) : null}
      </Container>
    </Section>
  );
}
