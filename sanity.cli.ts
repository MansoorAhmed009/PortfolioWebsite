import { defineCliConfig } from "sanity/cli";

import { sanityDataset, sanityProjectIdOrFallback } from "./lib/sanity/env";

export default defineCliConfig({
  api: {
    projectId: sanityProjectIdOrFallback,
    dataset: sanityDataset
  }
});
