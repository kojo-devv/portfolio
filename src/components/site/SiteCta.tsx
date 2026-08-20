import Link from "next/link";

import { cn } from "@/lib/cn";

type SiteCtaProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

function isExternalHref(href: string): boolean {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:")
  );
}

export function SiteCta({
  href,
  children,
  variant = "primary",
  className,
}: SiteCtaProps) {
  const classNames = cn(
    variant === "primary" ? "site-cta-primary" : "site-cta-secondary",
    className,
  );

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        className={classNames}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classNames}>
      {children}
    </Link>
  );
}
