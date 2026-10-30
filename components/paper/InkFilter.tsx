export default function InkFilter() {
    return (
        <svg
            width="0"
            height="0"
            aria-hidden="true"
            style={{ position: "absolute" }}
        >
            <defs>
                <filter id="ink" x="-2%" y="-60%" width="104%" height="220%">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.025"
                        numOctaves="2"
                        seed="4"
                        result="noise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="2.4"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </defs>
        </svg>
    );
}