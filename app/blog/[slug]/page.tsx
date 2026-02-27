import type { Metadata } from "next";
import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortableTextRenderer } from "@/components/blog/portable-text";
import { Reveal } from "@/components/ui/reveal";
import { getPostBySlug, getPostSlugs } from "@/lib/sanity/data";
import { urlFor } from "@/lib/sanity/image";
import { formatDate } from "@/lib/utils";

// GiscusComments is a client component ("use client") so it can be
// imported directly into this server component. No need for a
// `next/dynamic` wrapper with `ssr: false` which is not allowed here.
import { GiscusComments } from "@/components/comments/giscus-comments";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;
export const revalidate = 60; // faster blog post updates

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  // only pre-render first 50 posts to keep build time reasonable
  return slugs.slice(0, 50).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Article Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const coverImageUrl = post.coverImage ? urlFor(post.coverImage).width(1400).height(780).quality(85).url() : "";
  const coverImageAlt = post.coverImage?.alt || `${post.title} cover image`;

  return (
    <article className="mx-auto w-full max-w-4xl px-4 pb-16 pt-16 md:px-6 md:pt-20">
      <Reveal>
        <Link href="/blog" className="focus-ring inline-flex text-sm text-cyan-200 hover:text-cyan-100">
          {'<-'} Back to Blog
        </Link>
      </Reveal>

      <Reveal delay={0.05} className="mt-4 glass-panel rounded-2xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/90">{formatDate(post.publishedAt)}</p>
        <h1 className="mt-3 text-balance text-3xl font-semibold leading-tight text-white md:text-4xl">{post.title}</h1>
        <p className="mt-4 text-base text-slate-200">{post.excerpt}</p>

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

        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-md border border-slate-600/70 bg-slate-900/65 px-2 py-1 text-xs text-slate-200">
              #{tag}
            </span>
          ))}
        </div>

        {post.websiteUrl || post.githubUrl ? (
          <div className="mt-5 flex flex-wrap gap-3">
            {post.websiteUrl ? (
              <Link
                href={post.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex rounded-lg border border-cyan-300/45 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-100 transition hover:bg-cyan-300/20"
              >
                Visit Website
              </Link>
            ) : null}
            {post.githubUrl ? (
              <Link
                href={post.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex rounded-lg border border-slate-400/45 bg-slate-500/10 px-3 py-2 text-xs font-medium text-slate-100 transition hover:bg-slate-500/20"
              >
                View GitHub
              </Link>
            ) : null}
          </div>
        ) : null}
      </Reveal>

      <Reveal delay={0.1} className="mt-6 glass-panel rounded-2xl p-6 md:p-8">
        <PortableTextRenderer value={post.body} />
      </Reveal>

      <Reveal delay={0.15} className="mt-6 glass-panel rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-semibold text-white">Discussion</h2>
        <p className="mt-2 text-sm text-slate-300">
          Comments are GitHub-backed and moderated through Giscus discussions.
        </p>
        {/* GiscusComments is a client component. We wrap it in a React
            Suspense boundary so we can show a loading message until the
            client bundle hydrates. */}
        <Suspense fallback={<p className="mt-4 text-sm text-slate-300">Loading comments...</p>}>
          <GiscusComments term={`post:${post.slug}`} />
        </Suspense>
      </Reveal>
    </article>
  );
}
