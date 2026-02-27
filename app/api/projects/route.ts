import type { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdminRequest } from "@/lib/api/admin-auth";
import { jsonError, jsonOk } from "@/lib/api/http";
import { projectCreateSchema, projectUpdateSchema } from "@/lib/api/schemas";
import { cacheTags } from "@/lib/cache";
import { getProjects } from "@/lib/sanity/data";
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

  const projects = await getProjects({ offset, limit });
  return withCacheHeaders(jsonOk(projects));
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;

  if (!hasSanityConfig || !hasSanityWriteToken) {
    return jsonError("Sanity write configuration is missing.", 503);
  }

  try {
    const payload = await request.json();
    const parsed = projectCreateSchema.safeParse(payload);

    if (!parsed.success) {
      return jsonError("Invalid payload.", 422, parsed.error.flatten());
    }

    const created = await sanityWriteClient.create({
      _type: "project",
      title: parsed.data.title,
      slug: {
        _type: "slug",
        current: parsed.data.slug
      },
      summary: parsed.data.summary,
      problem: parsed.data.problem,
      techStack: parsed.data.techStack,
      featured: parsed.data.featured,
      publishedAt: parsed.data.publishedAt,
      ...(parsed.data.impact ? { impact: parsed.data.impact } : {}),
      ...(parsed.data.demoUrl ? { demoUrl: parsed.data.demoUrl } : {}),
      ...(parsed.data.githubUrl ? { githubUrl: parsed.data.githubUrl } : {}),
      ...(parsed.data.coverImage ? { coverImage: parsed.data.coverImage } : {})
    });

    revalidateTag(cacheTags.projects);
    revalidatePath("/");
    revalidatePath("/projects");

    return jsonOk(created, 201);
  } catch {
    return jsonError("Failed to create project.", 500);
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
      return jsonError("Missing project ID.", 422);
    }

    const parsed = projectUpdateSchema.safeParse(updates);
    if (!parsed.success) {
      return jsonError("Invalid update payload.", 422, parsed.error.flatten());
    }

    await sanityWriteClient.patch(id).set(parsed.data).commit();
    revalidateTag(cacheTags.projects);
    revalidatePath("/projects");
    return jsonOk({ updated: true });
  } catch {
    return jsonError("Failed to update project.", 500);
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
    if (!id) return jsonError("Missing project ID.", 422);

    await sanityWriteClient.delete(id);
    revalidateTag(cacheTags.projects);
    revalidatePath("/projects");
    return jsonOk({ deleted: true });
  } catch {
    return jsonError("Failed to delete project.", 500);
  }
}
