// src/components/app-ui/dashboard/UserProfileSection.tsx

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UserProfileSection() {
  const { data: session, status } = useSession();

  return (
    <section className=" text-card-foreground rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-4">Info</h2>
      <Card className="shadow-none border border-border bg-card text-card-foreground">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-2xl font-semibold">Profile Information</CardTitle>
          <CardDescription className="text-muted-foreground">Manage your account details.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {status === 'loading' ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 rounded-md bg-muted" />
              <Skeleton className="h-4 w-64 rounded-md bg-muted" />
            </div>
          ) : session?.user ? (
            <div className="space-y-2">
              <p className="text-lg">
                <span className="font-semibold">Email:</span> {session.user.email}
              </p>
              {session.user.name && (
                <p className="text-lg">
                  <span className="font-semibold">Name:</span> {session.user.name}
                </p>
              )}
            </div>
          ) : (
            <p className="text-destructive">User data not available.</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
