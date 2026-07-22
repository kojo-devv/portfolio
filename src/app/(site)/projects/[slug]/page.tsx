import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectImage } from "@/components/projects/ProjectImage";
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

  return (
    <Section className="pt-14 md:pt-20">
      <Container className="max-w-3xl">
        <Link
          href="/projects"
          className="text-sm font-medium tracking-[-0.01em] text-muted transition-colors duration-300 hover:text-foreground"
        >
          ← Back to projects
        </Link>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_64px_-32px_rgba(17,17,17,0.12)]">
          <ProjectImage
            name={project.name}
            imageUrl={project.featuredImageUrl}
            className="lg:min-h-[28rem]"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>

        <p className="mt-8 text-xs font-medium uppercase tracking-[0.16em] text-muted">
          {project.category}
        </p>

        <h1 className="mt-3 font-serif text-4xl tracking-[-0.02em] text-foreground sm:text-5xl">
          {project.name}
        </h1>

        <div className="mt-6 space-y-5 text-base leading-relaxed text-muted sm:text-[1.0625rem] sm:leading-relaxed">
          {project.fullDescription.split("\n\n").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Container>
    </Section>
  );
}
