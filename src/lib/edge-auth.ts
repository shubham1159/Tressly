import { jwtVerify } from "jose";
import type { AuthTokenPayload } from "@/lib/auth";

// middleware.ts runs on the Edge runtime, which doesn't support the Node
// crypto APIs jsonwebtoken relies on — jose's WebCrypto-based verify is the
// edge-safe equivalent. API routes run on the Node runtime and keep using
// jsonwebtoken (see lib/auth.ts) since they need jwt.sign() too.
export async function verifyTokenEdge(token: string): Promise<AuthTokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AuthTokenPayload;
  } catch {
    return null;
  }
}
