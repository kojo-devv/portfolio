import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { toMailtoLink } from "@/lib/urls";
import { getPortfolioContent } from "@/services/content";

export async function Footer() {
  const content = await getPortfolioContent();

  const footerLinks = [
    { label: "LinkedIn", href: content.socialLinks.linkedin, external: true },
    { label: "GitHub", href: content.socialLinks.github, external: true },
    {
      label: "Email",
      href: toMailtoLink(content.contact.email),
      external: false,
    },
  ] as const;

  return (
    <footer className="border-t border-border bg-background">
      <Container className="max-w-7xl">
        <div className="flex flex-col items-center gap-6 py-12 text-center md:flex-row md:items-center md:justify-between md:gap-8 md:py-14 md:text-left">
          <Link
            href="/"
            className="text-[17px] font-medium tracking-[-0.02em] text-foreground transition-opacity duration-300 hover:opacity-65 md:flex-1"
          >
            {content.siteName}
          </Link>

          <p className="text-sm text-muted md:flex-1 md:text-center">
            {content.copyrightText}
          </p>

          <nav
            aria-label="Footer links"
            className="flex items-center justify-center gap-6 md:flex-1 md:justify-end md:gap-8"
          >
            {footerLinks
              .filter((link) => Boolean(link.href))
              .map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm tracking-[-0.01em] text-muted transition-[color,opacity] duration-300 hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm tracking-[-0.01em] text-muted transition-[color,opacity] duration-300 hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ),
              )}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
