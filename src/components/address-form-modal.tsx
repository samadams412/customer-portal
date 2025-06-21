// src/components/address-form-modal.tsx
'use client';

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Address } from "@/types/product"; // Import Address interface
import Auth from "@/lib/auth-client"; // Client-side auth service

// Define the schema for address form validation using Zod
const addressFormSchema = z.object({
  street: z.string().min(3, { message: "Street is too short" }).max(100, { message: "Street is too long" }),
  city: z.string().min(2, { message: "City is too short" }).max(50, { message: "City is too long" }),
  state: z.string().length(2, { message: "State must be 2 characters (e.g., CA)" }),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, { message: "Invalid zip code format" }),
  isDefault: z.boolean().default(false).optional(), // Optional, default to false
});

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: (refreshNeeded?: boolean) => void;
  addressToEdit: Address | null; // Null for adding, Address object for editing
}

export function AddressFormModal({ isOpen, onClose, addressToEdit }: AddressFormModalProps) {
  const form = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      isDefault: false,
    },
  });

  // Populate form fields if editing an existing address
  useEffect(() => {
    if (addressToEdit) {
      form.reset({
        street: addressToEdit.street,
        city: addressToEdit.city,
        state: addressToEdit.state,
        zipCode: addressToEdit.zipCode,
        isDefault: addressToEdit.isDefault,
      });
    } else {
      form.reset(); // Clear form for new address
    }
  }, [addressToEdit, form]);

  const onSubmit = async (values: z.infer<typeof addressFormSchema>) => {
    try {
      const token = Auth.getToken();
      if (!token) {
        throw new Error("Authentication token missing.");
      }

      const method = addressToEdit ? 'PUT' : 'POST';
      const url = addressToEdit ? `/api/address/${addressToEdit.id}` : '/api/address';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to ${addressToEdit ? 'update' : 'add'} address: ${res.status}`);
      }

      console.log(`Address ${addressToEdit ? 'updated' : 'added'} successfully!`);
      onClose(true); // Close and signal parent to refresh
    } catch (error: unknown) {
      console.error(`Error ${addressToEdit ? 'updating' : 'adding'} address:`, error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      // Set a form-level error or specific field error
      form.setError("root.serverError", {
        type: "server",
        message: errorMessage,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose(); // Only close if user initiates closing
      form.reset(); // Reset form state when dialog closes
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{addressToEdit ? "Edit Address" : "Add New Address"}</DialogTitle>
          <DialogDescription>
            {addressToEdit ? "Make changes to your address here." : "Add a new shipping or billing address."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Anytown" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State (2-letter code)</FormLabel>
                  <FormControl>
                    <Input placeholder="CA" {...field} maxLength={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="90210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    {/* Checkbox component needs to be imported or custom built */}
                    {/* For simplicity, using a native input type checkbox here */}
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Set as Default Address</FormLabel>
                    <DialogDescription className="text-sm text-muted-foreground">
                      Setting this as default will unmark any other default addresses.
                    </DialogDescription>
                  </div>
                </FormItem>
              )}
            />
            {form.formState.errors.root?.serverError && (
              <p className="text-red-500 text-sm mt-2">
                {form.formState.errors.root.serverError.message}
              </p>
            )}
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : (addressToEdit ? "Save Changes" : "Add Address")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
