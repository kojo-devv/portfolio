"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Container } from "@/components/ui/Container";
import { useScrollLock } from "@/hooks/useScrollLock";
import { cn } from "@/lib/cn";
import type { NavLink } from "@/types";

function NavLinkItem({
  link,
  onNavigate,
  mobile = false,
}: {
  link: NavLink;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const className = mobile
    ? "font-display text-[12vw] leading-[0.95] tracking-[-0.04em] text-foreground sm:text-6xl"
    : "text-[11px] font-medium uppercase tracking-[0.16em] text-muted transition-colors duration-300 hover:text-foreground";

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className={className}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} onClick={onNavigate} className={className}>
      {link.label}
    </Link>
  );
}

type NavbarProps = {
  siteName: string;
  links: NavLink[];
};

export function Navbar({ siteName, links }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useScrollLock(isOpen);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <Container>
          <div className="flex h-16 items-center justify-between md:h-[4.5rem]">
            <Link
              href="/"
              onClick={closeMenu}
              className="text-[15px] font-medium tracking-[-0.02em] text-foreground transition-opacity duration-300 hover:opacity-60"
            >
              {siteName}
            </Link>

            <nav className="hidden md:block" aria-label="Main navigation">
              <ul className="flex items-center gap-8 lg:gap-10">
                {links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <NavLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </nav>

            <button
              type="button"
              className="relative -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsOpen((open) => !open)}
            >
              <span className="sr-only">
                {isOpen ? "Close menu" : "Open menu"}
              </span>
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
      </header>

      <div
        id="mobile-navigation"
        aria-hidden={!isOpen}
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-40 bg-background md:hidden",
          isOpen
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        )}
        style={{ transition: "opacity 0.3s ease, visibility 0.3s ease" }}
      >
        <nav
          className="flex h-full flex-col justify-between px-5 pb-10 pt-12 sm:px-8"
          aria-label="Mobile navigation"
          inert={!isOpen ? true : undefined}
        >
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={`${link.label}-${link.href}`}>
                <NavLinkItem link={link} onNavigate={closeMenu} mobile />
              </li>
            ))}
          </ul>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
            {siteName}
          </p>
        </nav>
      </div>
    </>
  );
}
