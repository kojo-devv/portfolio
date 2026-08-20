import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectImage } from "@/components/projects/ProjectImage";
import { SiteCta } from "@/components/site/SiteCta";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getProjectBySlug } from "@/services/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.name,
    description: project.shortDescription,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const techLabel = project.techStack.filter(Boolean).join("  /  ");
  const paragraphs = project.fullDescription
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <Section className="pt-10 md:pt-14">
      <Container>
        <Link
          href="/work"
          className="text-[11px] uppercase tracking-[0.16em] text-muted transition-colors duration-300 hover:text-foreground"
        >
          ← Work
        </Link>

        {project.category ? (
          <p className="mt-10 text-[11px] uppercase tracking-[0.18em] text-muted">
            {project.category}
          </p>
        ) : null}

        <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(2.8rem,8vw,7rem)] leading-[0.9] tracking-[-0.045em] text-foreground">
          {project.name}
        </h1>

        {techLabel ? (
          <p className="mt-6 text-[11px] uppercase tracking-[0.14em] text-muted">
            {techLabel}
          </p>
        ) : null}

        <div className="group relative mt-10 h-[min(70vh,42rem)] min-h-[18rem] overflow-hidden rounded-md sm:mt-14">
          <ProjectImage
            name={project.name}
            imageUrl={project.featuredImageUrl}
            className="min-h-full"
            sizes="(max-width: 768px) 100vw, 1400px"
            priority
          />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div className="flex flex-col items-start gap-5">
            {project.liveDemoUrl ? (
              <SiteCta href={project.liveDemoUrl}>Live demo</SiteCta>
            ) : null}
            {project.githubUrl ? (
              <SiteCta href={project.githubUrl} variant="secondary">
                GitHub
                <span aria-hidden="true">→</span>
              </SiteCta>
            ) : null}
          </div>

          <div className="space-y-5 text-[15px] leading-relaxed text-muted sm:text-base sm:leading-relaxed">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
