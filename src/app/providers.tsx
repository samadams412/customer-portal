// src/app/providers.tsx
'use client'; // This directive makes the component a Client Component

import { SessionProvider } from "next-auth/react"; // Import SessionProvider

interface ProvidersProps {
  children: React.ReactNode;
}

// This component wraps your application with client-side context providers.
export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
