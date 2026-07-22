import { FeaturedProjectSection } from "@/sections/featured-project/FeaturedProjectSection";
import { getPortfolioContent } from "@/services/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectsPage() {
  const content = await getPortfolioContent();

  return (
    <FeaturedProjectSection
      heading={content.projectsSection.heading}
      introParagraph={content.projectsSection.introParagraph}
      projects={content.projects}
      className="pt-14 md:pt-20"
    />
  );
}
