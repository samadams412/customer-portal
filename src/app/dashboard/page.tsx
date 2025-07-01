// src/app/dashboard/page.tsx
// This is the main user dashboard page, now refactored to use custom hooks and modular components.

'use client'; // This remains a client component as it handles user interaction and client-side data fetching.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react'; // For NextAuth.js session management

// Import custom hooks
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useAddresses } from '@/hooks/useAddresses';
import { useOrders } from '@/hooks/useOrders';

// Import modular components
//import { UserProfileSection } from '@/components/app-ui/dashboard/UserProfileSection'; // New profile section
import { AddressListSection } from '@/components/app-ui/dashboard/AddressListSection'; // New address list section
import { OrderListSection } from '@/components/app-ui/dashboard/OrderListSection';     // New order list section
import { ConfirmationDialog } from '@/components/app-ui/dashboard/ConfirmationDialog'; // Existing dialog
import { AddressFormModal } from '@/components/app-ui/dashboard/AddressFormModal';   // Existing address form modal
import { Button } from "@/components/ui/button"; // Shadcn button


export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession(); // Get session data and status from NextAuth.js

  // --- Use Custom Hooks ---
  // 1. Authentication redirection hook
  // This hook handles redirecting unauthenticated users and gives us a loading state for auth.
  const isLoadingAuth = useAuthRedirect(status, router);

  // 2. Addresses management hook
  // This hook provides addresses, loading state, error, and all address-related handlers.
  const {
    addresses,
    loadingAddresses,
    addressError,
    isAddressModalOpen,
    editingAddress,
    isDeleteDialogOpen,
    addressToDeleteId,
    handleAddAddress,
    handleEditAddress,
    confirmDeleteAddress,
    executeDeleteAddress,
    cancelDeleteAddress,
    handleAddressModalClose,
    fetchAddresses, // Expose fetchAddresses to re-trigger from useEffect
  } = useAddresses();

  // 3. Orders management hook
  // This hook provides orders, loading state, and error.
  const {
    orders,
    loadingOrders,
    orderError,
    fetchOrders, // Expose fetchOrders to re-trigger from useEffect
  } = useOrders();

  // --- Initial Data Fetching Effect ---
  useEffect(() => {
    // Only fetch data if authentication is complete and the user is authenticated.
    // The `useAuthRedirect` hook handles the 'unauthenticated' redirect.
    if (!isLoadingAuth && status === 'authenticated') {
      fetchAddresses(); // Initial fetch for addresses
      fetchOrders();    // Initial fetch for orders
    }
  }, [isLoadingAuth, status, fetchAddresses, fetchOrders]); // Dependencies to re-run fetches


  // Handle Logout
  const handleLogout = async () => {
    // signOut from NextAuth.js and redirect to the login page
    await signOut({ callbackUrl: '/auth' });
  };


  // --- Render Loading / Error States ---
  if (isLoadingAuth || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading dashboard...</p>
      </div>
    );
  }

  // If status is unauthenticated, useAuthRedirect already pushed to /auth, so this component won't render.
  // We can return null here as a fallback or if there's a slight delay in redirection.
  if (status === 'unauthenticated') {
    return null;
  }

  // --- Render Dashboard Content ---
  return (
    <main className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button
          onClick={handleLogout}
          variant="destructive"
          className=""
        >
          Logout
        </Button>
      </div>

      {/* User Profile Section */}
      {/* This component internally uses useSession to display profile info */}
      {/* <UserProfileSection /> */}

      {/* Addresses Section - Now using the AddressListSection component */}
      <AddressListSection
        addresses={addresses}
        loading={loadingAddresses}
        error={addressError}
        onAddAddress={handleAddAddress}
        onEditAddress={handleEditAddress}
        onDeleteAddress={confirmDeleteAddress} // Pass the confirmation handler
      />

      {/* Order History Section - Now using the OrderListSection component */}
      <OrderListSection
        orders={orders}
        loading={loadingOrders}
        error={orderError}
      />

      {/* Confirmation Dialog - Remains here, controlled by useAddresses hook's state */}
      {/* TODO: Check if address is properly being deleted. */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={executeDeleteAddress}
        onCancel={cancelDeleteAddress}
        title="Confirm Address Deletion"
        description="Are you sure you want to delete this address? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Address Form Modal - Remains here, controlled by useAddresses hook's state */}
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
