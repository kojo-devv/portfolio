import { FeaturedProjectSection } from "@/sections/featured-project/FeaturedProjectSection";
import { getPortfolioContent } from "@/services/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WorkPage() {
  const content = await getPortfolioContent();

  return (
    <FeaturedProjectSection
      heading={content.projectsSection.heading}
      introParagraph={content.projectsSection.introParagraph}
      projects={content.projects}
      featuredProject={content.hero.featuredProject}
      className="pt-10 md:pt-14"
    />
  );
}
