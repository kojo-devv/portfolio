import Link from "next/link";

import { ProjectImage } from "@/components/projects/ProjectImage";
import { SiteCta } from "@/components/site/SiteCta";
import { cn } from "@/lib/cn";
import type { PublicProject } from "@/types/content";

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

type FeaturedProjectCardProps = {
  project: PublicProject;
  index: number;
  variant?: "flagship" | "editorial";
  priority?: boolean;
};

export function FeaturedProjectCard({
  project,
  index,
  variant = "editorial",
  priority = false,
}: FeaturedProjectCardProps) {
  const techLabel = project.techStack.filter(Boolean).join("  /  ");

  if (variant === "flagship") {
    return (
      <article className="group">
        <Link href={project.caseStudyHref} className="block">
          <div className="relative h-[min(72vh,44rem)] min-h-[18rem] overflow-hidden rounded-md sm:min-h-[24rem]">
            <ProjectImage
              name={project.name}
              imageUrl={project.featuredImageUrl}
              className="min-h-full"
              sizes="(max-width: 1024px) 100vw, 1400px"
              priority={priority}
            />
          </div>
        </Link>

        <div className="mt-7 grid gap-6 border-t border-border pt-6 md:mt-8 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.1fr)] md:items-start md:gap-10 md:pt-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
            {formatIndex(index)}
          </p>

          <div>
            {project.category ? (
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
                {project.category}
              </p>
            ) : null}
            <h3 className="mt-2 font-display text-4xl tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
              <Link
                href={project.caseStudyHref}
                className="site-underline-hover site-underline"
              >
                {project.name}
              </Link>
            </h3>
            {techLabel ? (
              <p className="mt-4 max-w-lg text-[11px] uppercase tracking-[0.14em] text-muted">
                {techLabel}
              </p>
            ) : null}
          </div>

          <div className="md:pt-1">
            {project.shortDescription ? (
              <p className="max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">
                {project.shortDescription}
              </p>
            ) : null}
            <SiteCta href={project.caseStudyHref} variant="secondary" className="mt-6">
              View case study
              <span aria-hidden="true">→</span>
            </SiteCta>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group grid items-center gap-6 border-t border-border py-10 md:gap-10 md:py-14 lg:grid-cols-2",
      )}
    >
      <Link
        href={project.caseStudyHref}
        className={cn(
          "relative block overflow-hidden rounded-md",
          index % 2 === 1 && "lg:order-2",
        )}
      >
        <div className="relative aspect-[16/10] min-h-[14rem] sm:min-h-[18rem] lg:min-h-[22rem]">
          <ProjectImage
            name={project.name}
            imageUrl={project.featuredImageUrl}
            className="min-h-full"
            sizes="(max-width: 1024px) 100vw, 720px"
            priority={priority}
          />
        </div>
      </Link>

      <div className={cn(index % 2 === 1 && "lg:order-1")}>
        <div className="relative flex items-center">
          <span className="absolute -left-5 h-1.5 w-1.5 rounded-full bg-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
            {formatIndex(index)}
            {project.category ? `  /  ${project.category}` : ""}
          </p>
        </div>

        <h3 className="mt-4 font-display text-3xl tracking-[-0.04em] text-foreground sm:text-4xl lg:text-[2.75rem]">
          <Link
            href={project.caseStudyHref}
            className="site-underline-hover site-underline"
          >
            {project.name}
          </Link>
        </h3>

        {project.shortDescription ? (
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
            {project.shortDescription}
          </p>
        ) : null}

        {techLabel ? (
          <p className="mt-5 text-[11px] uppercase tracking-[0.14em] text-muted">
            {techLabel}
          </p>
        ) : null}

        <SiteCta href={project.caseStudyHref} variant="secondary" className="mt-6">
          View case study
          <span aria-hidden="true">→</span>
        </SiteCta>
      </div>
    </article>
  );
}
