export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type ButtonVariant = "primary" | "secondary";

export type FeaturedProject = {
  slug: string;
  name: string;
  category: string;
  description: string;
  techStack: string[];
  caseStudyHref: string;
  liveDemoHref: string;
  liveDemoExternal?: boolean;
};
