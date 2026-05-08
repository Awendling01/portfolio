import { createPrivateKey, createSign } from "node:crypto";

// Google service-account → access token via the JWT Bearer flow.
// Avoids pulling the 50MB+ `googleapis` package for a single API.
// https://developers.google.com/identity/protocols/oauth2/service-account

type ServiceAccountKey = {
  client_email: string;
  private_key: string;
  token_uri?: string;
};

let cachedKey: ServiceAccountKey | null = null;

function readKey(): ServiceAccountKey | null {
  if (cachedKey) return cachedKey;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ServiceAccountKey;
    if (!parsed.client_email || !parsed.private_key) return null;
    cachedKey = parsed;
    return parsed;
  } catch {
    return null;
  }
}

function base64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

type TokenCache = { token: string; expiresAt: number };
let tokenCache: Record<string, TokenCache> = {};

export async function getGoogleAccessToken(
  scope: string,
): Promise<string | null> {
  const key = readKey();
  if (!key) return null;

  const cached = tokenCache[scope];
  if (cached && cached.expiresAt > Date.now() + 60_000) {
    return cached.token;
  }

  const now = Math.floor(Date.now() / 1000);
  const tokenUri = key.token_uri ?? "https://oauth2.googleapis.com/token";

  const header = base64url(
    JSON.stringify({ alg: "RS256", typ: "JWT" }),
  );
  const claims = base64url(
    JSON.stringify({
      iss: key.client_email,
      scope,
      aud: tokenUri,
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claims}`;

  let signature: string;
  try {
    const privateKey = createPrivateKey({
      key: key.private_key.replace(/\\n/g, "\n"),
      format: "pem",
    });
    const signer = createSign("RSA-SHA256");
    signer.update(unsigned);
    signer.end();
    signature = base64url(signer.sign(privateKey));
  } catch (err) {
    console.error("google-jwt: signing failed", err);
    return null;
  }

  const assertion = `${unsigned}.${signature}`;

  try {
    const res = await fetch(tokenUri, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion,
      }).toString(),
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("google-jwt: token exchange failed", res.status, text);
      return null;
    }

    const data: { access_token?: string; expires_in?: number } = await res.json();
    if (!data.access_token) return null;

    const ttlMs = (data.expires_in ?? 3600) * 1000;
    tokenCache = {
      ...tokenCache,
      [scope]: {
        token: data.access_token,
        expiresAt: Date.now() + ttlMs,
      },
    };
    return data.access_token;
  } catch (err) {
    console.error("google-jwt: token request failed", err);
    return null;
  }
}

export function googleServiceAccountConfigured(): boolean {
  return readKey() !== null;
}

export function getServiceAccountEmail(): string | null {
  return readKey()?.client_email ?? null;
}
