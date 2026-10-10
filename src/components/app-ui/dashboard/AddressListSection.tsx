// src/components/AddressListSection.tsx
// This component renders the section for displaying a user's addresses.
// It handles loading, error, and empty states, and provides actions for managing addresses.

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AddressCard } from "@/components/app-ui/dashboard/AddressCard"; // Import the AddressCard component
import { Address } from "@/types/interface"; // Import the Address interface

interface AddressListSectionProps {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  onAddAddress: () => void;
  onEditAddress: (addressId: string) => void;
  onDeleteAddress: (addressId: string) => Promise<void>; 
}

export function AddressListSection({
  addresses,
  loading,
  error,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
}: AddressListSectionProps) {
  return (
    <section className="bg-card text-card-foreground rounded-lg shadow-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-heading text-2xl font-semibold">Your Addresses</h2>
        <Button onClick={onAddAddress} variant="cta">
          Add New Address
        </Button>
      </div>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-md bg-muted" />
          <Skeleton className="h-24 w-full rounded-md bg-muted" />
        </div>
      ) : error ? (
        <p className="text-destructive text-center">{error}</p>
      ) : addresses.length === 0 ? (
        <p className="text-muted-foreground text-center">No addresses found. Add one!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={onEditAddress}
              onDelete={onDeleteAddress}
            />
          ))}
        </div>
      )}
    </section>
  );
}
