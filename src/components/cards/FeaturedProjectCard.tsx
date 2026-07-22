import Link from "next/link";

import { ProjectImage } from "@/components/projects/ProjectImage";
import { cn } from "@/lib/cn";
import type { PublicProject } from "@/types/content";

const buttonBaseClassName =
  "inline-flex items-center justify-center rounded-md px-6 py-3.5 text-sm font-medium tracking-[-0.01em] transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

const buttonVariants = {
  primary:
    "border border-foreground bg-foreground text-background hover:bg-neutral-800",
} as const;

type FeaturedProjectCardProps = {
  project: PublicProject;
};

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_64px_-32px_rgba(17,17,17,0.12)]">
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <ProjectImage name={project.name} imageUrl={project.featuredImageUrl} />

        <div className="flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            {project.category}
          </p>

          <h3 className="mt-3 font-serif text-2xl tracking-[-0.02em] text-foreground sm:text-[1.75rem]">
            {project.name}
          </h3>

          <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base sm:leading-relaxed">
            {project.shortDescription}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <li key={tech}>
                <span className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium tracking-wide text-foreground">
                  {tech}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={project.caseStudyHref}
              className={cn(buttonBaseClassName, buttonVariants.primary)}
            >
              View Case Study
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
