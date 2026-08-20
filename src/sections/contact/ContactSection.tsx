import { Reveal } from "@/components/motion/Reveal";
import { SiteCta } from "@/components/site/SiteCta";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { normalizeEmailAddress, toMailtoLink } from "@/lib/urls";
import type { PortfolioContent } from "@/types/content";

type ContactSectionProps = {
  contact: PortfolioContent["contact"];
  socialLinks: PortfolioContent["socialLinks"];
};

function resolveMailtoHref(
  email: string,
  socialEmailLink: string,
): string {
  const normalizedEmail = normalizeEmailAddress(email);

  if (normalizedEmail.includes("@")) {
    return `mailto:${normalizedEmail}`;
  }

  if (socialEmailLink.startsWith("mailto:")) {
    return socialEmailLink;
  }

  return toMailtoLink(email);
}

export function ContactSection({ contact, socialLinks }: ContactSectionProps) {
  const emailHref = resolveMailtoHref(contact.email, socialLinks.email);
  const displayEmail = normalizeEmailAddress(contact.email);

  return (
    <Section id="contact" className="border-t border-border pb-24 md:pb-32">
      <Container>
        <Reveal>
          {contact.sectionLabel ? (
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
              {contact.sectionLabel}
            </p>
          ) : null}

          {contact.heading ? (
            <h2 className="mt-5 max-w-[12ch] font-display text-[clamp(2.8rem,8vw,7.5rem)] leading-[0.88] tracking-[-0.045em] text-foreground">
              {contact.heading}
            </h2>
          ) : null}
        </Reveal>

        <div className="mt-10 h-px w-full bg-border" />

        <Reveal>
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end">
            <div>
              {contact.introParagraph ? (
                <p className="max-w-xl text-[1.15rem] leading-relaxed tracking-[-0.02em] text-muted md:text-xl">
                  {contact.introParagraph}
                </p>
              ) : null}

              {emailHref ? (
                <div className="mt-10">
                  <SiteCta href={emailHref}>
                    {displayEmail.includes("@") ? "Send an email" : "Get in touch"}
                  </SiteCta>
                </div>
              ) : null}
            </div>

            <div className="space-y-5">
              {emailHref && displayEmail.includes("@") ? (
                <a
                  href={emailHref}
                  className="site-underline-hover site-underline block font-display text-2xl tracking-[-0.03em] text-foreground sm:text-4xl"
                >
                  {displayEmail}
                </a>
              ) : null}

              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {socialLinks.github ? (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] uppercase tracking-[0.16em] text-muted transition-colors duration-300 hover:text-foreground"
                  >
                    GitHub
                  </a>
                ) : null}
                {socialLinks.linkedin ? (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] uppercase tracking-[0.16em] text-muted transition-colors duration-300 hover:text-foreground"
                  >
                    LinkedIn
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
