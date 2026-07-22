import type { NavLink } from "@/types";

export const SITE_NAME = "David Dapaah";

export const NAV_LINKS: NavLink[] = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/#about" },
  {
    label: "GitHub",
    href: "https://github.com/daviddapaah",
    external: true,
  },
  { label: "Contact", href: "/#contact" },
];
