"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch-only / coarse pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setPosition({ x: mouseX, y: mouseY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth physics loop for yellow trailing circle
    const render = () => {
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;
      setFollowerPos({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(render);
    };

    // Detect clickable element hovers
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA" ||
        target.getAttribute("role") === "button" ||
        target.closest("button") !== null ||
        target.closest("a") !== null;

      setIsHovered(isInteractive);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>


      {/* Smooth Zeal Brand Red trailing follower ring */}
      <div
        className={`fixed top-0 left-0 z-[999998] pointer-events-none rounded-full border-[1.5px] transition-all duration-150 ease-out ${
          isHovered
            ? "border-red-500 bg-red-600/30 shadow-[0_0_12px_rgba(239,68,68,0.7)]"
            : "border-red-600 bg-red-600/20 shadow-[0_0_6px_rgba(220,38,38,0.4)]"
        }`}
        style={{
          width: isHovered ? "20px" : "10px",
          height: isHovered ? "20px" : "10px",
          transform: `translate3d(${followerPos.x - (isHovered ? 10 : 5)}px, ${
            followerPos.y - (isHovered ? 10 : 5)
          }px, 0)`,
        }}
      />
    </>
  );
}
