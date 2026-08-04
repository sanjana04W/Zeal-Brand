"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [rotation, setRotation] = useState(0);
  const [visible, setVisible] = useState(false);
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

      // Rotate up to 360deg as you scroll to the bottom
      setRotation(progress * 360);

      // Show only after scrolling down a bit
      setVisible(scrollY > 200);

      // Detect if the button is overlapping the footer (dark bg)
      const footer = document.querySelector("footer");
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        // Button sits at bottom-8 (32px from bottom), height ~80px
        const buttonTop = windowHeight - 32 - 80;
        setOverDark(footerTop < windowHeight - 32); // footer is visible in button area
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build the circular text
  const text = "SCROLL TO TOP · SCROLL TO TOP · ";
  const chars = text.split("");
  const radius = 38;
  const angleStep = 360 / chars.length;

  // Color scheme: white on dark footer, dark on light pages
  const textColor = overDark ? "#ffffff" : "#111111";
  const arrowBg = overDark ? "#ffffff" : "#111111";
  const arrowStroke = overDark ? "#111111" : "#ffffff";

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-8 right-8 z-50 w-20 h-20 flex items-center justify-center transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {/* Rotating ring with circular text */}
      <div
        className="absolute inset-0"
        style={{ transform: `rotate(${rotation}deg)`, transition: "transform 0.05s linear" }}
      >
        <svg viewBox="0 0 100 100" width="80" height="80">
          {chars.map((char, i) => {
            const angle = i * angleStep - 90;
            const rad = (angle * Math.PI) / 180;
            const x = 50 + radius * Math.cos(rad);
            const y = 50 + radius * Math.sin(rad);
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="7.5"
                fontWeight="700"
                fontFamily="Inter, sans-serif"
                fill={textColor}
                transform={`rotate(${angle + 90}, ${x}, ${y})`}
                letterSpacing="0"
                style={{ transition: "fill 0.3s ease" }}
              >
                {char}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Center arrow */}
      <div
        className="relative z-10 w-8 h-8 flex items-center justify-center rounded-full shadow-md"
        style={{ backgroundColor: arrowBg, transition: "background-color 0.3s ease" }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={arrowStroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "stroke 0.3s ease" }}
        >
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      </div>
    </button>
  );
}
