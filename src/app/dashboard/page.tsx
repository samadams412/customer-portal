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

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
// Import modular components
//import { UserProfileSection } from '@/components/app-ui/dashboard/UserProfileSection'; // New profile section
import { AddressListSection } from '@/components/app-ui/dashboard/AddressListSection'; // New address list section
import { OrderListSection } from '@/components/app-ui/dashboard/OrderListSection';     // New order list section
import { ConfirmationDialog } from '@/components/app-ui/dashboard/ConfirmationDialog'; // Existing dialog
import { AddressFormModal } from '@/components/app-ui/dashboard/AddressFormModal';   // Existing address form modal
import { Button } from "@/components/ui/button"; // Shadcn button
import { UserProfileSection } from '@/components/app-ui/dashboard/UserProfileSection';
import { OrderListTable } from '@/components/app-ui/dashboard/OrderListTable';


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

  
  if (!session || !session.user) {
    return (
      <main className="container mx-auto p-6">
        <p className="text-center text-muted-foreground">You must be logged in to view the dashboard.</p>
      </main>
    );
  }

  // --- Render Dashboard Content ---
return (
<main className="container mx-auto p-6">
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
    <h1 className="text-3xl font-bold">Dashboard</h1>
    {session?.user?.email && (
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          Logged in as <span className="font-medium text-foreground">{session.user.email}</span>
        </div>
        <Button onClick={handleLogout} variant="destructive">
          Logout
        </Button>
      </div>
    )}
  </div>

  <Tabs defaultValue="profile" className="w-full">
    <TabsList className="mb-4">
      <TabsTrigger value="profile">Account Info</TabsTrigger>
      <TabsTrigger value="addresses">Addresses</TabsTrigger>
      <TabsTrigger value="orders">Orders</TabsTrigger>
    </TabsList>

    <TabsContent value="profile">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <UserProfileSection />
      </motion.div>
    </TabsContent>

    <TabsContent value="addresses">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AddressListSection
          addresses={addresses}
          loading={loadingAddresses}
          error={addressError}
          onAddAddress={handleAddAddress}
          onEditAddress={handleEditAddress}
          onDeleteAddress={confirmDeleteAddress}
        />
      </motion.div>
    </TabsContent>

    <TabsContent value="orders">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <OrderListSection
          orders={orders}
          loading={loadingOrders}
          error={orderError}
        />
      </motion.div>
    </TabsContent>
  </Tabs>

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

  {/* Address Modal */}
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
