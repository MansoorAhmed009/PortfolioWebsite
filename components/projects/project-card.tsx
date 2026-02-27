import Image from "next/image";
import Link from "next/link";

import { urlFor } from "@/lib/sanity/image";
import type { Project } from "@/lib/types";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const imageUrl = project.coverImage ? urlFor(project.coverImage).width(900).height(520).quality(82).url() : "";
  const imageAlt = project.coverImage?.alt || `${project.title} cover image`;

  return (
    <article className="glass-panel group relative overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-2">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400/70 via-violet-400/70 to-cyan-300/70 opacity-80" />
      <div className="pointer-events-none absolute -right-14 top-[-10%] h-40 w-40 rounded-full bg-violet-500/20 blur-3xl transition duration-500 group-hover:bg-cyan-500/20" />

      {imageUrl ? (
        <div className="mb-4 overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900/70">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={900}
            height={520}
            className="h-40 w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-44 md:h-48"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 50vw, 33vw"
          />
        </div>
      ) : null}

      <p className="mb-2 text-xs uppercase tracking-[0.22em] text-cyan-300/80">Project</p>
      <h3 className="text-xl font-semibold text-white">{project.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm text-slate-300">{project.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack.slice(0, 4).map((tech) => (
          <span key={tech} className="rounded-md border border-slate-600/70 bg-slate-900/60 px-2 py-1 text-xs text-slate-200">
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Link
          href={`/projects/${project.slug}`}
          className="focus-ring rounded-lg border border-cyan-300/45 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-100 transition hover:bg-cyan-400/20"
        >
          View Details
        </Link>
        {project.demoUrl ? (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring rounded-lg border border-slate-500/60 px-3 py-2 text-xs text-slate-200 transition hover:border-slate-200/70 hover:text-white"
          >
            Live Demo
          </a>
        ) : null}
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring rounded-lg border border-slate-500/60 px-3 py-2 text-xs text-slate-200 transition hover:border-slate-200/70 hover:text-white"
          >
            GitHub
          </a>
        ) : null}
      </div>
    </article>
  );
}