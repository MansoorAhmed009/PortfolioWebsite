import { cacheTags, revalidateSeconds } from "@/lib/cache";
import { mockAdminQuickLinks, mockPosts, mockProjects } from "@/lib/mock-data";
import { hasSanityConfig, sanityClient } from "@/lib/sanity/client";
import {
  adminSettingsQuery,
  postBySlugQuery,
  postsQuery,
  postSlugsQuery,
  projectBySlugQuery,
  projectsQuery,
  projectSlugsQuery
} from "@/lib/sanity/queries";
import type { AdminQuickLink, BlogPost, Project } from "@/lib/types";

type SlugItem = { slug: string };
type QueryOptions = {
  revalidate?: number;
  tags?: string[];
};

type AdminSettingsResult = {
  quickLinks?: AdminQuickLink[];
};

function sortAdminLinksByOrder(links: AdminQuickLink[]) {
  return [...links].sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));
}

function filterEnabledAdminLinks(links: AdminQuickLink[]) {
  return links.filter((link) => link.enabled !== false);
}

async function fetchWithFallback<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
  options: QueryOptions = {}
) {
  if (!hasSanityConfig) {
    return fallback;
  }

  try {
    const data = await sanityClient.fetch<T>(query, params, {
      next: {
        revalidate: options.revalidate ?? revalidateSeconds.content,
        tags: options.tags
      }
    });

    return data ?? fallback;
  } catch {
    return fallback;
  }
}

export type PaginationOptions = { offset?: number; limit?: number };

export async function getPosts(opts: PaginationOptions = {}) {
  const { offset = 0, limit = 20 } = opts;
  const slice = `[${offset}...${offset + limit}]`;
  const query = `${postsQuery}${slice}`;
  const fallback = mockPosts.slice(offset, offset + limit);

  return fetchWithFallback<BlogPost[]>(query, {}, fallback, {
    tags: [cacheTags.posts]
  });
}

export async function getPostBySlug(slug: string) {
  const fallback = mockPosts.find((post) => post.slug === slug) || null;
  return fetchWithFallback<BlogPost | null>(postBySlugQuery, { slug }, fallback, {
    tags: [cacheTags.posts]
  });
}

export async function getProjects(opts: PaginationOptions = {}) {
  const { offset = 0, limit = 20 } = opts;
  const slice = `[${offset}...${offset + limit}]`;
  const query = `${projectsQuery}${slice}`;
  const fallback = mockProjects.slice(offset, offset + limit);

  return fetchWithFallback<Project[]>(query, {}, fallback, {
    tags: [cacheTags.projects]
  });
}

export async function getProjectBySlug(slug: string) {
  const fallback = mockProjects.find((project) => project.slug === slug) || null;
  return fetchWithFallback<Project | null>(projectBySlugQuery, { slug }, fallback, {
    tags: [cacheTags.projects]
  });
}

export async function getPostSlugs() {
  const fallback = mockPosts.map((post) => ({ slug: post.slug }));
  return fetchWithFallback<SlugItem[]>(postSlugsQuery, {}, fallback, {
    tags: [cacheTags.posts]
  });
}

export async function getProjectSlugs() {
  const fallback = mockProjects.map((project) => ({ slug: project.slug }));
  return fetchWithFallback<SlugItem[]>(projectSlugsQuery, {}, fallback, {
    tags: [cacheTags.projects]
  });
}

export async function getAdminQuickLinks() {
  const fallback = filterEnabledAdminLinks(sortAdminLinksByOrder(mockAdminQuickLinks));

  const settings = await fetchWithFallback<AdminSettingsResult | null>(adminSettingsQuery, {}, null, {
    revalidate: revalidateSeconds.admin,
    tags: [cacheTags.adminQuickLinks]
  });

  if (!settings?.quickLinks?.length) {
    return fallback;
  }

  return filterEnabledAdminLinks(sortAdminLinksByOrder(settings.quickLinks));
}

export async function getAdminQuickLinksForAdmin() {
  const fallback = sortAdminLinksByOrder(mockAdminQuickLinks);

  const settings = await fetchWithFallback<AdminSettingsResult | null>(adminSettingsQuery, {}, null, {
    revalidate: revalidateSeconds.admin,
    tags: [cacheTags.adminQuickLinks]
  });

  if (!settings?.quickLinks?.length) {
    return fallback;
  }

  return sortAdminLinksByOrder(settings.quickLinks);
}
