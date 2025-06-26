// src/components/UserProfileSection.tsx
// This component displays basic user profile information.

import { useSession } from 'next-auth/react'; // Import useSession to get user data
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UserProfileSection() {
  const { data: session, status } = useSession(); // Get session data and status

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
      <Card className="shadow-none border-none">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Profile Information</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Manage your account details.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {status === 'loading' ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 rounded-md bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-64 rounded-md bg-gray-200 dark:bg-gray-700" />
            </div>
          ) : session?.user ? (
            <div className="space-y-2">
              <p className="text-lg text-gray-800 dark:text-gray-200">
                <span className="font-semibold">Email:</span> {session.user.email}
              </p>
              {/* Add more user details here if available in your session, e.g., name */}
              {session.user.name && (
                <p className="text-lg text-gray-800 dark:text-gray-200">
                  <span className="font-semibold">Name:</span> {session.user.name}
                </p>
              )}
            </div>
          ) : (
            <p className="text-red-500 text-center">User data not available.</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
