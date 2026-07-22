import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/navigation/Navbar";
import { getPortfolioContent } from "@/services/content";
import { NAV_LINKS } from "@/lib/constants";
import type { NavLink } from "@/types";

type LayoutProps = {
  children: React.ReactNode;
};

export async function Layout({ children }: LayoutProps) {
  const content = await getPortfolioContent();

  const navLinks: NavLink[] = NAV_LINKS.map((link) =>
    link.label === "GitHub"
      ? { ...link, href: content.socialLinks.github }
      : link,
  );

  return (
    <>
      <Navbar siteName={content.siteName} links={navLinks} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
