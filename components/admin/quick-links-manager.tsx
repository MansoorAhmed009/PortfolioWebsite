"use client";

import { useMemo, useState } from "react";

import type { AdminQuickLink } from "@/lib/types";

type ApiEnvelope<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type QuickLinksManagerProps = {
  initialLinks: AdminQuickLink[];
};

const categoryOptions: Array<NonNullable<AdminQuickLink["category"]>> = [
  "content",
  "comments",
  "contacts",
  "analytics",
  "operations"
];

function withOrder(links: AdminQuickLink[]) {
  return links.map((link, index) => ({
    ...link,
    order: index + 1
  }));
}

function normalizeLinkInput(link: AdminQuickLink): AdminQuickLink {
  return {
    _key: link._key,
    title: link.title ?? "",
    description: link.description ?? "",
    href: link.href ?? "",
    isExternal: Boolean(link.isExternal),
    category: link.category,
    order: link.order,
    enabled: link.enabled !== false
  };
}

function toInitialState(links: AdminQuickLink[]) {
  return withOrder(links.map(normalizeLinkInput));
}

export function QuickLinksManager({ initialLinks }: QuickLinksManagerProps) {
  const [links, setLinks] = useState<AdminQuickLink[]>(toInitialState(initialLinks));
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const hasLinks = useMemo(() => links.length > 0, [links.length]);

  async function parseJson<T>(response: Response): Promise<ApiEnvelope<T>> {
    try {
      return (await response.json()) as ApiEnvelope<T>;
    } catch {
      return { ok: false, error: "Received an invalid response from the server." };
    }
  }

  function updateLink(index: number, value: Partial<AdminQuickLink>) {
    setLinks((current) =>
      withOrder(
        current.map((link, linkIndex) => {
          if (linkIndex !== index) return link;
          return {
            ...link,
            ...value
          };
        })
      )
    );
  }

  function validateAll(currentLinks: AdminQuickLink[]) {
    if (currentLinks.length === 0) {
      setFieldErrors({});
      setError("At least one quick link is required.");
      return false;
    }

    const nextErrors: Record<number, string> = {};
    currentLinks.forEach((link, index) => {
      const title = link.title?.trim() || "";
      const href = link.href?.trim() || "";
      const description = link.description?.trim() || "";
      if (!title) {
        nextErrors[index] = "Title is required.";
        return;
      }
      if (title.length < 3) {
        nextErrors[index] = "Title must be at least 3 characters.";
        return;
      }
      if (!href) {
        nextErrors[index] = "URL is required.";
        return;
      }
      if (description.length < 10) {
        nextErrors[index] = "Description must be at least 10 characters.";
      }
    });

    setFieldErrors(nextErrors);
    setError(null);
    return Object.keys(nextErrors).length === 0;
  }

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/quick-links", { cache: "no-store" });
      const body = await parseJson<AdminQuickLink[]>(response);
      if (!response.ok || !body.ok) {
        setError(body.error || "Failed to load quick links.");
        return;
      }
      const nextLinks = Array.isArray(body.data) ? body.data : [];
      setLinks(toInitialState(nextLinks));
      setFieldErrors({});
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!validateAll(links)) return;

    setSaving(true);
    setError(null);
    const payloadLinks = withOrder(links).map((link, index) => {
      const category = link.category || undefined;
      const normalized: AdminQuickLink = {
        _key: link._key,
        title: link.title.trim(),
        description: link.description.trim(),
        href: link.href.trim(),
        isExternal: Boolean(link.isExternal),
        enabled: link.enabled !== false,
        order: index + 1
      };
      if (category) normalized.category = category;
      return normalized;
    });

    try {
      const response = await fetch("/api/admin/quick-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quickLinks: payloadLinks })
      });
      const body = await parseJson<unknown>(response);
      if (!response.ok || !body.ok) {
        setError(body.error || "Failed to save quick links.");
        return;
      }

      setSuccess("Quick links saved.");
      setTimeout(() => setSuccess(null), 2400);
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= links.length) return;
    setLinks((current) => {
      const reordered = [...current];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
      return withOrder(reordered);
    });
    setFieldErrors((currentErrors) => {
      const nextErrors: Record<number, string> = {};
      Object.entries(currentErrors).forEach(([key, message]) => {
        const numericKey = Number(key);
        if (numericKey === index) {
          nextErrors[target] = message;
        } else if (numericKey === target) {
          nextErrors[index] = message;
        } else {
          nextErrors[numericKey] = message;
        }
      });
      return nextErrors;
    });
  }

  function remove(index: number) {
    setLinks((current) => withOrder(current.filter((_, currentIndex) => currentIndex !== index)));
    setFieldErrors((currentErrors) => {
      const nextErrors: Record<number, string> = {};
      Object.entries(currentErrors).forEach(([key, message]) => {
        const numericKey = Number(key);
        if (numericKey < index) {
          nextErrors[numericKey] = message;
        } else if (numericKey > index) {
          nextErrors[numericKey - 1] = message;
        }
      });
      return nextErrors;
    });
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
          onClick={() =>
            setLinks((current) =>
              withOrder([
                ...current,
                {
                  title: "",
                  description: "",
                  href: "",
                  isExternal: false,
                  enabled: true,
                  category: "operations"
                }
              ])
            )
          }
          type="button"
        >
          Add Quick Link
        </button>
        <button
          className="focus-ring rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-400 hover:text-white"
          onClick={() => void refresh()}
          type="button"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
        <button
          className="focus-ring rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
          onClick={() => void handleSave()}
          disabled={saving}
          type="button"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {!hasLinks ? (
        <p className="rounded-lg border border-slate-700/70 bg-slate-900/40 px-3 py-3 text-sm text-slate-300">
          No quick links yet. Add one to start.
        </p>
      ) : null}

      <div className="space-y-3">
        {links.map((link, index) => (
          <div key={link._key ?? `${link.href}-${index}`} className="rounded-xl border border-slate-700/70 bg-slate-900/45 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-100">{link.title?.trim() || "Untitled quick link"}</p>
                <p className="text-xs text-slate-400">{link.href || "No URL set"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="focus-ring rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-200 transition hover:border-slate-400 hover:text-white disabled:opacity-50"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  type="button"
                >
                  Move Up
                </button>
                <button
                  className="focus-ring rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-200 transition hover:border-slate-400 hover:text-white disabled:opacity-50"
                  onClick={() => move(index, 1)}
                  disabled={index === links.length - 1}
                  type="button"
                >
                  Move Down
                </button>
                <button
                  className="focus-ring rounded-md border border-rose-500/50 px-2 py-1 text-xs text-rose-200 transition hover:border-rose-400 hover:text-rose-100"
                  onClick={() => remove(index)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Title</label>
                <input
                  className={`focus-ring w-full rounded-lg border bg-slate-900/70 px-3 py-2 text-sm text-white ${
                    fieldErrors[index] ? "border-rose-500/70" : "border-slate-600/70"
                  }`}
                  value={link.title}
                  onChange={(event) => updateLink(index, { title: event.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">URL</label>
                <input
                  className={`focus-ring w-full rounded-lg border bg-slate-900/70 px-3 py-2 text-sm text-white ${
                    fieldErrors[index] ? "border-rose-500/70" : "border-slate-600/70"
                  }`}
                  value={link.href}
                  onChange={(event) => updateLink(index, { href: event.target.value })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Description</label>
                <textarea
                  className={`focus-ring min-h-[88px] w-full rounded-lg border bg-slate-900/70 px-3 py-2 text-sm text-white ${
                    fieldErrors[index] ? "border-rose-500/70" : "border-slate-600/70"
                  }`}
                  value={link.description || ""}
                  onChange={(event) => updateLink(index, { description: event.target.value })}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Category</label>
                <select
                  className="focus-ring w-full rounded-lg border border-slate-600/70 bg-slate-900/70 px-3 py-2 text-sm text-white"
                  value={link.category || ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    updateLink(index, { category: value ? (value as AdminQuickLink["category"]) : undefined });
                  }}
                >
                  <option value="">No category</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-end gap-4 pb-1">
                <label className="inline-flex items-center gap-2 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    checked={Boolean(link.isExternal)}
                    onChange={(event) => updateLink(index, { isExternal: event.target.checked })}
                    className="h-4 w-4 rounded border-slate-500 bg-slate-900"
                  />
                  External
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-slate-200">
                  <input
                    type="checkbox"
                    checked={link.enabled !== false}
                    onChange={(event) => updateLink(index, { enabled: event.target.checked })}
                    className="h-4 w-4 rounded border-slate-500 bg-slate-900"
                  />
                  Enabled
                </label>
              </div>
            </div>

            {fieldErrors[index] ? <p className="mt-2 text-xs text-rose-300">{fieldErrors[index]}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
