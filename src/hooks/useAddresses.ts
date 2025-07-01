// src/hooks/useAddresses.ts
// Custom hook to manage address data, loading states, errors, and associated modal/dialog logic.

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react'; // Import useSession for authentication status
import { Address } from '@/types/interface'; // Import Address interface

interface UseAddressesReturn {
  addresses: Address[];
  loadingAddresses: boolean;
  addressError: string | null;
  isAddressModalOpen: boolean;
  editingAddress: Address | null;
  isDeleteDialogOpen: boolean;
  addressToDeleteId: string | null;
  handleAddAddress: () => void;
  handleEditAddress: (addressId: string) => void;
  confirmDeleteAddress: (addressId: string) => Promise<void>; // FIX: Changed to return Promise<void>
  executeDeleteAddress: () => Promise<void>;
  cancelDeleteAddress: () => void;
  handleAddressModalClose: (refreshNeeded?: boolean) => void;
  fetchAddresses: () => Promise<void>; // Export fetchAddresses for external trigger
}

/**
 * Custom hook for managing user addresses, including fetching, adding, editing, and deleting.
 * It also handles the state for address-related modals and confirmation dialogs.
 *
 * @returns An object containing address data, loading/error states, and all necessary handlers.
 */
export function useAddresses(): UseAddressesReturn {
  const { data: session, status } = useSession(); // Get session data and status

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState<string | null>(null);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addressToDeleteId, setAddressToDeleteId] = useState<string | null>(null);

  // --- Data Fetching ---
  const fetchAddresses = useCallback(async () => {
    // Only fetch if authenticated and user ID is available
    if (status !== 'authenticated' || !session?.user?.id) {
      setLoadingAddresses(false);
      setAddressError("Not authenticated to fetch addresses.");
      return;
    }

    setLoadingAddresses(true);
    setAddressError(null);
    try {
      // No manual token handling needed; NextAuth.js session cookies are automatically sent
      const res = await fetch('/api/address');

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
  }, [status, session?.user?.id]); // Dependencies for useCallback

  // --- Address Management Handlers ---
  const handleAddAddress = () => {
    setEditingAddress(null); // Clear any editing state for new address
    setIsAddressModalOpen(true); // Open the modal
  };

  const handleEditAddress = (addressId: string) => {
    const addressToEdit = addresses.find(addr => addr.id === addressId);
    if (addressToEdit) {
      setEditingAddress(addressToEdit); // Set address data for editing
      setIsAddressModalOpen(true); // Open the modal
    } else {
      console.warn("Attempted to edit a non-existent address:", addressId);
    }
  };

  // FIX: Made async to return Promise<void> and satisfy the interface
  const confirmDeleteAddress = async (addressId: string) => {
    setAddressToDeleteId(addressId); // Store ID of address to delete
    setIsDeleteDialogOpen(true); // Open confirmation dialog
  };

  const executeDeleteAddress = async () => {
    if (!addressToDeleteId) return; // Should not happen if dialog opened correctly

    try {
      // No manual token handling needed
      const res = await fetch(`/api/address/${addressToDeleteId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
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

  const cancelDeleteAddress = () => {
    setIsDeleteDialogOpen(false); // Close dialog
    setAddressToDeleteId(null); // Clear ID
  };

  const handleAddressModalClose = (refreshNeeded: boolean = false) => {
    setIsAddressModalOpen(false); // Close modal
    setEditingAddress(null); // Clear editing state
    if (refreshNeeded) {
      fetchAddresses(); // Re-fetch addresses if changes were made
    }
  };

  return {
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
    fetchAddresses, // Expose fetchAddresses for the main DashboardPage to trigger initially
  };
}
