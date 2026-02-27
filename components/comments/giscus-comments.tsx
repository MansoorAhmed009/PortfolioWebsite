"use client";

import { useEffect, useRef } from "react";

type GiscusCommentsProps = {
  term: string;
};

export function GiscusComments({ term }: GiscusCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";

    if (!repo || !repoId || !category || !categoryId) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", term);
    script.setAttribute("data-strict", "1");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "transparent_dark");
    script.setAttribute("data-lang", "en");

    container.appendChild(script);
  }, [category, categoryId, repo, repoId, term]);

  if (!repo || !repoId || !category || !categoryId) {
    return (
      <div className="glass-panel rounded-xl p-5 text-sm text-slate-300">
        Configure `NEXT_PUBLIC_GISCUS_*` env variables to enable moderated blog comments.
      </div>
    );
  }

  return <div ref={containerRef} className="mt-6" />;
}
