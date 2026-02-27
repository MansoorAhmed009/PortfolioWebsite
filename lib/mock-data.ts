import type { AdminQuickLink, BlogPost, Project, SkillStat } from "@/lib/types";

export const skillStats: SkillStat[] = [
  {
    label: "AI + ML",
    value: 91,
    description: "Predictive modeling and feature engineering for materials property inference."
  },
  {
    label: "Data Analysis",
    value: 88,
    description: "Python-driven scientific analysis, statistical design, and benchmarking."
  },
  {
    label: "React + Next.js",
    value: 83,
    description: "Technical product interfaces for simulation, visualization, and workflows."
  },
  {
    label: "Databases",
    value: 86,
    description: "Schema design and data pipelines for scientific records and experiment logs."
  }
];

export const mockProjects: Project[] = [
  {
    _id: "project-1",
    title: "HEA Property Predictor",
    slug: "hea-property-predictor",
    summary: "Built a surrogate model to estimate hardness and corrosion resistance for HEAs.",
    problem:
      "Experimental cycles are slow and expensive. The challenge was to rank alloy candidates before lab validation.",
    techStack: ["Python", "XGBoost", "SHAP", "FastAPI", "Next.js"],
    demoUrl: "https://example.com/demo/hea",
    githubUrl: "https://github.com/example/hea-property-predictor",
    featured: true,
    publishedAt: "2025-08-14",
    impact: "Reduced candidate screening time by 62% in early-stage alloy exploration."
  },
  {
    _id: "project-2",
    title: "Materials RAG Assistant",
    slug: "materials-rag-assistant",
    summary: "Created a retrieval-augmented assistant across papers, datasheets, and lab notes.",
    problem:
      "Domain context was fragmented across PDFs and local notes. Teams needed semantically searchable knowledge.",
    techStack: ["LangChain", "OpenAI", "PostgreSQL", "TypeScript", "Vercel"],
    demoUrl: "https://example.com/demo/rag",
    githubUrl: "https://github.com/example/materials-rag-assistant",
    featured: true,
    publishedAt: "2025-10-21",
    impact: "Improved literature triage speed and reduced duplicate experiments."
  },
  {
    _id: "project-3",
    title: "Experiment Optimizer",
    slug: "experiment-optimizer",
    summary: "Bayesian optimization loop for process parameter recommendation.",
    problem:
      "Process windows for new alloys required many trial runs. We needed data-efficient search for optimum settings.",
    techStack: ["BoTorch", "PyTorch", "Plotly", "Next.js"],
    demoUrl: "https://example.com/demo/optimizer",
    githubUrl: "https://github.com/example/experiment-optimizer",
    featured: false,
    publishedAt: "2025-05-02",
    impact: "Cut optimization experiments by nearly half for selected process routes."
  }
];

export const mockPosts: BlogPost[] = [
  {
    _id: "post-1",
    title: "Designing Feature Spaces for Alloy Prediction",
    slug: "feature-spaces-for-alloy-prediction",
    excerpt:
      "A practical framework for encoding chemistry, process parameters, and microstructure proxies into robust model features.",
    tags: ["materials ai", "feature engineering", "ml"],
    publishedAt: "2025-09-05"
  },
  {
    _id: "post-2",
    title: "RAG Workflows for Materials Literature",
    slug: "rag-workflows-for-materials-literature",
    excerpt:
      "How to build retrieval pipelines that stay grounded in peer-reviewed papers and internal lab reports.",
    tags: ["rag", "llm", "knowledge systems"],
    publishedAt: "2025-11-16"
  },
  {
    _id: "post-3",
    title: "Optimization Loops for Experimental Planning",
    slug: "optimization-loops-for-experimental-planning",
    excerpt:
      "Turning historical experiment logs into actionable recommendations with Bayesian optimization.",
    tags: ["optimization", "bayesian", "experimentation"],
    publishedAt: "2025-07-11"
  }
];

export const mockAdminQuickLinks: AdminQuickLink[] = [
  {
    title: "Manage Blogs + Projects",
    description: "Create, edit, and delete posts and projects in Sanity Studio.",
    href: "/studio",
    isExternal: false,
    category: "content",
    order: 1,
    enabled: true
  },
  {
    title: "Moderate Comments",
    description: "Review GitHub Discussions used by Giscus comments.",
    href: "https://github.com/discussions",
    isExternal: true,
    category: "comments",
    order: 2,
    enabled: true
  },
  {
    title: "Contact Submissions",
    description: "Track and respond to contact messages in Formspree.",
    href: "https://formspree.io/forms",
    isExternal: true,
    category: "contacts",
    order: 3,
    enabled: true
  },
  {
    title: "Traffic Analytics",
    description: "Analyze audience behavior and conversion performance in GA4.",
    href: "https://analytics.google.com/",
    isExternal: true,
    category: "analytics",
    order: 4,
    enabled: true
  }
];