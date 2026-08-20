import { Layout } from "@/components/layout/Layout";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="site-theme flex min-h-full flex-col bg-background text-foreground">
      <Layout>{children}</Layout>
    </div>
  );
}
