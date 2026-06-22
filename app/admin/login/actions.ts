"use server";

import { redirect } from "next/navigation";
import { createAdminSession, hasAdminAuthEnv, sanitizeNextPath, verifyAdminCredentials } from "@/lib/admin-auth";

export async function signInToAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const passcode = String(formData.get("passcode") ?? "");
  const next = sanitizeNextPath(String(formData.get("next") ?? ""));

  if (!hasAdminAuthEnv()) {
    redirect(adminLoginRedirect("Admin access is not configured.", next));
  }

  if (!verifyAdminCredentials(email, passcode)) {
    redirect(adminLoginRedirect("Invalid admin credentials.", next));
  }

  createAdminSession(email);
  redirect(next);
}

function adminLoginRedirect(error: string, next: string) {
  const params = new URLSearchParams({ error });
  if (next !== "/admin") params.set("next", next);
  return `/admin/login?${params.toString()}`;
}
