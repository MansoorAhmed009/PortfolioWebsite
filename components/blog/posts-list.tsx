"use client";

import { useState, useEffect, useRef } from "react";

import type { BlogPost } from "@/lib/types";
import { Reveal } from "@/components/ui/reveal";
import { BlogCard } from "@/components/blog/blog-card";

const PAGE_SIZE = 20;

type PostsListProps = {
  initialPosts: BlogPost[];
};

export function PostsList({ initialPosts }: PostsListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          loadingRef.current = true;
          fetch(`/api/posts?offset=${page * PAGE_SIZE}&limit=${PAGE_SIZE}`)
            .then((res) => res.json())
            .then((newPosts: BlogPost[]) => {
              if (newPosts.length > 0) {
                setPosts((p) => [...p, ...newPosts]);
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
        {posts.map((post, idx) => (
          <Reveal key={post._id} delay={0.05 * idx}>
            <BlogCard post={post} />
          </Reveal>
        ))}
      </div>
      <div ref={loaderRef} />
    </>
  );
}
