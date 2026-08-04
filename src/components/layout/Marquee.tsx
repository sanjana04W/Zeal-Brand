"use client";

import { motion } from "framer-motion";

export default function Marquee() {
  const items = [
    "🔥 Premium Quality, Honest Prices",
    "🏁 New Drops Every Week",
    "💥 Limited Time Sale — Don't Miss Out",
    "🖤 New Season Arrivals — Shop Now",
    "🚀 Up to 50% Off Select Styles",
  ];

  return (
    <div className="bg-foreground text-background py-2 overflow-hidden flex whitespace-nowrap">
      <motion.div
        className="flex space-x-12 min-w-full"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 25,
        }}
      >
        {/* Render twice for seamless looping */}
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center space-x-2 shrink-0">
            <span className="font-bold text-xs uppercase tracking-widest">{item}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
