'use client';

import Link from 'next/link';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Auth from "@/lib/auth-client";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Auth.loggedIn());
  }, []);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">Grocery Portal</Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/products" className={cn("text-sm font-medium hover:underline")}>
                  Products
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {isLoggedIn && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/dashboard" className={cn("text-sm font-medium hover:underline")}>
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            {!isLoggedIn ? (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/auth" className={cn("text-sm font-medium hover:underline")}>
                    Login / Register
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <button
                  onClick={() => Auth.logout()}
                  className={cn("text-sm font-medium hover:underline")}
                >
                  Logout
                </button>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
