import { ImageResponse } from "next/og";

export const alt = "Yamin Hossain, full-stack AI engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: 72,
                    background: "#faf9f5",
                    backgroundImage:
                        "linear-gradient(to right, rgba(47,75,255,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(47,75,255,0.09) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                    color: "#16171a",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            fontSize: 22,
                            letterSpacing: 4,
                            color: "#2f4bff",
                        }}
                    >
                        FIG_000 · FULL-STACK AI ENGINEER
                    </div>
                    <svg width="84" height="84" viewBox="0 0 120 120">
                        <polygon
                            points="60,60 103.3,35 103.3,85 60,110"
                            fill="#16171a"
                            fillOpacity="0.12"
                        />
                        <polygon
                            points="60,10 103.3,35 103.3,85 60,110 16.7,85 16.7,35"
                            fill="none"
                            stroke="#16171a"
                            strokeWidth="5"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M16.7 35 L60 60 L103.3 35 M60 60 L60 110"
                            fill="none"
                            stroke="#2f4bff"
                            strokeWidth="6.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            display: "flex",
                            fontSize: 150,
                            fontWeight: 700,
                            lineHeight: 1,
                            letterSpacing: -5,
                        }}
                    >
                        Yamin
                    </div>
                    <div
                        style={{
                            display: "flex",
                            fontSize: 150,
                            fontWeight: 700,
                            lineHeight: 1,
                            letterSpacing: -5,
                        }}
                    >
                        Hossain<span style={{ color: "#2f4bff" }}>.</span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            marginTop: 28,
                            fontSize: 40,
                            color: "#5a5b60",
                        }}
                    >
                        I build AI agents that ship.
                    </div>
                </div>
            </div>
        ),
        size
    );
}