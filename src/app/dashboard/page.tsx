// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Auth from '@/lib/auth-client';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Address, Order } from '@/types/product'; // Import only necessary types for this file

// Import the new modular components
import { AddressCard } from '@/components/address-card';
import { OrderCard } from '@/components/order-card';
import { ConfirmationDialog } from '@/components/confirmation-dialog'; // Import the new ConfirmationDialog
import { AddressFormModal } from '@/components/address-form-modal';
// import { AddressFormModal } from '@/components/address-form-modal'; // Will create this later

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [addressError, setAddressError] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // State for the Address Form Modal
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null); // Null for add, Address object for edit

  // State for Delete Confirmation Dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addressToDeleteId, setAddressToDeleteId] = useState<string | null>(null);


  // 1. Authenticate user and redirect if not logged in
  useEffect(() => {
    if (!Auth.loggedIn()) {
      router.push('/auth');
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, [router]);

  // 2. Fetch Addresses for the authenticated user
  const fetchAddresses = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoadingAddresses(true);
    setAddressError(null);
    try {
      const token = Auth.getToken();
      if (!token) {
        setAddressError("Authentication token not found.");
        setLoadingAddresses(false);
        return;
      }

      const res = await fetch('/api/address', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to fetch addresses: ${res.status}`);
      }

      const data: Address[] = await res.json();
      setAddresses(data);
    } catch (error: unknown) {
      console.error("Error fetching addresses:", error);
      setAddressError(error instanceof Error ? error.message : "Failed to load addresses.");
    } finally {
      setLoadingAddresses(false);
    }
  }, [isAuthenticated]);

  // 3. Fetch Orders for the authenticated user
  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoadingOrders(true);
    setOrderError(null);
    try {
      const token = Auth.getToken();
      if (!token) {
        setOrderError("Authentication token not found.");
        setLoadingOrders(false);
        return;
      }

      const res = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to fetch orders: ${res.status}`);
      }

      const data: Order[] = await res.json();
      setOrders(data);
    } catch (error: unknown) {
      console.error("Error fetching orders:", error);
      setOrderError(error instanceof Error ? error.message : "Failed to load orders.");
    } finally {
      setLoadingOrders(false);
    }
  }, [isAuthenticated]);

  // Trigger fetches when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
      fetchOrders();
    }
  }, [isAuthenticated, fetchAddresses, fetchOrders]);


  // --- Address Management Handlers ---
  const handleAddAddress = () => {
    setEditingAddress(null); // Clear any editing state
    setIsAddressModalOpen(true); // Open the modal for adding
  };

  const handleEditAddress = (addressId: string) => {
    const addressToEdit = addresses.find(addr => addr.id === addressId);
    if (addressToEdit) {
      setEditingAddress(addressToEdit); // Set address for editing
      setIsAddressModalOpen(true); // Open the modal for editing
    } else {
      console.warn("Attempted to edit a non-existent address:", addressId);
    }
  };

  // Initiates the confirmation dialog - FIX: Made async to match AddressCard onDelete signature
  const confirmDeleteAddress = async (addressId: string) => { 
    setAddressToDeleteId(addressId);
    setIsDeleteDialogOpen(true);
  };

  // Handles the actual deletion after confirmation
  const executeDeleteAddress = async () => {
    if (!addressToDeleteId) return; // Should not happen if dialog is open correctly

    try {
      const token = Auth.getToken();
      if (!token) {
        throw new Error("Authentication token missing.");
      }

      const res = await fetch(`/api/address/${addressToDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to delete address: ${res.status}`);
      }

      console.log(`Address ${addressToDeleteId} deleted successfully.`);
      fetchAddresses(); // Re-fetch addresses to update the list
      setIsDeleteDialogOpen(false); // Close dialog
      setAddressToDeleteId(null); // Clear ID
    } catch (error: unknown) {
      console.error("Error deleting address:", error);
      setAddressError(error instanceof Error ? error.message : "Failed to delete address.");
      setIsDeleteDialogOpen(false); // Close dialog even on error
      setAddressToDeleteId(null); // Clear ID
      // Optional: Show a more persistent error notification to the user
    }
  };

  // Cancels the deletion
  const cancelDeleteAddress = () => {
    setIsDeleteDialogOpen(false);
    setAddressToDeleteId(null);
  };

  // Handler for when the address modal is closed or saved
  const handleAddressModalClose = (refreshNeeded: boolean = false) => {
    setIsAddressModalOpen(false);
    setEditingAddress(null); // Clear editing state
    if (refreshNeeded) {
      fetchAddresses(); // Re-fetch addresses if a change occurred
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Should redirect, but this is a fallback if not authenticated
  }

  return (
    <main className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6">Your Dashboard</h1>

      {/* Addresses Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Your Addresses</h2>
          <Button onClick={handleAddAddress} className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
            Add New Address
          </Button>
        </div>
        {loadingAddresses ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-md" />
            <Skeleton className="h-24 w-full rounded-md" />
          </div>
        ) : addressError ? (
          <p className="text-red-500 text-center">{addressError}</p>
        ) : addresses.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center">No addresses found. Add one!</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEditAddress}
                onDelete={confirmDeleteAddress} // Use the confirmation dialog trigger
              />
            ))}
          </div>
        )}
      </section>

      {/* Order History Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-4">Your Orders</h2>
        {loadingOrders ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-md" />
            <Skeleton className="h-40 w-full rounded-md" />
          </div>
        ) : orderError ? (
          <p className="text-red-500 text-center">{orderError}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center">No orders found. Start shopping!</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
              />
            ))}
          </div>
        )}
      </section>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={executeDeleteAddress}
        onCancel={cancelDeleteAddress}
        title="Confirm Address Deletion"
        description="Are you sure you want to delete this address? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Address Form Modal (will be implemented next) */}
      {isAddressModalOpen && (
        <AddressFormModal
          isOpen={isAddressModalOpen}
          onClose={handleAddressModalClose}
          addressToEdit={editingAddress}
        />
      )}
    </main>
  );
}
