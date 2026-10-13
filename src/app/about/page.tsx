// src/app/about/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="flex flex-col items-center text-center px-6 py-20 max-w-3xl mx-auto">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          About Home Portal
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold leading-[1.05] mb-6 text-balance">
          A smaller shelf, chosen on purpose
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Home Portal is a small online shop for home, decor, and kitchen essentials.
          We pick what we carry instead of stocking everything, and we try not to add
          a product just because it&apos;s trending.
        </p>
      </section>

      <section className="py-16 px-6 md:px-12 bg-muted">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card p-8 rounded-xl border border-border">
            <h2 className="text-2xl font-semibold mb-3">Why we started this</h2>
            <p className="text-muted-foreground">
              We got tired of the usual tradeoff: big box stores had the prices but
              nothing felt special, and boutique shops had character but charged for
              it. We wanted pieces that are well made and still affordable, so
              furnishing a space doesn&apos;t mean choosing between the two.
            </p>
          </div>
          <div className="bg-card p-8 rounded-xl border border-border">
            <h2 className="text-2xl font-semibold mb-3">Who it&apos;s for</h2>
            <p className="text-muted-foreground">
              Whether you&apos;re setting up a first apartment or swapping out a few
              things in a room you&apos;ve lived in for years, that&apos;s who we&apos;re
              building this for. If something on our shelves ends up in your home,
              we did our job.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center text-center px-6 py-16">
        <Button asChild variant="cta" size="lg" className="h-12 px-8 text-base">
          <Link href="/products">Shop the collection</Link>
        </Button>
      </section>
    </main>
  );
}
