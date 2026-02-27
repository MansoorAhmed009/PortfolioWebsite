import { createClient } from "next-sanity";

import {
  hasSanityConfig,
  hasSanityWriteToken,
  sanityDataset,
  sanityProjectIdOrFallback
} from "@/lib/sanity/env";

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const readToken = process.env.SANITY_API_READ_TOKEN;
const writeToken = process.env.SANITY_API_WRITE_TOKEN;

export { hasSanityConfig, hasSanityWriteToken };

const baseConfig = {
  projectId: sanityProjectIdOrFallback,
  dataset: sanityDataset,
  apiVersion,
  stega: {
    enabled: false
  }
} as const;

export const sanityClient = createClient({
  ...baseConfig,
  useCdn: true,
  perspective: "published"
});

export const sanityServerClient = createClient({
  ...baseConfig,
  useCdn: false,
  token: readToken,
  perspective: "published"
});

export const sanityWriteClient = createClient({
  ...baseConfig,
  useCdn: false,
  token: writeToken,
  perspective: "published"
});