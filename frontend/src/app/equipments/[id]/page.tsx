"use client";

import { useState, useEffect } from "react";
import { useContracts } from "@/lib/hooks/useContracts";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface Equipment {
  id: number;
  owner: string;
  name: string;
  description: string;
  imageURI: string;
  dailyRate: string;
  isAvailable: boolean;
  createdAt: number;
}

export default function EquipmentDetailsPage() {
  const { isConnected, connect } = useContracts();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const params = useParams();
  const router = useRouter();
  const equipmentId = params.id as string;

  // Pour cette démonstration, nous utilisons des données fictives
  // Dans une implémentation réelle, vous récupéreriez les données depuis la blockchain
  useEffect(() => {
    // Simuler le chargement des données
    const loadMockData = () => {
      setIsLoading(true);
      setTimeout(() => {
        // Données fictives pour la démonstration
        const mockEquipment = {
          id: parseInt(equipmentId),
          owner: "0x1234567890123456789012345678901234567890",
          name: "Tronçonneuse professionnelle",
          description: "Tronçonneuse à essence de qualité professionnelle, idéale pour les gros travaux forestiers. Puissance de 4,8 kW, longueur de guide de 50 cm. Livrée avec une chaîne de rechange et un bidon d'huile.",
          imageURI: "https://images.unsplash.com/photo-1545102241-9465df33415f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          dailyRate: "0.5",
          isAvailable: true,
          createdAt: Date.now() - 2592000000, // 30 jours avant
        };

        setEquipment(mockEquipment);
        setIsLoading(false);
      }, 1000);
    };

    loadMockData();
  }, [equipmentId]);

  // Fonction pour vérifier la disponibilité
  const checkAvailability = () => {
    if (!startDate || !endDate) {
      setError("Veuillez sélectionner une date de début et de fin");
      return;
    }

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (start >= end) {
      setError("La date de fin doit être postérieure à la date de début");
      return;
    }

    // Simuler la vérification de disponibilité
    setIsCheckingAvailability(true);
    setError(null);
    setTimeout(() => {
      // Pour la démonstration, on suppose que l'équipement est disponible si les dates sont dans le futur
      const isAvail = start > Date.now();
      setIsAvailable(isAvail);
      setIsCheckingAvailability(false);
    }, 1000);
  };

  // Fonction pour créer une réservation
  const createRental = () => {
    if (!isConnected) {
      connect();
      return;
    }

    if (!startDate || !endDate) {
      setError("Veuillez sélectionner une date de début et de fin");
      return;
    }

    if (isAvailable === false) {
      setError("Cet équipement n'est pas disponible pour les dates sélectionnées");
      return;
    }

    // Dans une application réelle, vous appelleriez le contrat ici
    // et redirigeriez l'utilisateur vers la page de confirmation

    // Pour la démonstration, on redirige simplement vers la page des locations
    router.push("/rentals");
  };

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

  // Fonction pour obtenir la date minimale (aujourd'hui au format YYYY-MM-DD)
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/equipments" 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux équipements
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error && !isAvailable ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      ) : !equipment ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600 mb-8">
            Cet équipement n&apos;existe pas ou a été supprimé.
          </p>
          <Link
            href="/equipments"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition inline-block"
          >
            Voir tous les équipements
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image et informations de base */}
          <div>
            <div className="rounded-lg overflow-hidden bg-gray-100 aspect-video mb-6 relative h-[300px]">
              <Image 
                src={equipment.imageURI} 
                alt={equipment.name} 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h1 className="text-2xl font-bold mb-2">{equipment.name}</h1>
              
              <div className="flex items-center justify-between mt-2 mb-4">
                <span className="text-xl font-semibold text-blue-600">
                  {formatPrice(equipment.dailyRate)} / jour
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  equipment.isAvailable 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {equipment.isAvailable ? "Disponible" : "Non disponible"}
                </span>
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                {equipment.description}
              </p>
              
              <div className="border-t pt-4 mt-4">
                <p className="text-gray-600 text-sm">
                  Propriétaire: {truncateAddress(equipment.owner)}
                </p>
                <p className="text-gray-600 text-sm">
                  Disponible depuis: {formatDate(equipment.createdAt)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Formulaire de réservation */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Réserver cet équipement</h2>
            
            {!isConnected && (
              <div className="mb-6">
                <p className="text-yellow-600 bg-yellow-50 p-4 rounded-lg">
                  Connectez votre portefeuille pour réserver cet équipement
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="startDate" className="block text-gray-700 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  id="startDate"
                  min={getMinDate()}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-gray-700 mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  id="endDate"
                  min={startDate || getMinDate()}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {startDate && endDate && (
                <div>
                  <button
                    onClick={checkAvailability}
                    disabled={isCheckingAvailability}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-2"
                  >
                    {isCheckingAvailability ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                        Vérification...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        Vérifier la disponibilité
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {isAvailable === true && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg">
                  Cet équipement est disponible pour les dates sélectionnées !
                </div>
              )}
              
              {isAvailable === false && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                  Cet équipement n&apos;est pas disponible pour les dates sélectionnées.
                </div>
              )}
              
              {startDate && endDate && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span>Tarif journalier</span>
                    <span>{formatPrice(equipment.dailyRate)}</span>
                  </div>
                  
                  <div className="flex justify-between mb-2">
                    <span>Nombre de jours</span>
                    <span>
                      {startDate && endDate 
                        ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
                        : 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between mb-2">
                    <span>Caution (remboursable)</span>
                    <span>{formatPrice(equipment.dailyRate)}</span>
                  </div>
                  
                  <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                    <span>Total à payer</span>
                    <span className="text-blue-600">
                      {startDate && endDate
                        ? formatPrice(
                            (
                              parseFloat(equipment.dailyRate) * 
                              Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) +
                              parseFloat(equipment.dailyRate)
                            ).toString()
                          )
                        : formatPrice("0")}
                    </span>
                  </div>
                </div>
              )}
              
              <button
                onClick={createRental}
                disabled={!startDate || !endDate || isAvailable === false}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition mt-4 ${
                  (!startDate || !endDate || isAvailable === false)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isConnected ? "Réserver maintenant" : "Connecter le portefeuille"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 