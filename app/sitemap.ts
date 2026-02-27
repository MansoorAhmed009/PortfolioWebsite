import type { MetadataRoute } from "next";

import { getPostSlugs, getProjectSlugs } from "@/lib/sanity/data";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, projectSlugs] = await Promise.all([getPostSlugs(), getProjectSlugs()]);
  const now = new Date();

  const staticPages = ["", "/about", "/projects", "/blog", "/contact"].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8
  }));

  const posts = postSlugs.map(({ slug }) => ({
    url: `${siteConfig.url}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7
  }));

  const projects = projectSlugs.map(({ slug }) => ({
    url: `${siteConfig.url}/projects/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75
  }));

  return [...staticPages, ...posts, ...projects];
}
