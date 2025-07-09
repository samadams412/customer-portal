// src/components/app-ui/dashboard/UserProfileSection.tsx

import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { Button } from "@/components/ui/button";

export function UserProfileSection() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";

  return (
    <section className="text-card-foreground rounded-lg shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Account</h2>

      {/* Collapsible User Info */}
      <Collapsible defaultOpen>
        <Card className="border border-border bg-card">
          <CardHeader className="pb-2">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between px-0 font-semibold text-left text-lg"
              >
                Profile Info
              </Button>
            </CollapsibleTrigger>
            <CardDescription className="text-muted-foreground text-sm">
              Your email and account name.
            </CardDescription>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-2">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48 rounded-md bg-muted" />
                  <Skeleton className="h-4 w-64 rounded-md bg-muted" />
                </div>
              ) : session?.user ? (
                <>
                  <p className="text-sm">
                    <span className="font-semibold">Email:</span>{" "}
                    {session.user.email}
                  </p>
                  {session.user.name && (
                    <p className="text-sm">
                      <span className="font-semibold">Name:</span>{" "}
                      {session.user.name}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-destructive">User data not available.</p>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Collapsible Password Change */}
      <Collapsible>
        <Card className="border border-border bg-card">
          <CardHeader className="pb-2">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between px-0 font-semibold text-left text-lg"
              >
                Change Password
              </Button>
            </CollapsibleTrigger>
            <CardDescription className="text-muted-foreground text-sm">
              Update your password securely.
            </CardDescription>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pt-2">
              <ChangePasswordForm />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </section>
  );
}
