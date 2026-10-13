// src/components/app-ui/home/HeroSection.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center min-h-[70vh] px-6 py-20">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
      >
        Furniture · Decor · Kitchen
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-5xl md:text-7xl font-semibold leading-[1.05] mb-6 max-w-4xl text-balance"
      >
        Pieces that make a house
        <span className="block italic font-normal text-primary">feel like home</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="text-lg md:text-xl max-w-2xl text-muted-foreground mb-10"
      >
        Well-made furniture, decor, and kitchen essentials, chosen to last and priced to live with.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Button asChild variant="cta" size="lg" className="h-12 px-8 text-base">
          <Link href="/products">Shop the collection</Link>
        </Button>
      </motion.div>
    </section>
  );
}
