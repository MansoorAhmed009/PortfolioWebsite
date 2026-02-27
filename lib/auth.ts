import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "mi_admin_session";
export const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 8;

const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "change_this_now";
const DEFAULT_SESSION_SECRET = "insecure-dev-secret-change-in-env";

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;

  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return mismatch === 0;
}

export function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || DEFAULT_SESSION_SECRET;
}

function getSessionSecretKey() {
  return new TextEncoder().encode(getAdminSessionSecret());
}

export function isAdminCredentialValid(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

  return constantTimeEqual(username, expectedUsername) && constantTimeEqual(password, expectedPassword);
}

export async function createAdminSessionToken(username: string) {
  return new SignJWT({ role: "admin", sub: username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_DURATION_SECONDS}s`)
    .sign(getSessionSecretKey());
}

export async function verifyAdminSessionToken(token: string) {
  try {
    await jwtVerify(token, getSessionSecretKey(), {
      algorithms: ["HS256"]
    });
    return true;
  } catch {
    return false;
  }
}

export async function getAdminSession(): Promise<{ isAdmin: true } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  const valid = await verifyAdminSessionToken(token);
  return valid ? { isAdmin: true } : null;
}

export function sanitizeNextPath(nextPath: string) {
  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/admin";
  }
  return nextPath;
}
