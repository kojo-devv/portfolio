import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { PortfolioContent } from "@/types/content";

type AboutSectionProps = {
  about: PortfolioContent["about"];
};

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <Section id="about">
      <Container>
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            {about.sectionLabel}
          </p>

          <h2 className="mt-5 font-serif text-3xl tracking-[-0.02em] text-foreground sm:text-4xl">
            {about.heading}
          </h2>

          <div className="mt-7 space-y-5 text-base leading-relaxed text-muted sm:mt-8 sm:text-[1.0625rem] sm:leading-relaxed">
            {about.bodyParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-16 lg:gap-8">
          {about.strengths.map((strength) => (
            <article
              key={strength.id}
              className="rounded-2xl border border-border bg-surface p-6 shadow-[0_16px_40px_-28px_rgba(17,17,17,0.1)] transition-transform duration-300 ease-out motion-safe:hover:-translate-y-0.5 sm:p-8"
            >
              <h3 className="text-lg font-medium tracking-[-0.02em] text-foreground">
                {strength.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-base sm:leading-relaxed">
                {strength.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
