import { FeaturedProjectCard } from "@/components/cards/FeaturedProjectCard";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { PublicProject } from "@/types/content";

type FeaturedProjectSectionProps = {
  heading: string;
  introParagraph: string;
  projects: PublicProject[];
  className?: string;
  emptyMessage?: string;
};

export function FeaturedProjectSection({
  heading,
  introParagraph,
  projects,
  className,
  emptyMessage = "No published projects yet.",
}: FeaturedProjectSectionProps) {
  return (
    <Section className={className}>
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl tracking-[-0.02em] text-foreground sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-[1.0625rem] sm:leading-relaxed">
            {introParagraph}
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-12 sm:mt-14 lg:mt-16">
          {projects.length > 0 ? (
            projects.map((project) => (
              <FeaturedProjectCard key={project.id} project={project} />
            ))
          ) : (
            <p className="text-base leading-relaxed text-muted">
              {emptyMessage}
            </p>
          )}
        </div>
      </Container>
    </Section>
  );
}
