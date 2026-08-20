import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { PortfolioContent } from "@/types/content";

type AboutSectionProps = {
  about: PortfolioContent["about"];
};

export function AboutSection({ about }: AboutSectionProps) {
  const [leadParagraph, ...supportingParagraphs] = about.bodyParagraphs;
  const strengthLabels = about.strengths
    .map((strength) => strength.title)
    .filter(Boolean);

  return (
    <Section id="about" className="border-t border-border">
      <Container>
        <Reveal>
          {about.sectionLabel ? (
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
              {about.sectionLabel}
            </p>
          ) : null}

          {about.heading ? (
            <h2 className="mt-5 max-w-[14ch] font-display text-[clamp(2.6rem,7vw,6.25rem)] leading-[0.9] tracking-[-0.045em] text-foreground">
              {about.heading}
            </h2>
          ) : null}
        </Reveal>

        {strengthLabels.length > 0 ? (
          <Reveal>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 bg-foreground px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-background sm:mt-10 sm:px-5">
              {strengthLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </Reveal>
        ) : (
          <div className="mt-8 h-px w-full bg-border sm:mt-10" />
        )}

        {leadParagraph ? (
          <Reveal>
            <p className="mt-10 max-w-2xl text-[1.35rem] leading-[1.3] tracking-[-0.03em] text-foreground md:ml-[min(18vw,12rem)] md:text-3xl md:leading-[1.2]">
              {leadParagraph}
            </p>
          </Reveal>
        ) : null}

        {supportingParagraphs.length > 0 ? (
          <Reveal>
            <div className="mt-8 max-w-xl space-y-5 text-[15px] leading-relaxed text-muted md:ml-[min(18vw,12rem)]">
              {supportingParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        ) : null}

        {about.strengths.length > 0 ? (
          <div className="mt-16 md:mt-24 md:ml-[min(12vw,8rem)]">
            {about.strengths.map((strength, index) => (
              <Reveal key={strength.id} delayMs={index * 50}>
                <article className="group relative grid gap-3 border-t border-border py-8 sm:grid-cols-[4rem_minmax(10rem,18rem)_minmax(0,1fr)] sm:items-start sm:gap-8 sm:py-10">
                  <div className="relative flex items-center">
                    <span className="absolute -left-5 h-1.5 w-1.5 rounded-full bg-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                  </div>
                  {strength.title ? (
                    <h3 className="text-lg tracking-[-0.03em] text-foreground sm:text-xl">
                      {strength.title}
                    </h3>
                  ) : null}
                  {strength.description ? (
                    <p className="max-w-xl text-[15px] leading-relaxed text-muted">
                      {strength.description}
                    </p>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
