import { SITE_NAME } from "@/lib/constants";
import type { PortfolioContent } from "@/types/content";

function buildCopyright(siteName: string): string {
  return `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;
}

export function getFallbackPortfolioContent(): PortfolioContent {
  return {
    siteName: SITE_NAME,
    copyrightText: buildCopyright(SITE_NAME),
    hero: {
      label: "",
      headline: "",
      supportingParagraph: "",
      primaryButtonLabel: "",
      primaryButtonHref: "",
      secondaryButtonLabel: "",
      secondaryButtonHref: "",
      imageUrl: null,
      featuredProject: null,
    },
    projectsSection: {
      heading: "",
      introParagraph: "",
    },
    projects: [],
    about: {
      sectionLabel: "",
      heading: "",
      bodyParagraphs: [],
      strengths: [],
    },
    contact: {
      sectionLabel: "",
      heading: "",
      introParagraph: "",
      email: "",
      linkedin: "",
      github: "",
    },
    socialLinks: {
      email: "",
      linkedin: "",
      github: "",
    },
  };
}
