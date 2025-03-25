"use client";

import { useState, useEffect } from 'react';
import { useContracts } from '@/lib/hooks/useContracts';
import Loader from '@/components/ui/Loader';
import EquipmentCard from '@/components/equipments/EquipmentCard';
import { Equipment } from '@/types';

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
          imageUrl: "/file.svg",
          dailyRate: "0.5",
          deposit: "1.0",
          isAvailable: true,
          owner: "0x1234567890123456789012345678901234567890",
          createdAt: Date.now() - 2592000000, // 30 jours avant
        },
        {
          id: 2,
          name: "Perforateur industriel",
          description: "Perforateur industriel puissant capable de percer du béton et de la pierre.",
          imageUrl: "/window.svg",
          dailyRate: "0.3",
          deposit: "0.6",
          isAvailable: true,
          owner: "0x1234567890123456789012345678901234567890",
          createdAt: Date.now() - 2592000000, // 30 jours avant
        },
        {
          id: 3,
          name: "Échafaudage modulaire",
          description: "Système d'échafaudage modulaire en aluminium, facile à monter et très stable.",
          imageUrl: "/globe.svg",
          dailyRate: "0.8",
          deposit: "1.5",
          isAvailable: false,
          owner: "0x9876543210987654321098765432109876543210",
          createdAt: Date.now() - 2592000000, // 30 jours avant
        }
      ];
      
      setEquipments(mockEquipments);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Équipements disponibles</h1>
      
      {isLoading ? (
        <div className="py-20">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipments.map((equipment) => (
            <EquipmentCard 
              key={equipment.id} 
              equipment={equipment} 
            />
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