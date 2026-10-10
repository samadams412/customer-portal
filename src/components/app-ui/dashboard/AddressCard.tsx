// src/components/address-card.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Address } from "@/types/interface"; // Import the Address interface

interface AddressCardProps {
  address: Address;
  onEdit: (addressId: string) => void;
  onDelete: (addressId: string) => Promise<void>; // onDelete is an async function
}

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-semibold flex items-center gap-2">
          {address.isDefault && (
            <Badge className="bg-success text-success-foreground">Default</Badge>
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
