import { AboutSection } from "@/sections/about/AboutSection";
import { ContactSection } from "@/sections/contact/ContactSection";
import { HeroSection } from "@/sections/hero/HeroSection";
import { getPortfolioContent } from "@/services/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const content = await getPortfolioContent();

  return (
    <>
      <HeroSection hero={content.hero} />
      <AboutSection about={content.about} />
      <ContactSection contact={content.contact} socialLinks={content.socialLinks} />
    </>
  );
}
