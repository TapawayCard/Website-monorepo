import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();

export type TokenPayload = {
  uid: string;
  email: string;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set it in the backend environment (see .env.example)."
    );
  }
  return encoder.encode(secret);
}

export async function signToken(payload: TokenPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.uid === "string" && typeof payload.email === "string") {
      return { uid: payload.uid, email: payload.email };
    }
    return null;
  } catch {
    return null;
  }
}
