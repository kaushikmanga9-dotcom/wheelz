import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "wheelz_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;

type AdminSessionPayload = {
  email: string;
  exp: number;
};

type AdminConfig = {
  email: string;
  passcode: string;
  secret: string;
};

export function hasAdminAuthEnv() {
  return Boolean(getAdminConfig());
}

export function verifyAdminCredentials(email: string, passcode: string) {
  const config = getAdminConfig();
  if (!config) return false;

  return (
    timingSafeStringEqual(email.trim().toLowerCase(), config.email) &&
    timingSafeStringEqual(passcode, config.passcode)
  );
}

export function createAdminSession(email: string) {
  const config = getAdminConfig();
  if (!config) throw new Error("Admin authentication is not configured.");

  const payload: AdminSessionPayload = {
    email: email.trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS
  };
  const token = signPayload(payload, config.secret);

  cookies().set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS
  });
}

export function hasValidAdminSession() {
  const config = getAdminConfig();
  if (!config) return false;

  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;

  const payload = verifyToken(token, config.secret);
  if (!payload) return false;

  return payload.email === config.email && payload.exp > Math.floor(Date.now() / 1000);
}

export function clearAdminSession() {
  cookies().delete(ADMIN_COOKIE_NAME);
}

export function sanitizeNextPath(value: string) {
  const next = value.trim();
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/admin";
  return next;
}

function getAdminConfig(): AdminConfig | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passcode = process.env.ADMIN_PASSCODE;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!email || !passcode || !secret) return null;

  return {
    email,
    passcode,
    secret
  };
}

function signPayload(payload: AdminSessionPayload, secret: string) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

function verifyToken(token: string, secret: string): AdminSessionPayload | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = sign(encodedPayload, secret);
  if (!timingSafeStringEqual(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as AdminSessionPayload;
    if (!payload.email || !Number.isFinite(payload.exp)) return null;
    return payload;
  } catch {
    return null;
  }
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function timingSafeStringEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;

  return timingSafeEqual(leftBuffer, rightBuffer);
}
