"use client";

import { useState, useEffect, useRef } from "react";

import type { Project } from "@/lib/types";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/projects/project-card";

const PAGE_SIZE = 20;

type ProjectsListProps = {
  initialProjects: Project[];
};

export function ProjectsList({ initialProjects }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          loadingRef.current = true;
          fetch(`/api/projects?offset=${page * PAGE_SIZE}&limit=${PAGE_SIZE}`)
            .then((res) => res.json())
            .then((newProjects: Project[]) => {
              if (newProjects.length > 0) {
                setProjects((p) => [...p, ...newProjects]);
                setPage((p) => p + 1);
              }
            })
            .finally(() => {
              loadingRef.current = false;
            });
        }
      },
      { rootMargin: "200px" }
    );

    const loader = loaderRef.current;
    if (loader) observer.observe(loader);
    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, [page]);

  return (
    <>
      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {projects.map((project, idx) => (
          <Reveal key={project._id} delay={0.05 * idx}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
      <div ref={loaderRef} />
    </>
  );
}
