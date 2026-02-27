import Image from "next/image";
import Link from "next/link";

import { urlFor } from "@/lib/sanity/image";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  const imageUrl = post.coverImage ? urlFor(post.coverImage).width(900).height(520).quality(82).url() : "";
  const imageAlt = post.coverImage?.alt || `${post.title} cover image`;

  return (
    <article className="glass-panel group relative overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1.5">
      <div className="pointer-events-none absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-300 opacity-70" />

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

      <h3 className="text-xl font-semibold text-white">{post.title}</h3>
      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">{formatDate(post.publishedAt)}</p>
      <p className="mt-4 line-clamp-3 text-sm text-slate-300">{post.excerpt}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-md border border-slate-600/70 px-2 py-1 text-xs text-slate-200">
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <Link
          href={`/blog/${post.slug}`}
          className="focus-ring inline-flex rounded-lg border border-cyan-300/50 bg-cyan-300/10 px-3 py-2 text-xs font-medium text-cyan-100 transition hover:bg-cyan-300/20"
        >
          Read Article
        </Link>
      </div>
    </article>
  );
}