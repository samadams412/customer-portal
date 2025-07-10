'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Truck, Leaf } from 'lucide-react';

const features = [
  {
    icon: CheckCircle,
    title: 'Farm-Fresh Quality',
    description: 'We partner with trusted local growers to ensure the freshest, healthiest ingredients every day.',
    color: 'text-secondary',
  },
  {
    icon: Truck,
    title: 'Fast & Free Delivery',
    description: 'Same-day delivery available in most locations. No hidden fees — ever.',
    color: 'text-secondary',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Packaging',
    description: 'Our biodegradable packaging helps reduce waste and protect the environment.',
    color: 'text-secondary',
  },
];

export default function WhyShopWithUs() {
  return (
    <section className="py-16 px-6 md:px-12 bg-muted/20 dark:bg-muted/10">
      <motion.div
        className="max-w-6xl mx-auto text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-4">Why Shop With Us?</h2>
        <p className="text-muted-foreground text-lg mb-12">
          Everything we do is rooted in quality, convenience, and sustainability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, description, color }, i) => (
            <motion.div
              key={i}
              className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-border"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Icon className={`w-10 h-10 mx-auto mb-4 ${color}`} />
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
