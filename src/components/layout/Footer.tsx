import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { toMailtoLink } from "@/lib/urls";
import { getSiteChrome } from "@/services/content";

export async function Footer() {
  const content = await getSiteChrome();

  const footerLinks = [
    { label: "GitHub", href: content.socialLinks.github, external: true },
    { label: "LinkedIn", href: content.socialLinks.linkedin, external: true },
    {
      label: "Email",
      href: toMailtoLink(content.contact.email),
      external: false,
    },
  ] as const;

  const visibleLinks = footerLinks.filter((link) => Boolean(link.href));

  return (
    <footer className="border-t border-border">
      <Container>
        <div className="flex flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between md:py-12">
          <div className="space-y-3">
            <Link
              href="/"
              className="text-sm tracking-[-0.02em] text-foreground transition-opacity duration-300 hover:opacity-60"
            >
              {content.siteName}
            </Link>
            {content.copyrightText ? (
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
                {content.copyrightText}
              </p>
            ) : null}
          </div>

          {visibleLinks.length > 0 ? (
            <nav aria-label="Footer links" className="flex flex-wrap gap-x-6 gap-y-2">
              {visibleLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] uppercase tracking-[0.16em] text-muted transition-colors duration-300 hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-[11px] uppercase tracking-[0.16em] text-muted transition-colors duration-300 hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ),
              )}
            </nav>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}
