// src/components/address-card.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Address } from "@/types/product"; // Import the Address interface

interface AddressCardProps {
  address: Address;
  onEdit: (addressId: string) => void;
  onDelete: (addressId: string) => Promise<void>; // onDelete is an async function
}

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          {address.isDefault && (
            <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
              Default
            </span>
          )}
          {address.street}
        </CardTitle>
        <CardDescription>
          {address.city}, {address.state} {address.zipCode}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(address.id)}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(address.id)}>
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}
