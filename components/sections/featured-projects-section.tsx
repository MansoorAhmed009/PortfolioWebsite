import { ProjectCard } from "@/components/projects/project-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Project } from "@/lib/types";

type FeaturedProjectsSectionProps = {
  projects: Project[];
};

export function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  return (
    <section className="mx-auto mt-16 sm:mt-20 md:mt-24 w-full max-w-6xl px-4 md:px-6">
      <Reveal>
        <SectionHeading
          eyebrow="Projects"
          title="AI-Driven Materials Projects"
          description="Applied work spanning alloy screening, experiment optimization, retrieval systems, and technical product interfaces."
        />
      </Reveal>

      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Reveal key={project._id} delay={0.06 * index}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
