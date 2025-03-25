"use client";

import { useState, useEffect } from "react";
import { useContracts } from "@/lib/hooks/useContracts";
import Link from "next/link";

interface Equipment {
  id: number;
  owner: string;
  name: string;
  description: string;
  imageURI: string;
  dailyRate: string;
  isAvailable: boolean;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

export default function EquipmentsPage() {
  const { contracts, isConnected, connect } = useContracts();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pour cette démonstration, nous utilisons des équipements fictifs
  // Dans une implémentation réelle, vous récupéreriez les données depuis la blockchain
  useEffect(() => {
    // Simuler le chargement des données
    const loadMockData = () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockEquipments = [
          {
            id: 1,
            owner: "0x1234567890123456789012345678901234567890",
            name: "Excavatrice JCB",
            description: "Excavatrice professionnelle pour travaux de construction",
            imageURI: "https://example.com/excavator.jpg",
            dailyRate: "0.5",
            isAvailable: true,
            createdAt: Date.now() - 1000000,
            updatedAt: Date.now() - 500000,
            isDeleted: false,
          },
          {
            id: 2,
            owner: "0x1234567890123456789012345678901234567890",
            name: "Tractopelle CAT",
            description: "Tractopelle robuste pour chantiers",
            imageURI: "https://example.com/backhoe.jpg",
            dailyRate: "0.7",
            isAvailable: true,
            createdAt: Date.now() - 900000,
            updatedAt: Date.now() - 400000,
            isDeleted: false,
          },
          {
            id: 3,
            owner: "0x9876543210987654321098765432109876543210",
            name: "Bétonnière",
            description: "Bétonnière électrique 250L",
            imageURI: "https://example.com/mixer.jpg",
            dailyRate: "0.2",
            isAvailable: true,
            createdAt: Date.now() - 800000,
            updatedAt: Date.now() - 300000,
            isDeleted: false,
          },
          {
            id: 4,
            owner: "0x9876543210987654321098765432109876543210",
            name: "Échafaudage",
            description: "Échafaudage 10m",
            imageURI: "https://example.com/scaffold.jpg",
            dailyRate: "0.3",
            isAvailable: false,
            createdAt: Date.now() - 700000,
            updatedAt: Date.now() - 200000,
            isDeleted: false,
          },
        ];
        setEquipments(mockEquipments);
        setIsLoading(false);
      }, 1000);
    };

    loadMockData();
  }, []);

  // Fonction pour formater le prix en ETH
  const formatPrice = (price: string) => {
    return `${price} ETH / jour`;
  };

  // Si l'utilisateur n'est pas connecté, demander la connexion
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold mb-6">Équipements disponibles</h1>
          <p className="text-lg text-gray-600 mb-8">
            Connectez votre portefeuille pour voir les équipements disponibles.
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
      <h1 className="text-3xl font-bold mb-6">Équipements disponibles</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Erreur: {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipments.map((equipment) => (
            <div 
              key={equipment.id}
              className={`border rounded-lg overflow-hidden ${
                equipment.isAvailable ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div className="h-48 bg-gray-200 relative">
                {/* Placeholder pour l'image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-500">[Image de l'équipement]</span>
                </div>
                
                {/* Indicateur de disponibilité */}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                  equipment.isAvailable 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {equipment.isAvailable ? "Disponible" : "Indisponible"}
                </div>
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{equipment.name}</h2>
                <p className="text-gray-600 mb-4">{equipment.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-blue-600">{formatPrice(equipment.dailyRate)}</span>
                </div>
                
                <Link
                  href={`/equipments/${equipment.id}`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
                >
                  Voir les détails
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 