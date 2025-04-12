"use client";

import { useState, useEffect } from "react";
import { useContracts } from "@/lib/hooks/useContracts";
import Loader from "@/components/ui/Loader";
import RentalCard from "@/components/rentals/RentalCard";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Rental, FormattedRental } from "@/types";
import { ethers } from "ethers";
import { formatRental } from '@/lib/adapters';

export default function RentalsPage() {
  const { isConnected, connect, contracts, account } = useContracts();
  const [isLoadingRentals, setIsLoadingRentals] = useState(true);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [formattedRentals, setFormattedRentals] = useState<FormattedRental[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'owner' | 'renter'>('renter');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isConnected && contracts.rentalManager && account) {
      fetchRentals();
    }
  }, [isConnected, contracts, account, activeTab]);

  // Format the rentals whenever the raw rentals change
  useEffect(() => {
    if (rentals.length > 0) {
      const formatted = rentals.map(rental => formatRental(rental));
      setFormattedRentals(formatted);
    } else {
      setFormattedRentals([]);
    }
  }, [rentals]);

  const fetchRentals = async () => {
    if (!contracts.rentalManager) return;
    
    try {
      setIsLoadingRentals(true);
      setError(null);

      let rentalIds: number[] = [];
      
      if (activeTab === 'renter') {
        // Get rentals where the user is the renter
        const renterRentals = await contracts.rentalManager.getRenterRentals(account);
        rentalIds = renterRentals.map((id: ethers.BigNumberish) => Number(id));
      } else {
        // Get rentals where the user is the owner
        const ownerRentals = await contracts.rentalManager.getOwnerRentals(account);
        rentalIds = ownerRentals.map((id: ethers.BigNumberish) => Number(id));
      }

      const rentalsList: Rental[] = [];

      // Fetch details for each rental
      for (const id of rentalIds) {
        const rentalData = await contracts.rentalManager.getRental(id);
        
        const rental: Rental = {
          id: Number(rentalData.id),
          equipmentId: Number(rentalData.equipmentId),
          renter: rentalData.renter,
          owner: rentalData.owner,
          startDate: Number(rentalData.startDate),
          endDate: Number(rentalData.endDate),
          dailyRate: rentalData.dailyRate,
          deposit: rentalData.deposit,
          totalAmount: rentalData.totalAmount,
          isActive: rentalData.isActive,
          isReturned: rentalData.isReturned,
          isCancelled: rentalData.isCancelled,
          isDepositReturned: rentalData.isDepositReturned,
          isConfirmed: rentalData.isConfirmed,
          createdAt: Number(rentalData.createdAt),
          updatedAt: Number(rentalData.updatedAt)
        };
        
        rentalsList.push(rental);
      }

      // Sort rentals by start date (most recent first)
      rentalsList.sort((a, b) => b.startDate - a.startDate);
      setRentals(rentalsList);
    } catch (err) {
      console.error("Erreur lors du chargement des locations:", err);
      setError("Impossible de charger vos locations. Veuillez réessayer plus tard.");
    } finally {
      setIsLoadingRentals(false);
    }
  };
  
  const handleCancelRental = async (rentalId: number) => {
    if (!contracts.rentalManager) return;
    
    try {
      setIsProcessing(true);
      const tx = await contracts.rentalManager.cancelRental(rentalId);
      await tx.wait();
      await fetchRentals();
      setIsProcessing(false);
    } catch (err) {
      console.error("Erreur lors de l'annulation de la location:", err);
      setIsProcessing(false);
    }
  };
  
  const handleMarkReturned = async (rentalId: number) => {
    if (!contracts.rentalManager) return;
    
    try {
      setIsProcessing(true);
      const tx = await contracts.rentalManager.confirmReturn(rentalId, true);
      await tx.wait();
      await fetchRentals();
      setIsProcessing(false);
    } catch (err) {
      console.error("Erreur lors du marquage comme retourné:", err);
      setIsProcessing(false);
    }
  };

  // Si l'utilisateur n'est pas connecté, demander la connexion
  if (!isConnected) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Mes locations</h1>
          <Card>
            <CardContent className="text-center py-16">
              <p className="text-lg text-gray-600 mb-8">
                Connectez votre portefeuille pour voir vos locations.
              </p>
              <div className="flex justify-center">
                <Button size="lg" onClick={connect}>
                  Connecter mon portefeuille
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mes locations</h1>
        
        {isLoadingRentals ? (
          <Card>
            <CardContent className="flex justify-center items-center py-20">
              <Loader size="lg" />
            </CardContent>
          </Card>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Erreur lors du chargement des locations:</h3>
            <p>{error}</p>
            <div className="mt-4">
              <Button onClick={() => window.location.reload()}>
                Actualiser la page
              </Button>
            </div>
          </div>
        ) : rentals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <p className="text-lg text-gray-600 mb-4">
                Vous n&apos;avez pas encore de location.
              </p>
              <Button onClick={() => window.location.href = "/equipments"}>
                Voir les équipements disponibles
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6">
            {formattedRentals.map((rental) => (
              <RentalCard
                key={rental.id}
                rental={rental}
                onCancel={() => handleCancelRental(rental.id)}
                onMarkReturned={() => handleMarkReturned(rental.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 