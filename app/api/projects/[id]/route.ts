import type { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdminRequest } from "@/lib/api/admin-auth";
import { jsonError, jsonOk } from "@/lib/api/http";
import { projectUpdateSchema } from "@/lib/api/schemas";
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
    const parsed = projectUpdateSchema.safeParse(payload);

    if (!parsed.success) {
      return jsonError("Invalid payload.", 422, parsed.error.flatten());
    }

    const patch = sanityWriteClient.patch(documentId);
    const data = parsed.data;

    if (data.title !== undefined) patch.set({ title: data.title });
    if (data.summary !== undefined) patch.set({ summary: data.summary });
    if (data.problem !== undefined) patch.set({ problem: data.problem });
    if (data.techStack !== undefined) patch.set({ techStack: data.techStack });
    if (data.featured !== undefined) patch.set({ featured: data.featured });
    if (data.publishedAt !== undefined) patch.set({ publishedAt: data.publishedAt });
    if (data.impact !== undefined) patch.set({ impact: data.impact });
    if (data.demoUrl !== undefined) patch.set({ demoUrl: data.demoUrl });
    if (data.githubUrl !== undefined) patch.set({ githubUrl: data.githubUrl });
    if (data.coverImage !== undefined) patch.set({ coverImage: data.coverImage });
    if (data.slug !== undefined) {
      patch.set({
        slug: {
          _type: "slug",
          current: data.slug
        }
      });
    }

    const updated = await patch.commit({ autoGenerateArrayKeys: true });

    revalidateTag(cacheTags.projects);
    revalidatePath("/");
    revalidatePath("/projects");

    return jsonOk(updated);
  } catch {
    return jsonError("Failed to update project.", 500);
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

    revalidateTag(cacheTags.projects);
    revalidatePath("/");
    revalidatePath("/projects");

    return jsonOk({ id, deleted: true });
  } catch {
    return jsonError("Failed to delete project.", 500);
  }
}