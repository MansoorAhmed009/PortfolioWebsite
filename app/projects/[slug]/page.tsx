import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/ui/reveal";
import { getProjectBySlug, getProjectSlugs } from "@/lib/sanity/data";
import { urlFor } from "@/lib/sanity/image";
import { formatDate } from "@/lib/utils";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;
export const dynamic = 'force-static';
export const revalidate = 60; // faster project updates

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.slice(0, 50).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.summary
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const coverImageUrl = project.coverImage ? urlFor(project.coverImage).width(1400).height(780).quality(85).url() : "";
  const coverImageAlt = project.coverImage?.alt || `${project.title} cover image`;

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-16 pt-16 md:px-6 md:pt-20">
      <Reveal>
        <Link href="/projects" className="focus-ring inline-flex text-sm text-cyan-200 hover:text-cyan-100">
          {'<-'} Back to Projects
        </Link>
      </Reveal>

      <Reveal delay={0.05} className="mt-4 glass-panel rounded-2xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/90">{formatDate(project.publishedAt)}</p>
        <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">{project.title}</h1>
        <p className="mt-4 text-base text-slate-200">{project.summary}</p>

        {coverImageUrl ? (
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-700/70 bg-slate-900/70">
            <Image
              src={coverImageUrl}
              alt={coverImageAlt}
              width={1400}
              height={780}
              className="h-auto w-full object-cover"
              priority={false}
              sizes="(max-width: 1024px) 100vw, 960px"
            />
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span key={tech} className="rounded-md border border-slate-600/70 bg-slate-900/65 px-2 py-1 text-xs text-slate-200">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-8 space-y-5 text-sm leading-relaxed text-slate-200 md:text-base">
          <div>
            <h2 className="mb-2 text-xl font-semibold text-white">Problem</h2>
            <p>{project.problem}</p>
          </div>

          {project.impact ? (
            <div>
              <h2 className="mb-2 text-xl font-semibold text-white">Impact</h2>
              <p>{project.impact}</p>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring rounded-xl border border-cyan-300/45 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-300/20"
            >
              View Demo
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring rounded-xl border border-slate-500/65 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-300/70 hover:text-white"
            >
              View GitHub
            </a>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}