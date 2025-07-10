// src/components/app-ui/home/HeroSection.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center min-h-[70vh] px-6 py-20">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-primary"
      >
        Welcome to Your
        <span className="block text-accent-brand drop-shadow-md">Grocery Portal</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-lg md:text-xl max-w-2xl text-muted-foreground mb-8"
      >
        Discover fresh groceries, exclusive deals, and a seamless shopping experience crafted just for you.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Link href="/products" passHref>
          <Button
            variant="secondary"
            className="px-8 py-4 text-lg font-semibold rounded-xl shadow-md hover:shadow-xl transition-transform hover:scale-105"
          >
            Shop Now
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
