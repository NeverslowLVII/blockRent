"use client";

import { useState, useEffect } from "react";
import { useContracts } from "@/lib/hooks/useContracts";
import Link from "next/link";

interface Rental {
  id: number;
  equipmentId: number;
  renter: string;
  owner: string;
  startDate: number;
  endDate: number;
  dailyRate: string;
  deposit: string;
  totalAmount: string;
  isActive: boolean;
  isReturned: boolean;
  isCancelled: boolean;
  isDepositReturned: boolean;
  isConfirmed: boolean;
  createdAt: number;
  updatedAt: number;
}

export default function RentalsPage() {
  const { contracts, isConnected, connect, account } = useContracts();
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

  // Fonction pour formater les dates
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Fonction pour formater le prix en ETH
  const formatPrice = (price: string) => {
    return `${price} ETH`;
  };

  // Si l'utilisateur n'est pas connecté, demander la connexion
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold mb-6">Mes locations</h1>
          <p className="text-lg text-gray-600 mb-8">
            Connectez votre portefeuille pour voir vos locations.
          </p>
          <button
            onClick={connect}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition"
          >
            Connecter mon portefeuille
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mes locations</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Erreur: {error}
        </div>
      ) : rentals.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600 mb-8">
            Vous n'avez pas encore de locations.
          </p>
          <Link
            href="/equipments"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition inline-block"
          >
            Explorer les équipements disponibles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {rentals.map((rental) => (
            <div 
              key={rental.id}
              className="border rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Location #{rental.id}
                      <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                        rental.isActive 
                          ? rental.isConfirmed
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                          : rental.isCancelled
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }`}>
                        {rental.isActive 
                          ? rental.isConfirmed
                            ? "Confirmée"
                            : "En attente de confirmation"
                          : rental.isCancelled
                            ? "Annulée"
                            : rental.isReturned
                              ? "Retournée"
                              : "Terminée"}
                      </span>
                    </h2>
                    <p className="text-gray-600">Équipement #{rental.equipmentId}</p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <span className="font-semibold text-blue-600 block">
                      {formatPrice(rental.totalAmount)} + {formatPrice(rental.deposit)} (caution)
                    </span>
                    <span className="text-gray-500 text-sm block">
                      {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-6">
                  <Link
                    href={`/rentals/${rental.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition text-sm"
                  >
                    Voir les détails
                  </Link>
                  
                  {rental.isActive && !rental.isConfirmed && (
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition text-sm"
                    >
                      Annuler
                    </button>
                  )}
                  
                  {rental.isActive && rental.isConfirmed && !rental.isReturned && (
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded transition text-sm"
                    >
                      Marquer comme retourné
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 