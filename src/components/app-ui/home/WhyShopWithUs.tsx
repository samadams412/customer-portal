'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Truck, Leaf } from 'lucide-react';

const features = [
  {
    icon: CheckCircle,
    title: 'Quality You Can Trust',
    description: 'We partner with trusted makers to bring you durable, well-crafted furniture and home goods.',
    color: 'text-primary',
  },
  {
    icon: Truck,
    title: 'Fast & Free Delivery',
    description: 'Same-day delivery available in most locations. No hidden fees — ever.',
    color: 'text-primary',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Packaging',
    description: 'Our biodegradable packaging helps reduce waste and protect the environment.',
    color: 'text-primary',
  },
];

export default function WhyShopWithUs() {
  return (
    <section className="py-20 px-6 md:px-12 bg-muted">
      <motion.div
        className="max-w-6xl mx-auto text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-semibold mb-4">Why Shop With Us?</h2>
        <p className="text-muted-foreground text-lg mb-12">
          Everything we do is rooted in quality, convenience, and sustainability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, description, color }, i) => (
            <motion.div
              key={i}
              className="bg-card p-8 rounded-xl border border-border text-left"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Icon className={`w-8 h-8 mb-5 ${color}`} strokeWidth={1.5} aria-hidden="true" />
              <h3 className="text-2xl font-medium mb-2">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
