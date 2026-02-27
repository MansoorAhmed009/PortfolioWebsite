import type { NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth";
import { jsonError } from "@/lib/api/http";

export async function requireAdminRequest(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token || !(await verifyAdminSessionToken(token))) {
    return jsonError("Unauthorized", 401);
  }

  return null;
}