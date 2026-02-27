import { BlogCard } from "@/components/blog/blog-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { BlogPost } from "@/lib/types";

type LatestPostsSectionProps = {
  posts: BlogPost[];
};

export function LatestPostsSection({ posts }: LatestPostsSectionProps) {
  return (
    <section className="mx-auto mt-16 sm:mt-20 md:mt-24 w-full max-w-6xl px-4 md:px-6">
      <Reveal>
        <SectionHeading
          eyebrow="Blog"
          title="Latest Technical Writing"
          description="Deep dives on material informatics systems, AI workflows, and practical R&D acceleration strategies."
        />
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post, index) => (
          <Reveal key={post._id} delay={0.06 * index}>
            <BlogCard post={post} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
