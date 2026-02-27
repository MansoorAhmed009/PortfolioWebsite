"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_DURATION_SECONDS,
  createAdminSessionToken,
  isAdminCredentialValid,
  sanitizeNextPath
} from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const nextPath = sanitizeNextPath(String(formData.get("nextPath") || "/admin"));

  if (!isAdminCredentialValid(username, password)) {
    return { error: "Invalid credentials." };
  }

  const token = await createAdminSessionToken(username);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_DURATION_SECONDS
  });

  redirect(nextPath);
}