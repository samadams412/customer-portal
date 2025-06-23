'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // Import useSession from NextAuth.js
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Address, Order } from '@/types/product'; // Import Address and Order interfaces

// Import the modular components
import { AddressCard } from '@/components/address-card';
import { OrderCard } from '@/components/order-card';
import { ConfirmationDialog } from '@/components/confirmation-dialog';
import { AddressFormModal } from '@/components/address-form-modal';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession(); // Get session data and status from NextAuth.js

  const [loadingInitialAuth, setLoadingInitialAuth] = useState(true); // Initial loading for authentication check
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [addressError, setAddressError] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  // State for the Address Form Modal
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null); // Null for add, Address object for edit

  // State for Delete Confirmation Dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addressToDeleteId, setAddressToDeleteId] = useState<string | null>(null);

  // 1. Handle authentication status and redirect if not logged in
  useEffect(() => {
    if (status === 'loading') {
      setLoadingInitialAuth(true); // Still checking session
    } else if (status === 'unauthenticated') {
      router.push('/auth'); // Redirect to login page if not authenticated
    } else if (status === 'authenticated') {
      setLoadingInitialAuth(false); // Authentication check complete and successful
    }
  }, [status, router]);


  // 2. Fetch Addresses for the authenticated user
  const fetchAddresses = useCallback(async () => {
    if (status !== 'authenticated') { // Ensure user is authenticated before fetching
      setLoadingAddresses(false); // Stop loading if not authenticated
      setAddressError("Not authenticated to fetch addresses.");
      return;
    }

    setLoadingAddresses(true);
    setAddressError(null);
    try {
      // No manual token needed; NextAuth.js handles session cookies automatically
      const res = await fetch('/api/address');

      if (!res.ok) {
        if (res.status === 401) { // Unauthorized, might be session issue
          router.push('/auth'); // Redirect to login
          return;
        }
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
  }, [status, router]); // Dependency on status to trigger fetch when auth changes

  // 3. Fetch Orders for the authenticated user
  const fetchOrders = useCallback(async () => {
    if (status !== 'authenticated') { // Ensure user is authenticated before fetching
      setLoadingOrders(false); // Stop loading if not authenticated
      setOrderError("Not authenticated to fetch orders.");
      return;
    }

    setLoadingOrders(true);
    setOrderError(null);
    try {
      // No manual token needed
      const res = await fetch('/api/orders');

      if (!res.ok) {
        if (res.status === 401) { // Unauthorized, might be session issue
          router.push('/auth'); // Redirect to login
          return;
        }
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
  }, [status, router]); // Dependency on status to trigger fetch when auth changes

  // Trigger fetches when authentication status becomes 'authenticated'
  useEffect(() => {
    if (status === 'authenticated') {
      fetchAddresses();
      fetchOrders();
    }
  }, [status, fetchAddresses, fetchOrders]); // Trigger when status becomes authenticated


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

  // Initiates the confirmation dialog
  const confirmDeleteAddress = async (addressId: string) => { 
    setAddressToDeleteId(addressId);
    setIsDeleteDialogOpen(true);
  };

  // Handles the actual deletion after confirmation
  const executeDeleteAddress = async () => {
    if (!addressToDeleteId) return;

    try {
      // No manual token needed
      const res = await fetch(`/api/address/${addressToDeleteId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/auth');
          return;
        }
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to delete address: ${res.status}`);
      }

      //console.log(`Address ${addressToDeleteId} deleted successfully.`);
      fetchAddresses(); // Re-fetch addresses to update the list
      setIsDeleteDialogOpen(false); // Close dialog
      setAddressToDeleteId(null); // Clear ID
    } catch (error: unknown) {
      console.error("Error deleting address:", error);
      setAddressError(error instanceof Error ? error.message : "Failed to delete address.");
      setIsDeleteDialogOpen(false); // Close dialog even on error
      setAddressToDeleteId(null); // Clear ID
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


  // Show loading indicator until authentication status is determined
  if (loadingInitialAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // If not authenticated, the useEffect above should have redirected.
  // This return null is a safeguard, but typically won't be reached if redirect works.
  if (status === 'unauthenticated') {
    return null;
  }

  // If we reach here, user is authenticated
  return (
    <main className="container mx-auto p-6 space-y-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

      {/* Addresses Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Addresses</h2>
          <Button onClick={handleAddAddress} className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
            Add New Address
          </Button>
        </div>
        {loadingAddresses ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-24 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
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
                onDelete={confirmDeleteAddress}
              />
            ))}
          </div>
        )}
      </section>

      {/* Order History Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
        {loadingOrders ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-40 w-full rounded-md bg-gray-200 dark:bg-gray-700" />
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

      {/* Address Form Modal */}
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
