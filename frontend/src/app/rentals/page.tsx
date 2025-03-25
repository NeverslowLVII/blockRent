"use client";

import { useState, useEffect } from "react";
import { useContracts } from "@/lib/hooks/useContracts";
import Link from "next/link";
import Loader from "@/components/ui/Loader";
import RentalCard from "@/components/rentals/RentalCard";
import Button from "@/components/ui/Button";
import { Rental } from "@/types";

export default function RentalsPage() {
  const { isConnected, connect, account } = useContracts();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pour cette démonstration, nous utilisons des locations fictives
  // Dans une implémentation réelle, vous récupéreriez les données depuis la blockchain
  useEffect(() => {
    // Simuler le chargement des données
    const loadMockData = () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockRentals = [
          {
            id: 1,
            equipmentId: 1,
            renter: account || "0x0000000000000000000000000000000000000000",
            owner: "0x1234567890123456789012345678901234567890",
            startDate: Date.now() + 86400000, // demain
            endDate: Date.now() + 259200000, // dans 3 jours
            dailyRate: "0.5",
            deposit: "1.0",
            totalAmount: "1.0",
            isActive: true,
            isReturned: false,
            isCancelled: false,
            isDepositReturned: false,
            isConfirmed: true,
            createdAt: Date.now() - 86400000,
            updatedAt: Date.now() - 86400000,
          },
          {
            id: 2,
            equipmentId: 3,
            renter: account || "0x0000000000000000000000000000000000000000",
            owner: "0x9876543210987654321098765432109876543210",
            startDate: Date.now() + 604800000, // dans 7 jours
            endDate: Date.now() + 864000000, // dans 10 jours
            dailyRate: "0.2",
            deposit: "0.4",
            totalAmount: "0.6",
            isActive: true,
            isReturned: false,
            isCancelled: false,
            isDepositReturned: false,
            isConfirmed: false,
            createdAt: Date.now() - 43200000,
            updatedAt: Date.now() - 43200000,
          },
        ];
        setRentals(mockRentals);
        setIsLoading(false);
      }, 1000);
    };

    if (isConnected) {
      loadMockData();
    } else {
      setIsLoading(false);
    }
  }, [isConnected, account]);

  const handleCancel = (rentalId: number) => {
    setError(null);
    // Dans une application réelle, vous appelleriez le contrat ici
    alert(`Annulation de la location #${rentalId}`);
  };

  const handleMarkReturned = (rentalId: number) => {
    setError(null);
    // Dans une application réelle, vous appelleriez le contrat ici
    alert(`Marquage comme retourné de la location #${rentalId}`);
  };

  // Si l'utilisateur n'est pas connecté, demander la connexion
  if (!isConnected) {
    return (
      <div className="animate-fade-in">
        <div className="section">
          <h1>Mes locations</h1>
          <div className="card card-body text-center py-16">
            <p className="text-lg text-gray-600 mb-8">
              Connectez votre portefeuille pour voir vos locations.
            </p>
            <div className="flex justify-center">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={connect}
              >
                Connecter mon portefeuille
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="section">
        <h1>Mes locations</h1>
        
        {isLoading ? (
          <div className="card card-body flex justify-center items-center py-20">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            Erreur: {error}
          </div>
        ) : rentals.length === 0 ? (
          <div className="card card-body text-center py-16">
            <p className="text-lg text-gray-600 mb-8">
              Vous n&apos;avez pas encore de locations.
            </p>
            <div className="flex justify-center">
              <Link href="/equipments">
                <Button variant="primary" size="lg">
                  Explorer les équipements disponibles
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="rental-list">
            {rentals.map((rental) => (
              <RentalCard 
                key={rental.id} 
                rental={rental}
                onCancel={handleCancel}
                onMarkReturned={handleMarkReturned}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 