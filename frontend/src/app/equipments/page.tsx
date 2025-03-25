"use client";

import { useState, useEffect } from "react";
import { useContracts } from "@/lib/hooks/useContracts";
import EquipmentCard from "@/components/equipments/EquipmentCard";
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Equipment } from "@/types";

export default function EquipmentsPage() {
  const { isConnected, connect } = useContracts();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  // Pour cette démonstration, nous utilisons des équipements fictifs
  // Dans une implémentation réelle, vous récupéreriez les données depuis la blockchain
  useEffect(() => {
    // Simuler le chargement des données
    const loadMockData = () => {
      setIsLoading(true);
      setTimeout(() => {
        // Données fictives pour la démonstration
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
    };

    loadMockData();
  }, []);

  // Si l'utilisateur n'est pas connecté, demander la connexion
  if (!isConnected) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Équipements disponibles</h1>
          <Card>
            <CardContent className="text-center py-16">
              <p className="text-lg text-gray-600 mb-8">
                Connectez votre portefeuille pour voir les équipements disponibles.
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-0">Équipements disponibles</h1>
          <Button>
            Ajouter un équipement
          </Button>
        </div>
        
        {isLoading ? (
          <Card>
            <CardContent className="flex justify-center items-center py-20">
              <Loader size="lg" />
            </CardContent>
          </Card>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            Erreur: {error}
          </div>
        ) : equipments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <p className="text-lg text-gray-600 mb-4">
                Aucun équipement n&apos;est disponible pour le moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipments.map((equipment) => (
              <EquipmentCard key={equipment.id} equipment={equipment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 