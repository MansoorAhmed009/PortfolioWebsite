import type { Metadata } from "next";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPosts } from "@/lib/sanity/data";
import { PostsList } from "@/components/blog/posts-list";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical writing on material informatics, AI systems, and research engineering workflows."
};

// export a literal revalidate interval (must be statically analyzable)
export const revalidate = 60; // faster blog updates

export default async function BlogPage() {
  const initialPosts = await getPosts({ limit: 20 });

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-12 sm:pb-14 sm:pt-14 md:px-6 md:pb-16 md:pt-20">
      <Reveal>
        <SectionHeading
          eyebrow="Blog"
          title="Materials AI Insights"
          description="Essays and practical notes for scientists, founders, and engineering teams building data-driven materials workflows."
        />
      </Reveal>

      <PostsList initialPosts={initialPosts} />
    </section>
  );
}