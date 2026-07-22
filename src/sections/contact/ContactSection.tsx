import { Container } from "@/components/ui/Container";
import {
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { normalizeEmailAddress, toMailtoLink } from "@/lib/urls";
import type { PortfolioContent } from "@/types/content";

const buttonBaseClassName =
  "inline-flex items-center justify-center rounded-md px-6 py-3.5 text-sm font-medium tracking-[-0.01em] transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

const buttonVariants = {
  primary:
    "border border-foreground bg-foreground text-background hover:bg-neutral-800",
  secondary:
    "border border-border bg-transparent text-foreground hover:border-neutral-400 hover:bg-neutral-100/60",
} as const;

const contactMethods = [
  {
    label: "Email" as const,
    description: "Reach me directly for opportunities and collaborations.",
    getHref: (contact: PortfolioContent["contact"]) => toMailtoLink(contact.email),
  },
  {
    label: "LinkedIn" as const,
    description: "Connect with me professionally and follow my journey.",
    getHref: (_contact: PortfolioContent["contact"], social: PortfolioContent["socialLinks"]) =>
      social.linkedin,
    external: true,
  },
  {
    label: "GitHub" as const,
    description: "Browse my projects and development work.",
    getHref: (_contact: PortfolioContent["contact"], social: PortfolioContent["socialLinks"]) =>
      social.github,
    external: true,
  },
] as const;

const contactIcons = {
  Email: MailIcon,
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
} as const;

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

  return (
    <Section id="contact">
      <Container>
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            {contact.sectionLabel}
          </p>

          <h2 className="mt-5 font-serif text-3xl tracking-[-0.02em] text-foreground sm:text-4xl">
            {contact.heading}
          </h2>

          <p className="mt-5 text-base leading-relaxed text-muted sm:text-[1.0625rem] sm:leading-relaxed">
            {contact.introParagraph}
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {contactMethods.map((method) => {
            const Icon = contactIcons[method.label];
            const href =
              method.label === "Email"
                ? emailHref
                : method.getHref(contact, socialLinks);
            const isLink = Boolean(href);

            const cardClassName =
              "group flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-[0_16px_40px_-28px_rgba(17,17,17,0.1)] transition-[transform,color] duration-300 ease-out motion-safe:hover:-translate-y-0.5 sm:p-8";

            const cardContent = (
              <>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors duration-300 group-hover:border-neutral-400 group-hover:text-foreground">
                  <Icon />
                </span>

                <h3 className="mt-5 text-lg font-medium tracking-[-0.02em] text-foreground">
                  {method.label}
                </h3>

                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted sm:text-base sm:leading-relaxed">
                  {method.description}
                </p>
              </>
            );

            if (!isLink) {
              return (
                <div key={method.label} className={cardClassName}>
                  {cardContent}
                </div>
              );
            }

            return (
              <a
                key={method.label}
                href={href}
                {...("external" in method &&
                  method.external && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                className={cardClassName}
              >
                {cardContent}
              </a>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 sm:mt-12">
          {emailHref ? (
            <a
              href={emailHref}
              className={cn(buttonBaseClassName, buttonVariants.primary)}
            >
              Send an Email
            </a>
          ) : null}
          {socialLinks.github ? (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonBaseClassName, buttonVariants.secondary)}
            >
              View GitHub
            </a>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
