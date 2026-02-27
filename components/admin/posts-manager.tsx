"use client";

import { useCallback, useEffect, useState } from "react";

import type { BlogPost } from "@/lib/types";

type ApiEnvelope<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

function currentDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function toDraft(post?: Partial<BlogPost> | null): Partial<BlogPost> {
  return {
    _id: post?._id,
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    tags: Array.isArray(post?.tags) ? post.tags : [],
    websiteUrl: post?.websiteUrl ?? "",
    githubUrl: post?.githubUrl ?? "",
    publishedAt: post?.publishedAt ? post.publishedAt.slice(0, 10) : currentDateInputValue()
  };
}

function normalizePublishedAt(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
}

export function PostsManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function parseJson<T>(response: Response): Promise<ApiEnvelope<T>> {
    try {
      return (await response.json()) as ApiEnvelope<T>;
    } catch {
      return { ok: false, error: "Received an invalid response from the server." };
    }
  }

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/posts?limit=100", { cache: "no-store" });
      const body = await parseJson<BlogPost[]>(response);
      if (!response.ok || !body.ok) {
        setPosts([]);
        setError(body.error || "Failed to load posts.");
        return;
      }
      setPosts(Array.isArray(body.data) ? body.data : []);
    } catch (fetchError) {
      setPosts([]);
      setError(String(fetchError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  async function refresh() {
    await loadPosts();
  }

  function normalizeTags(str: string) {
    return str
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  }

  function validate(post: Partial<BlogPost>) {
    if (!post.title || !post.slug || !post.excerpt) {
      return "Title, slug and excerpt are required.";
    }
    if ((post.title || "").trim().length < 8) return "Title must be at least 8 characters.";
    if ((post.excerpt || "").trim().length < 40) return "Excerpt must be at least 40 characters.";
    if (!post.publishedAt) return "Published date is required.";
    return null;
  }

  async function save(post: Partial<BlogPost>) {
    const validationError = validate(post);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);
    const id = post._id;
    const method = id ? "PATCH" : "POST";
    const url = id ? `/api/posts/${encodeURIComponent(id)}` : "/api/posts";

    const payload: Record<string, unknown> = {
      title: post.title?.trim(),
      slug: post.slug?.trim(),
      excerpt: post.excerpt?.trim(),
      publishedAt: normalizePublishedAt(String(post.publishedAt)),
      tags: Array.isArray(post.tags) ? post.tags : []
    };
    if (post.websiteUrl?.trim()) payload.websiteUrl = post.websiteUrl.trim();
    if (post.githubUrl?.trim()) payload.githubUrl = post.githubUrl.trim();
    if (!id) {
      payload.body = [];
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const body = await parseJson<unknown>(response);
      if (!response.ok || !body.ok) {
        setError(body.error || "Failed to save post.");
        return;
      }

      setSuccess(id ? "Post updated." : "Post created.");
      setTimeout(() => setSuccess(null), 2400);
      await refresh();
      setEditing(null);
    } catch (saveError) {
      setError(String(saveError));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    setError(null);
    const response = await fetch(`/api/posts/${encodeURIComponent(id)}`, { method: "DELETE" });
    const body = await parseJson<unknown>(response);
    if (!response.ok || !body.ok) {
      setError(body.error || "Failed to delete post.");
      return;
    }
    setSuccess("Post deleted.");
    setTimeout(() => setSuccess(null), 2400);
    await refresh();
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-700/60 bg-slate-950/35 p-4">
      {error ? (
        <div className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</div>
      ) : null}
      {success ? (
        <div className="rounded-lg border border-emerald-400/35 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {success}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          className="focus-ring rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-500"
          onClick={() => setEditing(toDraft())}
          type="button"
        >
          New Post
        </button>
        <button
          className="focus-ring rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-400 hover:text-white"
          onClick={() => void refresh()}
          type="button"
        >
          Refresh
        </button>
      </div>

      {editing ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void save(editing);
          }}
          className="space-y-3 rounded-xl border border-slate-700/70 bg-slate-900/40 p-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Title</label>
              <input
                value={editing.title || ""}
                onChange={(event) => {
                  const title = event.target.value;
                  setEditing((previous) => ({ ...(previous || {}), title, slug: previous?.slug || generateSlug(title) }));
                }}
                className="focus-ring w-full rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-white"
                placeholder="Post title"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Slug</label>
              <input
                value={editing.slug || ""}
                onChange={(event) => setEditing((previous) => ({ ...(previous || {}), slug: event.target.value }))}
                className="focus-ring w-full rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-white"
                placeholder="post-slug"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Excerpt</label>
            <textarea
              value={editing.excerpt || ""}
              onChange={(event) => setEditing((previous) => ({ ...(previous || {}), excerpt: event.target.value }))}
              className="focus-ring min-h-[96px] w-full rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-white"
              placeholder="A clear summary for cards and previews."
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Tags</label>
              <input
                value={Array.isArray(editing.tags) ? editing.tags.join(", ") : ""}
                onChange={(event) =>
                  setEditing((previous) => ({ ...(previous || {}), tags: normalizeTags(event.target.value) }))
                }
                className="focus-ring w-full rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-white"
                placeholder="ai, materials, ml"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                Published Date
              </label>
              <input
                type="date"
                value={editing.publishedAt ? String(editing.publishedAt).slice(0, 10) : ""}
                onChange={(event) => setEditing((previous) => ({ ...(previous || {}), publishedAt: event.target.value }))}
                className="focus-ring w-full rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Website URL</label>
              <input
                value={editing.websiteUrl || ""}
                onChange={(event) =>
                  setEditing((previous) => ({ ...(previous || {}), websiteUrl: event.target.value }))
                }
                className="focus-ring w-full rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-white"
                placeholder="https://example.com/article"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">GitHub URL</label>
              <input
                value={editing.githubUrl || ""}
                onChange={(event) =>
                  setEditing((previous) => ({ ...(previous || {}), githubUrl: event.target.value }))
                }
                className="focus-ring w-full rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-white"
                placeholder="https://github.com/org/repo"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="focus-ring rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : editing._id ? "Update Post" : "Create Post"}
            </button>
            <button
              className="focus-ring rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-400 hover:text-white"
              onClick={() => setEditing(null)}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {loading ? <p className="text-sm text-slate-300">Loading posts...</p> : null}
      {!loading && posts.length === 0 ? (
        <p className="rounded-lg border border-slate-700/70 bg-slate-900/40 px-3 py-3 text-sm text-slate-300">
          No posts found.
        </p>
      ) : null}

      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post._id} className="rounded-lg border border-slate-700/70 bg-slate-900/45 px-3 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-slate-100">{post.title}</p>
                <p className="text-xs text-slate-400">/{post.slug}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="focus-ring rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-200 transition hover:border-blue-400 hover:text-blue-300"
                  onClick={() => setEditing(toDraft(post))}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="focus-ring rounded-md border border-rose-500/50 px-2 py-1 text-xs text-rose-200 transition hover:border-rose-400 hover:text-rose-100"
                  onClick={() => void remove(post._id)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-slate-300">{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
