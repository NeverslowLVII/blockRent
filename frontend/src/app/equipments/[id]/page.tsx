"use client";

import { useState, useEffect } from "react";
import { useContracts } from "@/lib/hooks/useContracts";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ethers } from "ethers";
import { Package } from "lucide-react";

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

const formatEtherSafe = (value: bigint | null | undefined): string => {
  if (value === null || value === undefined) {
    return "0.0";
  }
  return ethers.formatEther(value);
};

export default function EquipmentDetailsPage() {
  const { isConnected, connect, contracts, account } = useContracts();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const equipmentId = parseInt(params.id as string);

  useEffect(() => {
    const loadEquipmentDetails = async () => {
      if (!isConnected || !contracts.equipmentRegistry || !equipmentId || isNaN(equipmentId)) {
        setIsLoading(false);
        setError("ID d'équipement invalide ou non connecté");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const equipment = await contracts.equipmentRegistry.getEquipment(equipmentId);
        
        if (!equipment || equipment.isDeleted) {
          setError("Cet équipement n'existe plus.");
          return;
        }

        setEquipment({
          id: equipmentId,
          owner: equipment.owner,
          name: equipment.name,
          description: equipment.description,
          imageURI: equipment.imageURI,
          dailyRate: formatEtherSafe(equipment.dailyRate),
          isAvailable: equipment.isAvailable,
          createdAt: Number(equipment.createdAt) * 1000,
          updatedAt: Number(equipment.updatedAt) * 1000,
          isDeleted: equipment.isDeleted,
        });
      } catch (err) {
        console.error("Erreur lors du chargement des détails de l'équipement:", err);
        setError("Impossible de charger les détails de l'équipement.");
      } finally {
        setIsLoading(false);
      }
    };

    loadEquipmentDetails();
  }, [isConnected, contracts.equipmentRegistry, equipmentId]);

  if (!isConnected) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Détails de l&apos;équipement</h1>
          <Card>
            <CardContent className="text-center py-16">
              <p className="text-lg text-gray-600 mb-8">
                Connectez votre portefeuille pour voir les détails de l&apos;équipement.
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Détails de l&apos;équipement</h1>
          <Button variant="outline" asChild>
            <Link href="/equipments">
              Retour aux équipements
            </Link>
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
            {error}
          </div>
        ) : equipment ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Card className="overflow-hidden">
                <div className="relative aspect-square">
                  {equipment.imageURI ? (
                    <img
                      src={equipment.imageURI}
                      alt={equipment.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // En cas d'erreur de chargement de l'image, afficher l'icône par défaut
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`fallback-icon w-full h-full flex items-center justify-center bg-gray-100 ${equipment.imageURI ? 'hidden' : ''}`}>
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
              </Card>
            </div>
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">{equipment.name}</h2>
                  <p className="text-gray-600 mb-6">{equipment.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Tarif journalier</p>
                      <p className="text-lg font-semibold">{equipment.dailyRate} ETH</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Caution</p>
                      <p className="text-lg font-semibold">{Number(equipment.dailyRate) * 2} ETH</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Propriétaire</p>
                      <p className="font-mono text-sm break-all">{equipment.owner}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Disponibilité</p>
                      <p className={`font-semibold ${equipment.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {equipment.isAvailable ? 'Disponible' : 'Non disponible'}
                      </p>
                    </div>
                  </div>

                  {equipment.isAvailable && account?.toLowerCase() !== equipment.owner.toLowerCase() && (
                    <div className="mt-8">
                      <Button className="w-full" asChild>
                        <Link href={`/rentals/new?equipmentId=${equipment.id}`}>
                          Louer cet équipement
                        </Link>
                      </Button>
                    </div>
                  )}

                  {account?.toLowerCase() === equipment.owner.toLowerCase() && (
                    <div className="mt-8 space-y-4">
                      <Button className="w-full" variant="outline" asChild>
                        <Link href={`/equipments/${equipment.id}/edit`}>
                          Modifier l&apos;équipement
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
} 