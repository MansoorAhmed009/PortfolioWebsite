export const cacheTags = {
  posts: "posts",
  projects: "projects",
  adminQuickLinks: "admin-quick-links"
} as const;

export const revalidateSeconds = {
  content: 60,
  admin: 60
} as const;