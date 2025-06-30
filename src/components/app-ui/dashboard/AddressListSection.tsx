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
    <section className="  rounded-lg shadow-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-primary ">Your Addresses</h2>
        <Button onClick={onAddAddress} className="bg-blue-600 hover:bg-blue-500 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
          Add New Address
        </Button>
      </div>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-24 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : addresses.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center">No addresses found. Add one!</p>
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
