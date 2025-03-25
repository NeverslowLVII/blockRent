"use client";

import { useState, useEffect } from "react";
import { useContracts } from "@/lib/hooks/useContracts";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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

interface Equipment {
  id: number;
  name: string;
  description: string;
  imageURI: string;
}

export default function RentalDetailsPage() {
  const { contracts, isConnected, connect, account } = useContracts();
  const [rental, setRental] = useState<Rental | null>(null);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const rentalId = params.id as string;

  // Pour cette démonstration, nous utilisons des données fictives
  // Dans une implémentation réelle, vous récupéreriez les données depuis la blockchain
  useEffect(() => {
    if (!isConnected || !rentalId) {
      setIsLoading(false);
      return;
    }

    // Simuler le chargement des données
    const loadMockData = () => {
      setIsLoading(true);
      setTimeout(() => {
        // Données fictives pour la démonstration
        const mockRental = {
          id: parseInt(rentalId),
          equipmentId: 1,
          renter: account || "0x0000000000000000000000000000000000000000",
          owner: "0x1234567890123456789012345678901234567890",
          startDate: Date.now() + 86400000, // demain
          endDate: Date.now() + 259200000, // dans 3 jours
          dailyRate: "0.5",
          deposit: "1.0",
          totalAmount: "1.5",
          isActive: true,
          isReturned: false,
          isCancelled: false,
          isDepositReturned: false,
          isConfirmed: true,
          createdAt: Date.now() - 86400000,
          updatedAt: Date.now() - 86400000,
        };

        const mockEquipment = {
          id: 1,
          name: "Tronçonneuse professionnelle",
          description: "Tronçonneuse à essence de qualité professionnelle, idéale pour les gros travaux forestiers.",
          imageURI: "https://images.unsplash.com/photo-1545102241-9465df33415f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        };

        setRental(mockRental);
        setEquipment(mockEquipment);
        setIsLoading(false);
      }, 1000);
    };

    loadMockData();
  }, [isConnected, rentalId, account]);

  // Fonction pour formater les dates
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Fonction pour formater le prix en ETH
  const formatPrice = (price: string) => {
    return `${price} ETH`;
  };

  // Fonction pour tronquer les adresses ETH
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Si l'utilisateur n'est pas connecté, demander la connexion
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold mb-6">Détails de la location</h1>
          <p className="text-lg text-gray-600 mb-8">
            Connectez votre portefeuille pour voir les détails de cette location.
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
      <div className="mb-6">
        <Link 
          href="/rentals" 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux locations
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">
        Détails de la location #{rentalId}
      </h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Erreur: {error}
        </div>
      ) : !rental ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600 mb-8">
            Cette location n'existe pas ou vous n'y avez pas accès.
          </p>
          <Link
            href="/rentals"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition inline-block"
          >
            Voir mes locations
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informations sur l'équipement */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Équipement</h2>
            {equipment && (
              <>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-4">
                  <img 
                    src={equipment.imageURI} 
                    alt={equipment.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">{equipment.name}</h3>
                <p className="text-gray-600">{equipment.description}</p>
                <Link
                  href={`/equipments/${equipment.id}`}
                  className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
                >
                  Voir l'équipement
                </Link>
              </>
            )}
          </div>
          
          {/* Détails de la location */}
          <div className="bg-white p-6 rounded-lg shadow-sm border md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Détails de la location</h2>
            
            <div className="flex justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
              
              <span className="text-gray-500 text-sm">
                Créée le {formatDate(rental.createdAt)}
              </span>
            </div>
            
            <div className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Période de location</p>
                  <p className="font-medium">
                    {formatDate(rental.startDate)} au {formatDate(rental.endDate)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Tarif journalier</p>
                  <p className="font-medium">
                    {formatPrice(rental.dailyRate)}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Montant total</p>
                  <p className="font-medium text-blue-600">
                    {formatPrice(rental.totalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Caution</p>
                  <p className="font-medium">
                    {formatPrice(rental.deposit)}
                    {rental.isDepositReturned && <span className="text-green-600 ml-2">(Remboursée)</span>}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Propriétaire</p>
                  <p className="font-medium">
                    {truncateAddress(rental.owner)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Locataire</p>
                  <p className="font-medium">
                    {truncateAddress(rental.renter)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t mt-6 pt-6">
              <div className="flex flex-wrap gap-3">
                {rental.isActive && !rental.isConfirmed && (
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition"
                  >
                    Annuler la location
                  </button>
                )}
                
                {rental.isActive && rental.isConfirmed && !rental.isReturned && (
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded transition"
                  >
                    Marquer comme retourné
                  </button>
                )}
                
                {rental.isActive && rental.isConfirmed && rental.isReturned && !rental.isDepositReturned && (
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition"
                  >
                    Récupérer ma caution
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 