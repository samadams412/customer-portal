"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const PROMO_MESSAGES = [
  "☀️ Summer Sale: Use code WELCOME5 for 5% off!",
  "📦 Free delivery on orders $50+",
  "🛍️ New arrivals daily · Don’t miss out!",
];

export default function PromoBanner() {
  return (
    <div className="relative overflow-hidden w-full bg-secondary/70 backdrop-blur-sm text-secondary-foreground py-4 shadow-md rounded-md mb-6">
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
            <span className="mx-8 font-semibold text-sm sm:text-base md:text-lg tracking-wide">
              {PROMO_MESSAGES.join(" · ")}
            </span>
          )
          .map((content, idx) => (
            <div key={idx}>{content}</div>
          ))}
      </motion.div>


    </div>
  );
}
