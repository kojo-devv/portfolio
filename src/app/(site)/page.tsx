import { AboutSection } from "@/sections/about/AboutSection";
import { ContactSection } from "@/sections/contact/ContactSection";
import { HeroSection } from "@/sections/hero/HeroSection";
import { getHomepageContent } from "@/services/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const content = await getHomepageContent();

  return (
    <>
      <HeroSection hero={content.hero} />
      <AboutSection about={content.about} />
      <ContactSection contact={content.contact} socialLinks={content.socialLinks} />
    </>
  );
}
