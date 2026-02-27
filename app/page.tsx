import { AboutPreviewSection } from "@/components/sections/about-preview-section";
import { ContactCtaSection } from "@/components/sections/contact-cta-section";
import { FeaturedProjectsSection } from "@/components/sections/featured-projects-section";
import { HeroSection } from "@/components/sections/hero-section";
import { LatestPostsSection } from "@/components/sections/latest-posts-section";
import { getPosts, getProjects } from "@/lib/sanity/data";
import { siteConfig } from "@/lib/site-config";

// use a literal value here so Next can statically analyze the export
export const revalidate = 60; // 1 minute ISR for faster updates

export default async function HomePage() {
  const [projects, posts] = await Promise.all([getProjects({ limit: 6 }), getPosts({ limit: 6 })]);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    knowsAbout: [
      "Material Informatics",
      "Machine Learning for Materials",
      "Computational Materials Engineering",
      "Research Workflow Automation"
    ]
  };

  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);
  const latestPosts = posts.slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <HeroSection />
      <AboutPreviewSection />
      <FeaturedProjectsSection projects={featuredProjects.length ? featuredProjects : projects.slice(0, 3)} />
      <LatestPostsSection posts={latestPosts} />
      <ContactCtaSection />
    </>
  );
}