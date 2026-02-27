import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";

import { urlFor } from "@/lib/sanity/image";
import type { PortableTextBlock } from "@/lib/types";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="mt-10 text-2xl font-semibold text-white">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 text-xl font-semibold text-white">{children}</h3>,
    normal: ({ children }) => <p className="mt-5 text-base leading-relaxed text-slate-200">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-cyan-300/50 pl-4 italic text-slate-200">{children}</blockquote>
    )
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-200">{children}</ul>,
    number: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-200">{children}</ol>
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      return (
        <a className="text-cyan-200 underline decoration-cyan-300/40 underline-offset-4" href={href}>
          {children}
        </a>
      );
    }
  },
  types: {
    image: ({ value }) => {
      const imageUrl = value ? urlFor(value).width(1200).quality(85).url() : "";
      const alt = typeof value?.alt === "string" ? value.alt : "Blog image";
      if (!imageUrl) return null;

      return (
        <figure className="mt-8 overflow-hidden rounded-2xl border border-slate-700/65 bg-slate-900/50">
          <Image
            src={imageUrl}
            alt={alt}
            width={1200}
            height={720}
            className="h-auto w-full object-cover"
            loading="lazy"
          />
        </figure>
      );
    }
  }
};

type PortableTextRendererProps = {
  value?: PortableTextBlock[];
};

export function PortableTextRenderer({ value = [] }: PortableTextRendererProps) {
  if (!value.length) {
    return (
      <p className="glass-panel rounded-xl p-5 text-sm text-slate-300">
        This article body will appear after publishing rich content in Sanity Studio.
      </p>
    );
  }

  return <PortableText value={value} components={components} />;
}
