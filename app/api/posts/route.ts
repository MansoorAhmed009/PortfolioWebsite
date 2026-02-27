import type { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdminRequest } from "@/lib/api/admin-auth";
import { jsonError, jsonOk } from "@/lib/api/http";
import { postCreateSchema, postUpdateSchema } from "@/lib/api/schemas";
import { cacheTags } from "@/lib/cache";
import { getPosts } from "@/lib/sanity/data";
import { hasSanityConfig, hasSanityWriteToken, sanityWriteClient } from "@/lib/sanity/client";

export const runtime = "nodejs";

function withCacheHeaders(response: NextResponse) {
  response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
  return response;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);
  const limit = parseInt(url.searchParams.get("limit") || "20", 10);

  const posts = await getPosts({ offset, limit });
  return withCacheHeaders(jsonOk(posts));
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  if (!hasSanityConfig || !hasSanityWriteToken) {
    return jsonError("Sanity write configuration is missing.", 503);
  }

  try {
    const payload = await request.json();
    const parsed = postCreateSchema.safeParse(payload);

    if (!parsed.success) {
      return jsonError("Invalid payload.", 422, parsed.error.flatten());
    }

    const created = await sanityWriteClient.create({
      _type: "post",
      title: parsed.data.title,
      slug: {
        _type: "slug",
        current: parsed.data.slug
      },
      excerpt: parsed.data.excerpt,
      tags: parsed.data.tags,
      publishedAt: parsed.data.publishedAt,
      body: parsed.data.body,
      ...(parsed.data.websiteUrl ? { websiteUrl: parsed.data.websiteUrl } : {}),
      ...(parsed.data.githubUrl ? { githubUrl: parsed.data.githubUrl } : {}),
      ...(parsed.data.coverImage ? { coverImage: parsed.data.coverImage } : {})
    });

    revalidateTag(cacheTags.posts);
    revalidatePath("/");
    revalidatePath("/blog");

    return jsonOk(created, 201);
  } catch {
    return jsonError("Failed to create post.", 500);
  }
}

export async function PATCH(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  if (!hasSanityConfig || !hasSanityWriteToken) {
    return jsonError("Sanity write configuration is missing.", 503);
  }

  try {
    const payload = await request.json();
    const { id, ...updates } = payload;
    if (!id) {
      return jsonError("Missing post ID.", 422);
    }

    const parsed = postUpdateSchema.safeParse(updates);
    if (!parsed.success) {
      return jsonError("Invalid update payload.", 422, parsed.error.flatten());
    }

    const patch = sanityWriteClient.patch(id);
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

    await patch.commit({ autoGenerateArrayKeys: true });
    revalidateTag(cacheTags.posts);
    revalidatePath("/blog");
    return jsonOk({ updated: true });
  } catch {
    return jsonError("Failed to update post.", 500);
  }
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  if (!hasSanityConfig || !hasSanityWriteToken) {
    return jsonError("Sanity write configuration is missing.", 503);
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return jsonError("Missing post ID.", 422);

    await sanityWriteClient.delete(id);
    revalidateTag(cacheTags.posts);
    revalidatePath("/blog");
    return jsonOk({ deleted: true });
  } catch {
    return jsonError("Failed to delete post.", 500);
  }
}
