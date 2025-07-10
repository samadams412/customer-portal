"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Optional utility to join classNames

export default function PromoBanner() {
  return (
    <div className="relative overflow-hidden w-full bg-secondary text-secondary-foreground py-4 shadow-md rounded-md mb-6">
      <motion.div
        className="flex whitespace-nowrap"
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {Array(2)
          .fill(
            <span className="mx-8 font-semibold text-lg sm:text-xl tracking-wide">
              ☀️ Summer Sale: Save 15% on all fresh produce! · Limited time only · Shop now! ·
            </span>
          )
          .map((content, idx) => (
            <div key={idx}>{content}</div>
          ))}
      </motion.div>

      {/* Optional CTA Button fixed at right (not part of scroll) */}
      {/* <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <Button variant="secondary" size="sm" className="text-sm font-semibold">
          Shop Deals
        </Button>
      </div> */}
    </div>
  );
}
