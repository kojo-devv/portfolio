export type ProjectRecord = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string;
  full_description: string;
  tech_stack: string[];
  github_url: string | null;
  live_demo_url: string | null;
  featured: boolean;
  display_order: number;
  published: boolean;
  featured_image_path: string | null;
  gallery_image_paths: string[];
  created_at: string;
  updated_at: string;
};

export type HeroContentRecord = {
  id: number;
  label: string;
  headline: string;
  supporting_paragraph: string;
  primary_button_label: string;
  primary_button_href: string;
  secondary_button_label: string;
  secondary_button_href: string;
  featured_project_id: string | null;
  hero_image_path: string | null;
  updated_at: string;
};

export type AboutContentRecord = {
  id: number;
  section_label: string;
  heading: string;
  body_paragraphs: string[];
  updated_at: string;
};

export type AboutStrengthRecord = {
  id: string;
  title: string;
  description: string;
  display_order: number;
};

export type ProjectsSectionRecord = {
  id: number;
  heading: string;
  intro_paragraph: string;
  updated_at: string;
};

export type ContactSettingsRecord = {
  id: number;
  section_label: string;
  heading: string;
  intro_paragraph: string;
  email: string;
  linkedin: string;
  github: string;
  updated_at: string;
};

export type SiteSettingsRecord = {
  id: number;
  site_name: string;
  copyright_text: string | null;
  updated_at: string;
};

export type PublicProject = {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  techStack: string[];
  githubUrl: string | null;
  liveDemoUrl: string | null;
  featured: boolean;
  displayOrder: number;
  published: boolean;
  featuredImageUrl: string | null;
  galleryImageUrls: string[];
  caseStudyHref: string;
};

export type PortfolioContent = {
  siteName: string;
  copyrightText: string;
  hero: {
    label: string;
    headline: string;
    supportingParagraph: string;
    primaryButtonLabel: string;
    primaryButtonHref: string;
    secondaryButtonLabel: string;
    secondaryButtonHref: string;
    imageUrl: string | null;
    featuredProject: PublicProject | null;
  };
  projectsSection: {
    heading: string;
    introParagraph: string;
  };
  projects: PublicProject[];
  about: {
    sectionLabel: string;
    heading: string;
    bodyParagraphs: string[];
    strengths: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  };
  contact: {
    sectionLabel: string;
    heading: string;
    introParagraph: string;
    email: string;
    linkedin: string;
    github: string;
  };
  socialLinks: {
    email: string;
    linkedin: string;
    github: string;
  };
};
