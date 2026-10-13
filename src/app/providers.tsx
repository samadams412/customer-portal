// src/app/providers.tsx
'use client'; // This directive makes the component a Client Component

import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import { MotionConfig } from "framer-motion";

interface ProvidersProps {
  children: React.ReactNode;
}

// This component wraps your application with client-side context providers.
export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      {/* Honors prefers-reduced-motion for every framer-motion animation */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </SessionProvider>
  );
}
