import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** The home-screen icon: the wordmark's initial on the page's own black. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#262B31",
          color: "#F0F2F3",
          fontSize: 104,
          fontWeight: 700,
        }}
      >
        S
      </div>
    ),
    size
  );
}
