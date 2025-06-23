// src/components/Navbar.tsx
'use client'; // This is a Client Component

import Link from 'next/link';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils"; // Utility for concatenating class names
import { useSession, signOut } from "next-auth/react"; // Import useSession and signOut from NextAuth.js

export function Navbar() {
  // useSession hook provides session data and status (loading, authenticated, unauthenticated)
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated'; // True if user is logged in

  return (
    <header className="border-b bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Grocery Portal
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/products" className={cn("text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400")}>
                  Products
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Conditionally render Dashboard link based on authentication status */}
            {isLoggedIn && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/dashboard" className={cn("text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400")}>
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            
            {/* Conditionally render Login/Register or Logout button/info */}
            {!isLoggedIn ? (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/auth" className={cn("text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300")}>
                    Login / Register
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ) : (
              // Display user email and a logout button if logged in
              <>
                <NavigationMenuItem>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Hello, {session?.user?.name || session?.user?.email || 'User'}
                  </span>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <button
                    // Call NextAuth.js signOut function.
                    // callbackUrl specifies where to redirect after signing out.
                    onClick={() => signOut({ callbackUrl: '/auth' })}
                    className={cn("text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300")}
                  >
                    Logout
                  </button>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
