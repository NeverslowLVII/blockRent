"use client";

import { useState, useEffect } from "react";
import { useContracts } from "@/lib/hooks/useContracts";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Rental, Equipment } from "@/types";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatPrice, formatDate, formatAddress } from "@/utils/formatters";

export default function RentalDetailsPage() {
  const { isConnected, connect } = useContracts();
  const [rental, setRental] = useState<Rental | null>(null);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isMarkingReturned, setIsMarkingReturned] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  
  const params = useParams();
  const router = useRouter();
  const rentalId = params.id as string;

  // Pour cette démonstration, nous utilisons des données fictives
  // Dans une implémentation réelle, vous récupéreriez les données depuis la blockchain
  useEffect(() => {
    const loadMockData = () => {
      setIsLoading(true);
      setTimeout(() => {
        // Données fictives pour la démonstration
        const mockRental: Rental = {
          id: parseInt(rentalId),
          equipmentId: 1,
          renter: "0x0000000000000000000000000000000000000001",
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

        const mockEquipment: Equipment = {
          id: 1,
          name: "Tronçonneuse professionnelle",
          description: "Tronçonneuse à essence de qualité professionnelle",
          imageUrl: "/file.svg",
          dailyRate: "0.5",
          deposit: "1.0",
          isAvailable: false,
          owner: "0x1234567890123456789012345678901234567890",
          createdAt: Date.now() - 2592000000, // 30 jours avant
        };

        setRental(mockRental);
        setEquipment(mockEquipment);
        setIsLoading(false);
      }, 1000);
    };

    loadMockData();
  }, [rentalId]);

  // Fonction pour obtenir le statut de la location
  const getRentalStatus = () => {
    if (!rental) return 'pending';
    if (rental.isCancelled) return 'cancelled';
    if (rental.isReturned) return 'returned';
    if (!rental.isActive) return 'completed';
    if (!rental.isConfirmed) return 'pending';
    return 'confirmed';
  };

  // Fonction pour annuler une location
  const cancelRental = async () => {
    try {
      setError(null);
      setIsCancelling(true);
      
      // Simuler l'appel au contrat
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simuler la réponse
      setRental(prev => {
        if (!prev) return null;
        return {
          ...prev,
          isActive: false,
          isCancelled: true,
          updatedAt: Date.now()
        };
      });
      
      setIsCancelling(false);
    } catch (err) {
      setError("Erreur lors de l'annulation de la location");
      setIsCancelling(false);
      console.error(err);
    }
  };

  // Fonction pour marquer comme retourné
  const markAsReturned = async () => {
    try {
      setError(null);
      setIsMarkingReturned(true);
      
      // Simuler l'appel au contrat
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simuler la réponse
      setRental(prev => {
        if (!prev) return null;
        return {
          ...prev,
          isActive: false,
          isReturned: true,
          updatedAt: Date.now()
        };
      });
      
      setIsMarkingReturned(false);
    } catch (err) {
      setError("Erreur lors du marquage comme retourné");
      setIsMarkingReturned(false);
      console.error(err);
    }
  };

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
      
      {isLoading ? (
        <div className="py-20">
          <Loader size="lg" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      ) : !rental || !equipment ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600 mb-8">
            Cette location n&apos;existe pas ou a été supprimée.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push("/rentals")}
          >
            Voir toutes mes locations
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  Location #{rental.id}
                  <StatusBadge status={getRentalStatus()} />
                </h1>
                <p className="text-gray-600">
                  Équipement: {equipment.name} (#{equipment.id})
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <span className="font-semibold text-blue-600 block text-right">
                  {formatPrice(rental.totalAmount)}
                </span>
                <span className="text-gray-500 text-sm block text-right">
                  + {formatPrice(rental.deposit)} (caution)
                </span>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {rental.isActive && !rental.isConfirmed && (
                <Button
                  variant="danger"
                  onClick={cancelRental}
                  isLoading={isCancelling}
                  disabled={isCancelling}
                >
                  Annuler la location
                </Button>
              )}
              
              {rental.isActive && rental.isConfirmed && !rental.isReturned && (
                <Button
                  variant="warning"
                  onClick={markAsReturned}
                  isLoading={isMarkingReturned}
                  disabled={isMarkingReturned}
                >
                  Marquer comme retourné
                </Button>
              )}
              
              <Button
                variant="secondary"
                onClick={() => router.push(`/equipments/${equipment.id}`)}
              >
                Voir l&apos;équipement
              </Button>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-4 px-6 font-medium text-sm ${
                    activeTab === 'details'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Détails de la location
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-4 px-6 font-medium text-sm ${
                    activeTab === 'history'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Historique des actions
                </button>
              </nav>
            </div>
          </div>
          
          {activeTab === 'details' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Informations de location</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Période de location</h3>
                    <p className="mt-1 text-base">
                      Du {formatDate(rental.startDate)} au {formatDate(rental.endDate)}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Durée</h3>
                    <p className="mt-1 text-base">
                      {Math.ceil((rental.endDate - rental.startDate) / (1000 * 60 * 60 * 24))} jours
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tarif journalier</h3>
                    <p className="mt-1 text-base">{formatPrice(rental.dailyRate)}</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Total de la location</span>
                      <span>{formatPrice(rental.totalAmount)}</span>
                    </div>
                    
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Caution (remboursable)</span>
                      <span>{formatPrice(rental.deposit)}</span>
                    </div>
                    
                    <div className="flex justify-between pt-2 mt-2 border-t">
                      <span className="font-bold">Total payé</span>
                      <span className="font-bold text-blue-600">
                        {formatPrice((parseFloat(rental.totalAmount) + parseFloat(rental.deposit)).toString())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Participants</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Locataire</h3>
                    <p className="mt-1 text-base flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {formatAddress(rental.renter)}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Propriétaire</h3>
                    <p className="mt-1 text-base flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {formatAddress(rental.owner)}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-500">Date de création</h3>
                    <p className="mt-1 text-base">{formatDate(rental.createdAt)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Dernière mise à jour</h3>
                    <p className="mt-1 text-base">{formatDate(rental.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Historique des actions</h2>
              
              <div className="border-l-2 border-gray-200 pl-4 space-y-6">
                <div className="relative">
                  <div className="absolute -left-6 mt-1.5 w-4 h-4 rounded-full bg-blue-500"></div>
                  <p className="text-sm text-gray-500">{formatDate(rental.createdAt)}</p>
                  <p className="font-medium">Location créée</p>
                  <p className="text-gray-600">La location a été créée par {formatAddress(rental.renter)}</p>
                </div>
                
                {rental.isConfirmed && (
                  <div className="relative">
                    <div className="absolute -left-6 mt-1.5 w-4 h-4 rounded-full bg-green-500"></div>
                    <p className="text-sm text-gray-500">{formatDate(rental.createdAt + 3600000)}</p>
                    <p className="font-medium">Location confirmée</p>
                    <p className="text-gray-600">La location a été confirmée par {formatAddress(rental.owner)}</p>
                  </div>
                )}
                
                {rental.isCancelled && (
                  <div className="relative">
                    <div className="absolute -left-6 mt-1.5 w-4 h-4 rounded-full bg-red-500"></div>
                    <p className="text-sm text-gray-500">{formatDate(rental.updatedAt)}</p>
                    <p className="font-medium">Location annulée</p>
                    <p className="text-gray-600">La location a été annulée par {formatAddress(rental.renter)}</p>
                  </div>
                )}
                
                {rental.isReturned && (
                  <div className="relative">
                    <div className="absolute -left-6 mt-1.5 w-4 h-4 rounded-full bg-purple-500"></div>
                    <p className="text-sm text-gray-500">{formatDate(rental.updatedAt)}</p>
                    <p className="font-medium">Équipement retourné</p>
                    <p className="text-gray-600">L'équipement a été marqué comme retourné par {formatAddress(rental.renter)}</p>
                  </div>
                )}
                
                {rental.isDepositReturned && (
                  <div className="relative">
                    <div className="absolute -left-6 mt-1.5 w-4 h-4 rounded-full bg-yellow-500"></div>
                    <p className="text-sm text-gray-500">{formatDate(rental.updatedAt + 3600000)}</p>
                    <p className="font-medium">Caution remboursée</p>
                    <p className="text-gray-600">La caution a été remboursée à {formatAddress(rental.renter)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 