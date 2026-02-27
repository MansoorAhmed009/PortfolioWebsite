export type PortableTextBlock = {
  _type: string;
  [key: string]: unknown;
};

export type SanityImage = {
  asset?: {
    _ref?: string;
    url?: string;
  };
  alt?: string;
};

export interface Project {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  problem: string;
  techStack: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  publishedAt: string;
  coverImage?: SanityImage;
  impact?: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  body?: PortableTextBlock[];
  tags: string[];
  publishedAt: string;
  websiteUrl?: string;
  githubUrl?: string;
  coverImage?: SanityImage;
}

export interface SkillStat {
  label: string;
  value: number;
  description: string;
}

export interface AdminQuickLink {
  _key?: string;
  title: string;
  description: string;
  href: string;
  isExternal?: boolean;
  category?: "content" | "comments" | "contacts" | "analytics" | "operations";
  order?: number;
  enabled?: boolean;
}
