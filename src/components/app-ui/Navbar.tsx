// src/components/Navbar.tsx
'use client'; // This is a Client Component

import React from 'react'; // Import React
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook to get current path for active links
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; // Import Sheet components
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { Toggle } from './ToggleTheme'; // Corrected import from Toggle to ThemeToggle
import { CartSheet } from '@/components/app-ui/cart/CartSheet';
import { Menu, X } from 'lucide-react'; // Import Menu (hamburger) and X (close) icons
import { Separator } from '../ui/separator';

export function Navbar() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const pathname = usePathname(); // Get current path for active link styling
  const [isSheetOpen, setIsSheetOpen] = React.useState(false); // State to control sheet open/close

  // Define navigation links for easier mapping
  const navLinks = [
    { href: "/products", label: "Products" },
    // Only show Dashboard if logged in
    ...(isLoggedIn ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between h-16">
        {/* Logo/Site Title */}
        <Link href="/" className="text-xl font-bold text-primary hover:text-primary/90 transition-colors">
          Grocery Portal
        </Link>

        {/* Desktop Navigation (hidden on small screens) */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex space-x-4 items-center">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === link.href ? "text-primary" : "text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            {/* Auth Buttons/User Info for Desktop */}
            {!isLoggedIn ? (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/auth">
                    <Button variant="outline" className="text-primary border-primary hover:bg-primary/10 transition-colors">
                      Login / Register
                    </Button>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ) : (
              <>
                <NavigationMenuItem className="hidden lg:block"> {/* Hide user name on smaller desktops */}
                  <span className="text-sm font-medium text-foreground">
                    {session?.user?.name || session?.user?.email || 'User'}
                  </span>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button
                    onClick={() => signOut({ callbackUrl: '/auth' })}
                    variant="destructive"
                    className="transition-colors"
                  >
                    Logout
                  </Button>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right-aligned utility section (always visible) */}
        <div className="flex items-center space-x-2 md:space-x-4">
             <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="outline"
                size="icon"
                aria-label="Toggle mobile navigation"
                className="h-9 w-9 bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-card text-foreground sm:max-w-xs">
              <SheetHeader className="pb-4">
                <SheetTitle className="text-2xl font-semibold">Navigation</SheetTitle>
              </SheetHeader>
              <Separator className="bg-border" />
              <nav className="flex flex-1 flex-col gap-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname === link.href ? "text-primary" : "text-foreground"
                    )}
                    onClick={() => setIsSheetOpen(false)} // Close sheet on link click
                  >
                    {link.label}
                  </Link>
                ))}
                <Separator className="bg-border my-2" />
                {/* Auth Buttons/User Info for Mobile Sheet */}
                {!isLoggedIn ? (
                  <Link href="/auth" onClick={() => setIsSheetOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Login / Register
                    </Button>
                  </Link>
                ) : (
                  <>
                    <span className="text-base font-medium text-foreground py-2">
                        Welcome, {session?.user?.name || session?.user?.email || 'User'}!
                    </span>
                    <Button
                      onClick={() => { signOut({ callbackUrl: '/auth' }); setIsSheetOpen(false); }}
                      variant="destructive"
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <CartSheet /> {/* Cart icon (always visible) */}
          <Toggle /> {/* Theme toggle (always visible) */}

          {/* Mobile Navigation Trigger (Hamburger Menu) */}
       
        </div>
      </div>
    </header>
  );
}
