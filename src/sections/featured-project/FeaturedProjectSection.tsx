import { FeaturedProjectCard } from "@/components/cards/FeaturedProjectCard";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import type { PublicProject } from "@/types/content";

function arrangeProjects(
  projects: PublicProject[],
  featuredProject?: PublicProject | null,
): PublicProject[] {
  const lead =
    featuredProject ?? projects.find((project) => project.featured) ?? null;

  if (!lead) {
    return projects;
  }

  return [lead, ...projects.filter((project) => project.id !== lead.id)];
}

type FeaturedProjectSectionProps = {
  heading: string;
  introParagraph: string;
  projects: PublicProject[];
  featuredProject?: PublicProject | null;
  className?: string;
  emptyMessage?: string;
};

export function FeaturedProjectSection({
  heading,
  introParagraph,
  projects,
  featuredProject = null,
  className,
  emptyMessage = "No published projects yet.",
}: FeaturedProjectSectionProps) {
  const orderedProjects = arrangeProjects(projects, featuredProject);
  const categories = [
    ...new Set(orderedProjects.map((project) => project.category).filter(Boolean)),
  ];
  const title = heading || "Work";

  return (
    <Section id="projects" className={cn("border-t border-border", className)}>
      <Container>
        <Reveal>
          <div className="flex items-start justify-between gap-6">
            <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.86] tracking-[-0.045em] text-foreground">
              {title}
              {orderedProjects.length > 0 ? (
                <sup className="ml-3 align-super text-[0.22em] tracking-[0.12em] text-muted">
                  ({orderedProjects.length})
                </sup>
              ) : null}
            </h2>
          </div>
        </Reveal>

        {categories.length > 0 ? (
          <Reveal>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 bg-foreground px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-background sm:mt-10 sm:px-5">
              {categories.map((category) => (
                <span key={category}>{category}</span>
              ))}
            </div>
          </Reveal>
        ) : (
          <div className="mt-8 h-px w-full bg-border sm:mt-10" />
        )}

        {introParagraph ? (
          <Reveal>
            <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-muted md:ml-[min(18vw,12rem)]">
              {introParagraph}
            </p>
          </Reveal>
        ) : null}

        <div className="mt-12 sm:mt-16 lg:mt-20">
          {orderedProjects.length > 0 ? (
            orderedProjects.map((project, index) => (
              <Reveal key={project.id} delayMs={index * 60}>
                <FeaturedProjectCard
                  project={project}
                  index={index}
                  variant={index === 0 ? "flagship" : "editorial"}
                  priority={index === 0}
                />
              </Reveal>
            ))
          ) : (
            <p className="text-base leading-relaxed text-muted">{emptyMessage}</p>
          )}
        </div>
      </Container>
    </Section>
  );
}
