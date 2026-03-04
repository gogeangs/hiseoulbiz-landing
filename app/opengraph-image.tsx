import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "2026 글로벌 이커머스 & 세일즈 기획 실무 과정";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #172554 0%, #1e3a5f 50%, #1d4ed8 100%)",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* 배경 장식 */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />

        {/* 주최 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
            color: "rgba(255,255,255,0.7)",
            fontSize: "24px",
          }}
        >
          <span>(사)하이서울기업협회</span>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>|</span>
          <span>매력일자리 사업</span>
        </div>

        {/* 제목 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <span
            style={{
              fontSize: "56px",
              fontWeight: 700,
              color: "white",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            글로벌 이커머스 &
          </span>
          <span
            style={{
              fontSize: "56px",
              fontWeight: 700,
              color: "white",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            세일즈 기획 실무 과정
          </span>
        </div>

        {/* 배지 */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "40px" }}>
          <div
            style={{
              background: "#f59e0b",
              color: "#0f172a",
              padding: "12px 28px",
              borderRadius: "999px",
              fontSize: "22px",
              fontWeight: 600,
            }}
          >
            교육비 무료
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "white",
              padding: "12px 28px",
              borderRadius: "999px",
              fontSize: "22px",
              fontWeight: 600,
            }}
          >
            교육 수당 지급
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "white",
              padding: "12px 28px",
              borderRadius: "999px",
              fontSize: "22px",
              fontWeight: 600,
            }}
          >
            유급 인턴 연계
          </div>
        </div>

        {/* 하단 정보 */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            color: "rgba(255,255,255,0.6)",
            fontSize: "20px",
          }}
        >
          <span>모집 마감: 2026년 3월 31일</span>
          <span>|</span>
          <span>선발 인원: 20명</span>
          <span>|</span>
          <span>만 18~39세 서울 거주 구직자</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
