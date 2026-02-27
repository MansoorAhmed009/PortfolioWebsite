import type { NextRequest } from "next/server";
import { groq } from "next-sanity";
import { revalidateTag } from "next/cache";

import { requireAdminRequest } from "@/lib/api/admin-auth";
import { jsonError, jsonOk } from "@/lib/api/http";
import { adminQuickLinksUpdateSchema } from "@/lib/api/schemas";
import { cacheTags } from "@/lib/cache";
import { getAdminQuickLinksForAdmin } from "@/lib/sanity/data";
import { hasSanityConfig, hasSanityWriteToken, sanityWriteClient } from "@/lib/sanity/client";

export const runtime = "nodejs";

const adminSettingsIdQuery = groq`*[_type == "adminSettings"][0]{_id}`;

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  const links = await getAdminQuickLinksForAdmin();
  return jsonOk(links);
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  if (!hasSanityConfig || !hasSanityWriteToken) {
    return jsonError("Sanity write configuration is missing.", 503);
  }

  try {
    const payload = await request.json();
    const parsed = adminQuickLinksUpdateSchema.safeParse(payload);

    if (!parsed.success) {
      return jsonError("Invalid payload.", 422, parsed.error.flatten());
    }

    const existing = await sanityWriteClient.fetch<{ _id: string } | null>(adminSettingsIdQuery);

    const doc = {
      _type: "adminSettings",
      quickLinks: parsed.data.quickLinks
    };

    if (existing?._id) {
      await sanityWriteClient.patch(existing._id).set(doc).commit({ autoGenerateArrayKeys: true });
    } else {
      await sanityWriteClient.create(doc);
    }

    revalidateTag(cacheTags.adminQuickLinks);
    return jsonOk({ updated: true });
  } catch {
    return jsonError("Failed to update admin quick links.", 500);
  }
}
