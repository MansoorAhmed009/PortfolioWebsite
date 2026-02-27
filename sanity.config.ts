import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { sanityDataset, sanityProjectIdOrFallback } from "./lib/sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: process.env.SANITY_STUDIO_PROJECT_TITLE || "Material Informatics Studio",
  projectId: sanityProjectIdOrFallback,
  dataset: sanityDataset,
  basePath: "/studio",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes
  }
});
