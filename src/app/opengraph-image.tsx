import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { cityNames } from "@/content/areas";
import { site } from "@/content/site";

export const alt = `${site.name}: mobile locksmith in Midland, Odessa, Lubbock and Amarillo, Texas. Call ${site.phone.display}.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Rendered once at build time (also required by the static GitHub Pages export).
export const dynamic = "force-static";

const STREAKS = [
  { top: 70, left: 560, width: 520, height: 3, opacity: 0.5 },
  { top: 118, left: 680, width: 420, height: 5, opacity: 0.75 },
  { top: 520, left: 40, width: 460, height: 4, opacity: 0.6 },
  { top: 562, left: 160, width: 300, height: 3, opacity: 0.4 },
];

async function loadAssets() {
  const root = process.cwd();
  const [logo, saira, barlow] = await Promise.all([
    readFile(join(root, "public/brand/logo.png")),
    readFile(join(root, "assets/fonts/Saira-BlackItalic.woff")),
    readFile(join(root, "assets/fonts/Barlow-SemiBold.woff")),
  ]);
  return {
    logo: logo.toString("base64"),
    saira: saira.toString("base64"),
    barlow: barlow.toString("base64"),
  };
}

export default async function OpengraphImage() {
  const assets = await loadAssets();
  const saira = Buffer.from(assets.saira, "base64");
  const barlow = Buffer.from(assets.barlow, "base64");
  const logoSrc = `data:image/png;base64,${assets.logo}`;
  // PNG header: width and height are big-endian at bytes 16 and 20.
  const png = Buffer.from(assets.logo, "base64");
  const logoWidth = 500;
  const logoHeight = Math.round((logoWidth * png.readUInt32BE(20)) / png.readUInt32BE(16));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          position: "relative",
          background: "radial-gradient(circle at 78% 30%, #4a0508 0%, #0a0a0b 55%)",
          fontFamily: "Barlow",
        }}
      >
        {STREAKS.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: s.top,
              left: s.left,
              width: s.width,
              height: s.height,
              opacity: s.opacity,
              borderRadius: 999,
              background: "linear-gradient(90deg, rgba(229,8,15,0) 0%, #e5080f 70%, #ff3b3f 100%)",
            }}
          />
        ))}

        <div style={{ display: "flex", width: 560, justifyContent: "center" }}>
          <img src={logoSrc} width={logoWidth} height={logoHeight} alt="" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", paddingRight: 60, width: 640 }}>
          <div style={{ display: "flex", color: "#ff3b3f", fontSize: 26, letterSpacing: 6, textTransform: "uppercase" }}>
            Mobile locksmith · {site.state.name}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 18,
              fontFamily: "Saira",
              fontStyle: "italic",
              fontWeight: 900,
              fontSize: 48,
              lineHeight: 1.08,
              color: "#ffffff",
              textTransform: "uppercase",
            }}
          >
            {[cityNames.slice(0, 2), cityNames.slice(2)].map((pair) => (
              <div key={pair[0]} style={{ display: "flex", alignItems: "center" }}>
                <span>{pair[0]}</span>
                <span style={{ color: "#ff3b3f", margin: "0 16px", fontFamily: "Barlow", fontStyle: "normal", fontWeight: 600 }}>/</span>
                <span>{pair[1]}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 34,
              padding: "14px 30px",
              borderRadius: 10,
              background: "linear-gradient(180deg, #e5080f 0%, #b00a10 100%)",
              color: "#ffffff",
              fontFamily: "Saira",
              fontStyle: "italic",
              fontWeight: 900,
              fontSize: 44,
            }}
          >
            CALL {site.phone.display}
          </div>
          <div style={{ display: "flex", marginTop: 22, color: "#a6abb3", fontSize: 28 }}>{site.hours.label}</div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 8,
            background: "linear-gradient(90deg, #b00a10 0%, #e5080f 50%, #ff3b3f 100%)",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Saira", data: saira, style: "italic", weight: 900 },
        { name: "Barlow", data: barlow, style: "normal", weight: 600 },
      ],
    },
  );
}
