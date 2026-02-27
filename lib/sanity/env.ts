const SANITY_PROJECT_ID_PATTERN = /^[a-z0-9-]+$/;
const SANITY_DATASET_PATTERN = /^[a-z0-9_]+$/;

const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ?? "";
const rawDataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ?? "";
const rawWriteToken = process.env.SANITY_API_WRITE_TOKEN?.trim() ?? "";

export const hasValidSanityProjectId = SANITY_PROJECT_ID_PATTERN.test(rawProjectId);
export const hasValidSanityDataset = SANITY_DATASET_PATTERN.test(rawDataset || "production");

export const sanityProjectId = hasValidSanityProjectId ? rawProjectId : "";
export const sanityProjectIdOrFallback = sanityProjectId || "demo-project";
export const sanityDataset = hasValidSanityDataset ? rawDataset || "production" : "production";

export const hasSanityConfig = hasValidSanityProjectId && hasValidSanityDataset;
export const hasSanityWriteToken = Boolean(rawWriteToken);