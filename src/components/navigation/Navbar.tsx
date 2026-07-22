"use client";

import Link from "next/link";
import { useState } from "react";

import { Container } from "@/components/ui/Container";
import { useScrollLock } from "@/hooks/useScrollLock";
import { cn } from "@/lib/cn";
import type { NavLink } from "@/types";

const linkBaseClassName =
  "group relative inline-flex items-center text-[15px] font-normal tracking-[-0.01em] text-muted transition-[color,opacity] duration-300 ease-out hover:text-foreground";

const linkUnderlineClassName =
  "pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-foreground/35 transition-transform duration-300 ease-out group-hover:scale-x-100";

function NavLinkItem({
  link,
  onNavigate,
  mobile = false,
}: {
  link: NavLink;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const className = cn(
    linkBaseClassName,
    mobile && "min-h-[52px] w-full py-3 text-[1.125rem] tracking-normal",
  );

  const content = (
    <>
      {link.label}
      <span className={linkUnderlineClassName} aria-hidden="true" />
    </>
  );

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} onClick={onNavigate} className={className}>
      {content}
    </Link>
  );
}

function NavLinks({
  links,
  className,
  onNavigate,
  mobile = false,
}: {
  links: NavLink[];
  className?: string;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  return (
    <ul
      className={cn(
        mobile ? "flex flex-col gap-1" : "flex items-center gap-10",
        className,
      )}
    >
      {links.map((link) => (
        <li key={`${link.label}-${link.href}`}>
          <NavLinkItem link={link} onNavigate={onNavigate} mobile={mobile} />
        </li>
      ))}
    </ul>
  );
}

type NavbarProps = {
  siteName: string;
  links: NavLink[];
};

export function Navbar({ siteName, links }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useScrollLock(isOpen);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <Container className="max-w-7xl">
        <div className="flex h-[72px] items-center justify-between">
          <Link
            href="/"
            onClick={closeMenu}
            className="text-[17px] font-medium tracking-[-0.02em] text-foreground transition-opacity duration-300 ease-out hover:opacity-65"
          >
            {siteName}
          </Link>

          <nav className="hidden md:block" aria-label="Main navigation">
            <NavLinks links={links} />
          </nav>

          <button
            type="button"
            className="relative -mr-1 flex h-11 w-11 items-center justify-center md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
            <span className="flex w-[18px] flex-col items-center justify-center gap-[5px]">
              <span
                className={cn(
                  "block h-px w-full bg-foreground transition-transform duration-300 ease-out",
                  isOpen && "translate-y-[6px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-px w-full bg-foreground transition-opacity duration-300 ease-out",
                  isOpen ? "opacity-0" : "opacity-100",
                )}
              />
              <span
                className={cn(
                  "block h-px w-full bg-foreground transition-transform duration-300 ease-out",
                  isOpen && "-translate-y-[6px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </Container>

      <div
        id="mobile-navigation"
        aria-hidden={!isOpen}
        className={cn(
          "grid border-t border-border transition-[grid-template-rows] duration-300 ease-out md:hidden",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <Container className="max-w-7xl">
            <nav
              className="pb-8 pt-2"
              aria-label="Mobile navigation"
              inert={!isOpen ? true : undefined}
            >
              <NavLinks links={links} onNavigate={closeMenu} mobile />
            </nav>
          </Container>
        </div>
      </div>
    </header>
  );
}
