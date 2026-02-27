"use client";

import { useActionState } from "react";

import { loginAction, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = {};

type AdminLoginFormProps = {
  nextPath?: string;
};

export function AdminLoginForm({ nextPath = "/admin" }: AdminLoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="nextPath" value={nextPath} />

      <label className="block">
        <span className="mb-2 block text-sm text-slate-200">Username</span>
        <input
          type="text"
          name="username"
          required
          className="focus-ring w-full rounded-xl border border-slate-600/75 bg-slate-900/65 px-4 py-3 text-sm text-white"
          placeholder="admin"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-slate-200">Password</span>
        <input
          type="password"
          name="password"
          required
          className="focus-ring w-full rounded-xl border border-slate-600/75 bg-slate-900/65 px-4 py-3 text-sm text-white"
          placeholder="********"
        />
      </label>

      {state.error ? (
        <p className="rounded-xl border border-rose-300/35 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="focus-ring inline-flex rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white shadow-glow transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
