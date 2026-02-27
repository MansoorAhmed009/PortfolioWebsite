import type { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdminRequest } from "@/lib/api/admin-auth";
import { jsonError, jsonOk } from "@/lib/api/http";
import { postUpdateSchema } from "@/lib/api/schemas";
import { cacheTags } from "@/lib/cache";
import { hasSanityConfig, hasSanityWriteToken, sanityWriteClient } from "@/lib/sanity/client";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  if (!hasSanityConfig || !hasSanityWriteToken) {
    return jsonError("Sanity write configuration is missing.", 503);
  }

  const { id: documentId } = await params;

  try {
    const payload = await request.json();
    const parsed = postUpdateSchema.safeParse(payload);

    if (!parsed.success) {
      return jsonError("Invalid payload.", 422, parsed.error.flatten());
    }

    const patch = sanityWriteClient.patch(documentId);
    const data = parsed.data;

    if (data.title !== undefined) patch.set({ title: data.title });
    if (data.excerpt !== undefined) patch.set({ excerpt: data.excerpt });
    if (data.tags !== undefined) patch.set({ tags: data.tags });
    if (data.publishedAt !== undefined) patch.set({ publishedAt: data.publishedAt });
    if (data.body !== undefined) patch.set({ body: data.body });
    if (data.coverImage !== undefined) patch.set({ coverImage: data.coverImage });
    if (data.websiteUrl !== undefined) patch.set({ websiteUrl: data.websiteUrl });
    if (data.githubUrl !== undefined) patch.set({ githubUrl: data.githubUrl });
    if (data.slug !== undefined) {
      patch.set({
        slug: {
          _type: "slug",
          current: data.slug
        }
      });
    }

    const updated = await patch.commit({ autoGenerateArrayKeys: true });

    revalidateTag(cacheTags.posts);
    revalidatePath("/");
    revalidatePath("/blog");

    return jsonOk(updated);
  } catch {
    return jsonError("Failed to update post.", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  if (!hasSanityConfig || !hasSanityWriteToken) {
    return jsonError("Sanity write configuration is missing.", 503);
  }

  const { id } = await params;

  try {
    await sanityWriteClient.delete(id);

    revalidateTag(cacheTags.posts);
    revalidatePath("/");
    revalidatePath("/blog");

    return jsonOk({ id, deleted: true });
  } catch {
    return jsonError("Failed to delete post.", 500);
  }
}
