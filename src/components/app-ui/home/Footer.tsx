'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background dark:bg-card dark:text-card-foreground py-14 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Home Portal</h2>
          <p className="text-sm opacity-75">
            Your trusted source for furniture, decor, and kitchen essentials. Fast, sustainable, and local.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:underline">
                Shop Products
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:underline">
                My Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>support@homeportal.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>(555) 123-4567</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>123 Main St, San Antonio, TX</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-current/20 opacity-75 mt-10 pt-6 text-center text-sm">
        &copy; {new Date().getFullYear()} Home Portal. All rights reserved.
      </div>
    </footer>
  );
}
