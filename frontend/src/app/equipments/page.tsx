"use client";

import { useState, useEffect } from 'react';
import { useContracts } from '@/lib/hooks/useContracts';
import Link from 'next/link';
import Image from 'next/image';

interface Equipment {
  id: number;
  name: string;
  description: string;
  imageURI: string;
  dailyRate: string;
  isAvailable: boolean;
  owner: string;
}

export default function EquipmentsPage() {
  const { isConnected, connect } = useContracts();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pour cette démonstration, nous utilisons des données d'équipement fictives
  // Dans une implémentation réelle, vous récupéreriez les données depuis la blockchain
  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      const mockEquipments = [
        {
          id: 1,
          name: "Tronçonneuse professionnelle",
          description: "Tronçonneuse à essence de qualité professionnelle, idéale pour les gros travaux forestiers.",
          imageURI: "https://images.unsplash.com/photo-1545102241-9465df33415f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          dailyRate: "0.5",
          isAvailable: true,
          owner: "0x1234567890123456789012345678901234567890"
        },
        {
          id: 2,
          name: "Perforateur industriel",
          description: "Perforateur industriel puissant capable de percer du béton et de la pierre.",
          imageURI: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          dailyRate: "0.3",
          isAvailable: true,
          owner: "0x1234567890123456789012345678901234567890"
        },
        {
          id: 3,
          name: "Échafaudage modulaire",
          description: "Système d'échafaudage modulaire en aluminium, facile à monter et très stable.",
          imageURI: "https://images.unsplash.com/photo-1578835187997-017d9952f020?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          dailyRate: "0.8",
          isAvailable: false,
          owner: "0x9876543210987654321098765432109876543210"
        }
      ];
      
      setEquipments(mockEquipments);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Fonction pour formater le prix en ETH
  const formatPrice = (price: string) => {
    return `${price} ETH`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Équipements disponibles</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipments.map((equipment) => (
            <div 
              key={equipment.id}
              className="border rounded-lg overflow-hidden bg-white shadow-sm transform transition duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden bg-gray-100 relative">
                <Image 
                  src={equipment.imageURI} 
                  alt={equipment.name} 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold">{equipment.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    equipment.isAvailable 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {equipment.isAvailable ? "Disponible" : "Non disponible"}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{equipment.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-blue-600">
                    {formatPrice(equipment.dailyRate)} / jour
                  </span>
                  
                  <Link 
                    href={`/equipments/${equipment.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                  >
                    Voir détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!isConnected && (
        <div className="bg-gray-50 p-6 rounded-lg mt-8 text-center">
          <p className="text-lg text-gray-700 mb-4">
            Connectez votre portefeuille pour réserver ces équipements
          </p>
          <button
            onClick={connect}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition"
          >
            Connecter mon portefeuille
          </button>
        </div>
      )}
    </div>
  );
} 