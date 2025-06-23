// Custom hook to handle authentication status and redirect unauthenticated users.

import { useEffect, useState } from 'react';
// FIX: Removed the incorrect import of SessionStatus.
// We will define a local type alias that matches the actual string literals.
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'; // Type for useRouter instance

/**
 * Type alias for the possible session status strings returned by useSession().
 */
type SessionStatus = "authenticated" | "unauthenticated" | "loading";

/**
 * Custom hook to manage authentication-based redirection.
 *
 * @param status The authentication status from useSession() ('loading', 'authenticated', 'unauthenticated').
 * @param router The Next.js router instance from useRouter().
 * @returns A boolean indicating if the initial authentication check is still loading.
 */
export function useAuthRedirect(status: SessionStatus, router: AppRouterInstance): boolean {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      // Still loading session data, keep loading state true
      setIsLoadingAuth(true);
    } else if (status === 'unauthenticated') {
      // If the user is unauthenticated, redirect to the login page.
      // Using router.replace instead of router.push prevents adding the current page to history,
      // so the user can't navigate back to a protected page after being redirected.
      router.replace('/auth');
      setIsLoadingAuth(false); // Authentication check complete, user is not authenticated
    } else if (status === 'authenticated') {
      // User is authenticated, authentication check is complete
      setIsLoadingAuth(false);
    }
  }, [status, router]); // Dependencies: re-run effect if status or router instance changes

  return isLoadingAuth; // Return the loading state for the initial auth check
}
