import Link from "next/link";

import { cn } from "@/lib/cn";

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/settings", label: "Settings" },
] as const;

type AdminNavProps = {
  pathname: string;
  className?: string;
  onNavigate?: () => void;
};

export function AdminNav({ pathname, className, onNavigate }: AdminNavProps) {
  return (
    <nav
      className={cn("flex flex-col gap-1", className)}
      aria-label="Admin"
    >
      {navItems.map((item) => {
        const isActive =
          "exact" in item && item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium tracking-[-0.01em] transition-colors duration-300",
              isActive
                ? "bg-background text-foreground"
                : "text-muted hover:bg-background hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
