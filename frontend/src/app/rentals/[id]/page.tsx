"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useContracts } from "@/lib/hooks/useContracts";
import RentalDetails from "@/components/rentals/RentalDetails";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { Rental, Equipment } from "@/types";
import { ethers } from "ethers";
import { formatRental } from '@/lib/adapters';

export default function RentalDetailsPage() {
  const params = useParams();
  const rentalId = parseInt(params.id as string);
  const { isConnected, connect, contracts, account } = useContracts();
  const [rental, setRental] = useState<Rental | null>(null);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isConnected && contracts.rentalManager && rentalId) {
      loadRentalData();
    }
  }, [isConnected, contracts, rentalId]);

  const loadRentalData = async () => {
    if (!contracts.rentalManager || !contracts.equipmentRegistry) {
      setError("Les contrats ne sont pas disponibles");
      setIsLoading(false);
      return;
    }
    
    try {
      const rentalData = await contracts.rentalManager.getRental(rentalId);
      
      // Convertir les données de la blockchain en format utilisable dans l'UI
      const rental: Rental = {
        id: Number(rentalData.id),
        equipmentId: Number(rentalData.equipmentId),
        renter: rentalData.renter,
        owner: rentalData.owner,
        startDate: Number(rentalData.startDate),
        endDate: Number(rentalData.endDate),
        dailyRate: ethers.formatEther(rentalData.dailyRate),
        deposit: ethers.formatEther(rentalData.deposit),
        totalAmount: ethers.formatEther(rentalData.totalAmount),
        isActive: rentalData.isActive,
        isReturned: rentalData.isReturned,
        isCancelled: rentalData.isCancelled,
        isDepositReturned: rentalData.isDepositReturned,
        isConfirmed: rentalData.isConfirmed,
        createdAt: Number(rentalData.createdAt),
        updatedAt: Number(rentalData.updatedAt)
      };

      setRental(rental);
      
      // Fetch equipment details
      const equipmentData = await contracts.equipmentRegistry.getEquipment(rental.equipmentId);
      
      const equipment: Equipment = {
        id: Number(equipmentData.id),
        owner: equipmentData.owner,
        name: equipmentData.name,
        description: equipmentData.description,
        imageURI: equipmentData.imageURI,
        dailyRate: ethers.formatEther(equipmentData.dailyRate),
        isAvailable: equipmentData.isAvailable,
        createdAt: Number(equipmentData.createdAt),
        updatedAt: Number(equipmentData.updatedAt),
        isDeleted: equipmentData.isDeleted
      };
      
      setEquipment(equipment);
      setIsLoading(false);
    } catch (err) {
      console.error("Erreur lors du chargement des détails de la location:", err);
      setError("Impossible de charger les détails de la location");
      setIsLoading(false);
    }
  };

  const handleCancelRental = async () => {
    if (!contracts.rentalManager || !rental) return;
    
    try {
      setIsProcessing(true);
      const tx = await contracts.rentalManager.cancelRental(rental.id);
      await tx.wait();
      await loadRentalData();
      setIsProcessing(false);
    } catch (err) {
      console.error("Erreur lors de l'annulation de la location:", err);
      setIsProcessing(false);
    }
  };

  const handleMarkAsReturned = async () => {
    if (!contracts.rentalManager || !rental) return;
    
    try {
      setIsProcessing(true);
      const tx = await contracts.rentalManager.confirmReturn(rental.id, true);
      await tx.wait();
      await loadRentalData();
      setIsProcessing(false);
    } catch (err) {
      console.error("Erreur lors du marquage comme retourné:", err);
      setIsProcessing(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4">Connexion requise</h2>
              <p className="mb-4">Veuillez vous connecter pour voir les détails de cette location.</p>
              <button 
                onClick={connect}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Connecter votre wallet
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          {error}
        </div>
      ) : rental && equipment ? (
        <RentalDetails
          rental={rental}
          equipment={equipment}
          onCancel={account === rental.renter ? handleCancelRental : undefined}
          onMarkReturned={account === rental.owner ? handleMarkAsReturned : undefined}
        />
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold">Location non trouvée</h2>
        </div>
      )}
    </div>
  );
} 