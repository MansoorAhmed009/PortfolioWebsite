import { groq } from "next-sanity";

export const postsQuery = groq`
*[_type == "post"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  excerpt,
  body,
  tags,
  websiteUrl,
  githubUrl,
  publishedAt,
  coverImage
}
`;

export const postBySlugQuery = groq`
*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  body,
  tags,
  websiteUrl,
  githubUrl,
  publishedAt,
  coverImage
}
`;

export const postSlugsQuery = groq`
*[_type == "post" && defined(slug.current)][]{
  "slug": slug.current
}
`;

export const projectsQuery = groq`
*[_type == "project"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  summary,
  problem,
  techStack,
  demoUrl,
  githubUrl,
  featured,
  publishedAt,
  coverImage,
  impact
}
`;

export const projectBySlugQuery = groq`
*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  summary,
  problem,
  techStack,
  demoUrl,
  githubUrl,
  featured,
  publishedAt,
  coverImage,
  impact
}
`;

export const projectSlugsQuery = groq`
*[_type == "project" && defined(slug.current)][]{
  "slug": slug.current
}
`;

export const adminSettingsQuery = groq`
*[_type == "adminSettings"][0]{
  quickLinks[]{
    _key,
    title,
    description,
    href,
    isExternal,
    category,
    order,
    enabled
  }
}
`;
