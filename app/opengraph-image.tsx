import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Spark — din AI-medgrundare";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ---------------------------------------------------------------------------
// The share image, generated rather than committed as a PNG.
//
// A static file drifts: the design changes and the picture people see in Slack
// and iMessage is last month's. This route is built from the same colours and
// words as the page, so it cannot fall behind.
//
// The font is fetched at request time. If that fetch fails the image still
// renders in the fallback face rather than the route erroring — a share card
// in the wrong typeface beats no share card at all.
// ---------------------------------------------------------------------------

const BLACK = "#08090A";
const GREEN = "#24F08B";
const GREEN_INK = "#04150C";

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&display=swap",
      { headers: { "user-agent": "Mozilla/5.0" } }
    ).then((response) => response.text());

    const url = css.match(/src:\s*url\((https:\/\/[^)]+)\)/)?.[1];
    if (!url) return null;

    return await fetch(url).then((response) => response.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const font = await loadFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: BLACK,
        }}
      >
        <div style={{ display: "flex", padding: "48px 64px 0" }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 6,
              color: GREEN,
              textTransform: "uppercase",
            }}
          >
            Spark.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            margin: "40px 0 0",
            padding: "56px 64px",
            background: GREEN,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 6,
              color: GREEN_INK,
              opacity: 0.7,
              textTransform: "uppercase",
            }}
          >
            Lanseras hösten 2026
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 104,
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: -2,
              color: GREEN_INK,
              textTransform: "uppercase",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Din AI-</span>
            <span>medgrundare.</span>
          </div>
          <div
            style={{
              marginTop: 28,
              maxWidth: 780,
              fontSize: 24,
              lineHeight: 1.6,
              fontWeight: 700,
              letterSpacing: 2,
              color: GREEN_INK,
              opacity: 0.78,
              textTransform: "uppercase",
            }}
          >
            Från första idén till något människor faktiskt vill ha.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "Chakra Petch", data: font, weight: 700, style: "normal" }]
        : undefined,
    }
  );
}
