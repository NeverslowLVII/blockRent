"use client";

import { useState, useEffect } from "react";
import { useContracts } from "@/lib/hooks/useContracts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import Link from "next/link";
import { ethers } from "ethers";
import { Package, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Equipment {
  id: number;
  name: string;
  description: string;
  imageURI: string;
  dailyRate: bigint;
  isAvailable: boolean;
  owner: string;
}

const formatEtherSafe = (value: bigint | null | undefined): string => {
  if (value === null || value === undefined) {
    return "0.0";
  }
  return ethers.formatEther(value);
};

export default function EquipmentsPage() {
  const { isConnected, connect, contracts, account } = useContracts();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadEquipments = async () => {
      if (!isConnected || !contracts.equipmentRegistry) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const equipmentsList: Equipment[] = [];
        let currentId = 1;

        while (true) {
          try {
            const equipment = await contracts.equipmentRegistry.getEquipment(currentId);
            if (equipment && typeof equipment === 'object') {
              equipmentsList.push({
                id: currentId,
                name: equipment.name || '',
                description: equipment.description || '',
                imageURI: equipment.imageURI || '',
                dailyRate: equipment.dailyRate || BigInt(0),
                isAvailable: equipment.isAvailable || false,
                owner: equipment.owner || ''
              });
            }
            currentId++;
          } catch (err) {
            break;
          }
        }

        setEquipments(equipmentsList);
      } catch (err) {
        console.error("Erreur lors du chargement des équipements:", err);
        setError("Impossible de charger les équipements.");
      } finally {
        setIsLoading(false);
      }
    };

    loadEquipments();
  }, [isConnected, contracts.equipmentRegistry]);

  const filteredEquipments = activeTab === "mine" && account
    ? equipments.filter(eq => {
        if (!eq || !eq.owner || !account) return false;
        try {
          return eq.owner.toLowerCase() === account.toLowerCase();
        } catch (err) {
          console.error("Erreur lors du filtrage de l'équipement:", err);
          return false;
        }
      })
    : equipments;

  if (!isConnected) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Équipements</h1>
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Équipements</h1>
          <Button asChild>
            <Link href="/equipments/new">
              Ajouter un équipement
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Tous les équipements
            </TabsTrigger>
            <TabsTrigger value="mine" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Mes équipements
            </TabsTrigger>
          </TabsList>
        </Tabs>

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
        ) : filteredEquipments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <p className="text-lg text-gray-600 mb-8">
                {activeTab === "mine" 
                  ? "Vous n'avez pas encore d'équipement."
                  : "Aucun équipement n'est disponible pour le moment."}
              </p>
              <Button asChild>
                <Link href="/equipments/new">
                  Ajouter mon premier équipement
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipments.map((equipment) => (
              <Card key={equipment.id}>
                <CardContent className="p-6">
                  <div className="aspect-video relative mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    {equipment.imageURI ? (
                      <img
                        src={equipment.imageURI}
                        alt={equipment.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{equipment.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{equipment.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Prix par jour</p>
                      <p className="text-lg font-semibold">{formatEtherSafe(equipment.dailyRate)} ETH</p>
                    </div>
                    <Button asChild variant="outline">
                      <Link href={`/equipments/${equipment.id}`}>
                        Voir les détails
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 