"use client";

import { useCallback, useEffect, useState } from "react";

import type { Project } from "@/lib/types";

type ApiEnvelope<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

function currentDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function toDraft(project?: Partial<Project> | null): Partial<Project> {
  return {
    _id: project?._id,
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    summary: project?.summary ?? "",
    problem: project?.problem ?? "",
    impact: project?.impact ?? "",
    techStack: Array.isArray(project?.techStack) ? project.techStack : [],
    demoUrl: project?.demoUrl ?? "",
    githubUrl: project?.githubUrl ?? "",
    featured: Boolean(project?.featured),
    publishedAt: project?.publishedAt ? project.publishedAt.slice(0, 10) : currentDateInputValue()
  };
}

function normalizePublishedAt(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
}

export function ProjectsManager() {
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
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

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/projects?limit=100", { cache: "no-store" });
      const body = await parseJson<Project[]>(response);
      if (!response.ok || !body.ok) {
        setItems([]);
        setError(body.error || "Failed to load projects.");
        return;
      }
      setItems(Array.isArray(body.data) ? body.data : []);
    } catch (fetchError) {
      setItems([]);
      setError(String(fetchError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  async function refresh() {
    await loadProjects();
  }

  function normalizeList(str: string) {
    return str
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  }

  function validate(project: Partial<Project>) {
    if (!project.title || !project.slug) return "Title and slug are required.";
    if ((project.title || "").trim().length < 6) return "Title must be at least 6 characters.";
    if ((project.summary || "").trim().length < 30) return "Summary must be at least 30 characters.";
    if ((project.problem || "").trim().length < 50) return "Problem statement must be at least 50 characters.";
    if (!project.publishedAt) return "Published date is required.";
    if (!Array.isArray(project.techStack) || project.techStack.length < 2) return "At least two tech stack items are required.";
    return null;
  }

  async function save(project: Partial<Project>) {
    const validationError = validate(project);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);
    const id = project._id;
    const method = id ? "PATCH" : "POST";
    const url = id ? `/api/projects/${encodeURIComponent(id)}` : "/api/projects";
    const payload: Record<string, unknown> = {
      title: project.title?.trim(),
      slug: project.slug?.trim(),
      summary: project.summary?.trim(),
      problem: project.problem?.trim(),
      techStack: Array.isArray(project.techStack) ? project.techStack : [],
      featured: Boolean(project.featured),
      publishedAt: normalizePublishedAt(String(project.publishedAt))
    };

    if (project.impact?.trim()) payload.impact = project.impact.trim();
    if (project.demoUrl?.trim()) payload.demoUrl = project.demoUrl.trim();
    if (project.githubUrl?.trim()) payload.githubUrl = project.githubUrl.trim();

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const body = await parseJson<unknown>(response);
      if (!response.ok || !body.ok) {
        setError(body.error || "Failed to save project.");
        return;
      }

      setSuccess(id ? "Project updated." : "Project created.");
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
    if (!confirm("Delete this project?")) return;
    setError(null);
    const response = await fetch(`/api/projects/${encodeURIComponent(id)}`, { method: "DELETE" });
    const body = await parseJson<unknown>(response);
    if (!response.ok || !body.ok) {
      setError(body.error || "Failed to delete project.");
      return;
    }
    setSuccess("Project deleted.");
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
          New Project
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
                placeholder="Project title"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Slug</label>
              <input
                value={editing.slug || ""}
                onChange={(event) => setEditing((previous) => ({ ...(previous || {}), slug: event.target.value }))}
                className="focus-ring w-full rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-white"
                placeholder="project-slug"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Summary</label>
            <textarea
              value={editing.summary || ""}
              onChange={(event) => setEditing((previous) => ({ ...(previous || {}), summary: event.target.value }))}
              className="focus-ring min-h-[92px] w-full rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-white"
              placeholder="Short overview shown on project cards."
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Problem</label>
            <textarea
              value={editing.problem || ""}
              onChange={(event) => setEditing((previous) => ({ ...(previous || {}), problem: event.target.value }))}
              className="focus-ring min-h-[112px] w-full rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-white"
              placeholder="What challenge this project solves."
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Tech Stack</label>
              <input
                value={Array.isArray(editing.techStack) ? editing.techStack.join(", ") : ""}
                onChange={(event) =>
                  setEditing((previous) => ({ ...(previous || {}), techStack: normalizeList(event.target.value) }))
                }
                className="focus-ring w-full rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-white"
                placeholder="Next.js, Sanity, TypeScript"
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
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Demo URL</label>
              <input
                value={editing.demoUrl || ""}
                onChange={(event) => setEditing((previous) => ({ ...(previous || {}), demoUrl: event.target.value }))}
                className="focus-ring w-full rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-white"
                placeholder="https://demo.example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">GitHub URL</label>
              <input
                value={editing.githubUrl || ""}
                onChange={(event) => setEditing((previous) => ({ ...(previous || {}), githubUrl: event.target.value }))}
                className="focus-ring w-full rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-white"
                placeholder="https://github.com/org/repo"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Impact</label>
            <textarea
              value={editing.impact || ""}
              onChange={(event) => setEditing((previous) => ({ ...(previous || {}), impact: event.target.value }))}
              className="focus-ring min-h-[84px] w-full rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-white"
              placeholder="Optional measurable outcomes."
            />
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={Boolean(editing.featured)}
              onChange={(event) => setEditing((previous) => ({ ...(previous || {}), featured: event.target.checked }))}
              className="h-4 w-4 rounded border-slate-500 bg-slate-900"
            />
            Featured project
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              className="focus-ring rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : editing._id ? "Update Project" : "Create Project"}
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

      {loading ? <p className="text-sm text-slate-300">Loading projects...</p> : null}
      {!loading && items.length === 0 ? (
        <p className="rounded-lg border border-slate-700/70 bg-slate-900/40 px-3 py-3 text-sm text-slate-300">
          No projects found.
        </p>
      ) : null}

      <ul className="space-y-2">
        {items.map((project) => (
          <li key={project._id} className="rounded-lg border border-slate-700/70 bg-slate-900/45 px-3 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-slate-100">{project.title}</p>
                <p className="text-xs text-slate-400">/{project.slug}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="focus-ring rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-200 transition hover:border-blue-400 hover:text-blue-300"
                  onClick={() => setEditing(toDraft(project))}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="focus-ring rounded-md border border-rose-500/50 px-2 py-1 text-xs text-rose-200 transition hover:border-rose-400 hover:text-rose-100"
                  onClick={() => void remove(project._id)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-slate-300">{project.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
