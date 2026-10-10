"use client";

import { motion } from "framer-motion";

const PROMO_MESSAGES = [
  "Use code WELCOME5 for 5% off",
  "Free delivery on orders $50+",
  "New arrivals every week",
];

export default function PromoBanner() {
  return (
    <div className="relative overflow-hidden w-full bg-foreground text-background py-2.5">
      <motion.div
        className="flex whitespace-nowrap"
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {Array(2)
          .fill(
            <span className="mx-8 text-xs sm:text-sm font-medium uppercase tracking-[0.15em]">
              {PROMO_MESSAGES.join("  ·  ")}
            </span>
          )
          .map((content, idx) => (
            <div key={idx}>{content}</div>
          ))}
      </motion.div>
    </div>
  );
}
