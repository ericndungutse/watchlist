import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET =
  process.env.JWT_SECRET || "fallback-dev-secret-key-ent-tracker-2026-secure";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export const AUTH_COOKIE_NAME = "ent_auth_token";

export interface AuthUserPayload {
  userId: string;
  email: string;
  fullName: string;
  role: string;
}

/**
 * Signs a JWT with user claims, valid for 7 days
 */
export async function signAuthToken(payload: AuthUserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

/**
 * Verifies a JWT token and extracts the payload
 */
export async function verifyAuthToken(
  token: string
): Promise<AuthUserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      fullName: payload.fullName as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

/**
 * Standard cookie configuration for HTTP-only session
 */
export function getAuthCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    name: AUTH_COOKIE_NAME,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  };
}

/**
 * Retrieves and validates the current logged-in user from request cookies
 */
export async function getCurrentUser(): Promise<AuthUserPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}
