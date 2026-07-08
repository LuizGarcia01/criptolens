import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size } = await params;
  const px = parseInt(size) || 192;
  const radius = Math.round(px * 0.22);
  const fontSize = Math.round(px * 0.52);

  return new ImageResponse(
    (
      <div
        style={{
          width: px,
          height: px,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
          borderRadius: radius,
        }}
      >
        <span
          style={{
            color: "#FBBF24",
            fontSize,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          ₿
        </span>
      </div>
    ),
    { width: px, height: px }
  );
}
