import { NextResponse, type NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// HTTP Basic Auth for /admin
//
// This runs in middleware rather than in the page, for one reason: middleware
// never reaches the browser. Checking credentials inside a React component
// risks the comparison — and therefore the password — being bundled into the
// client JavaScript, where anyone can read it with View Source.
//
// ADMIN_USER and ADMIN_PASSWORD are plain env vars with no NEXT_PUBLIC_ prefix,
// so Next refuses to inline them into client bundles in the first place.
// ---------------------------------------------------------------------------

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

/** Constant-time-ish comparison. Web Crypto's timingSafeEqual is not available
 *  in middleware, so this compares every byte rather than short-circuiting. */
function equals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}

function unauthorised() {
  return new NextResponse("Behörighet krävs.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Spark admin", charset="UTF-8"',
      "content-type": "text/plain; charset=utf-8",
    },
  });
}

export function middleware(request: NextRequest) {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  // With no credentials configured the admin area stays shut. Failing open
  // here would publish every signup the moment the variables were forgotten.
  if (!user || !password) {
    return new NextResponse(
      "Adminpanelen är inte konfigurerad. Sätt ADMIN_USER och ADMIN_PASSWORD.",
      { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } }
    );
  }

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return unauthorised();

  let decoded: string;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return unauthorised();
  }

  const separator = decoded.indexOf(":");
  if (separator < 0) return unauthorised();

  const givenUser = decoded.slice(0, separator);
  const givenPassword = decoded.slice(separator + 1);

  // Both compared, always, so the response time does not reveal whether the
  // username alone was right.
  const userOk = equals(givenUser, user);
  const passwordOk = equals(givenPassword, password);
  if (!userOk || !passwordOk) return unauthorised();

  return NextResponse.next();
}
