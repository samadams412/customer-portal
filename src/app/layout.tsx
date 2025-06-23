// src/app/layout.tsx
// This is your root layout component. It remains a Server Component by default,
// allowing metadata export and server-side rendering.

import './globals.css'; // Your global styles
import { Inter } from 'next/font/google'; // Assuming Inter font is used
import { Navbar } from '@/components/Navbar'; // Your Navbar component (will be client component)
import Providers from '@/app/providers'; // Import the new Providers client component
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'] });

// Metadata for the root layout (Server Component only feature)
export const metadata = {
  title: 'Customer Portal',
  description: 'A Next.js customer portal built with Prisma and NextAuth.js (JWT Strategy)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap your Navbar and page content with the Providers component.
            This ensures that any client components (like Navbar) have access
            to the NextAuth.js session context provided by SessionProvider. */}
        <Providers>
          {/* Enables user to have light or dark mode, enables system preferance automatically */}
          <ThemeProvider 
             attribute="class"
             defaultTheme="system"
             enableSystem
             disableTransitionOnChange
           >
            <Navbar /> {/* Your Navbar, now correctly nested within SessionProvider's client boundary */}
            {children} {/* Your page content */}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
