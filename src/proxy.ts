import { NextResponse, type NextRequest } from "next/server";

const REALM = "Andrew Wendling Admin";

export function proxy(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;

  // If the password isn't configured, lock the admin out entirely with a 503
  // — better than letting anyone walk through an unconfigured gate.
  if (!password) {
    return new NextResponse("Admin not configured.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      let decoded = "";
      try {
        decoded = Buffer.from(encoded, "base64").toString("utf-8");
      } catch {
        decoded = "";
      }
      const sep = decoded.indexOf(":");
      const submitted = sep === -1 ? "" : decoded.slice(sep + 1);
      if (submitted && submitted === password) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export const config = {
  matcher: "/admin/:path*",
};
