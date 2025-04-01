"use client";

import { useState, useEffect } from "react";
import { useContracts } from "@/lib/hooks/useContracts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { RentalStatus } from "@/types";
import Link from "next/link";
import { ethers } from "ethers";
import { ArrowRight, Package, Calendar, Wallet, AlertTriangle } from "lucide-react";

interface Equipment {
  id: number;
  name: string;
  description: string;
  imageURI: string;
  dailyRate: bigint;
  isAvailable: boolean;
  owner: string;
}

interface Rental {
  id: number;
  equipmentId: number;
  renter: string;
  startDate: Date;
  endDate: Date;
  totalPrice: bigint;
  status: RentalStatus;
  equipmentName?: string;
}

const formatEtherSafe = (value: bigint | null | undefined): string => {
  if (value === null || value === undefined) {
    return "0.0";
  }
  return ethers.formatEther(value);
};

export default function DashboardPage() {
  const { isConnected, connect, contracts, account } = useContracts();
  const [stats, setStats] = useState({
    totalEquipments: 0,
    totalRentals: 0,
    activeRentals: 0,
    totalEarnings: BigInt(0),
    pendingEarnings: BigInt(0),
  });
  const [recentEquipments, setRecentEquipments] = useState<Equipment[]>([]);
  const [activeRentalsList, setActiveRentalsList] = useState<Rental[]>([]);
  const [pendingRentalsList, setPendingRentalsList] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isConnected || !contracts.equipmentRegistry || !contracts.rentalManager || !account) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const userEquipments: Equipment[] = [];
        const userRentals: Rental[] = [];
        const activeRentals: Rental[] = [];
        const pendingRentals: Rental[] = [];
        let totalEarnings = BigInt(0);
        let pendingEarnings = BigInt(0);

        // Charger les équipements
        let currentId = 1;
        while (true) {
          try {
            const equipment = await contracts.equipmentRegistry.getEquipment(currentId);
            if (equipment.owner.toLowerCase() === account.toLowerCase()) {
              userEquipments.push({
                id: currentId,
                ...equipment,
              });
            }
            currentId++;
          } catch (err) {
            break;
          }
        }

        // Charger les locations
        currentId = 1;
        while (true) {
          try {
            const rental = await contracts.rentalManager.getRental(currentId);
            const equipment = await contracts.equipmentRegistry.getEquipment(rental.equipmentId);

            const rentalWithDetails = {
              id: currentId,
              ...rental,
              startDate: new Date(Number(rental.startDate) * 1000),
              endDate: new Date(Number(rental.endDate) * 1000),
              equipmentName: equipment.name,
            };

            if (equipment.owner.toLowerCase() === account.toLowerCase()) {
              userRentals.push(rentalWithDetails);

              if (rental.status === RentalStatus.CONFIRMED) {
                activeRentals.push(rentalWithDetails);
                pendingEarnings = pendingEarnings + rental.totalPrice;
              } else if (rental.status === RentalStatus.COMPLETED) {
                totalEarnings = totalEarnings + rental.totalPrice;
              }
            }

            if (rental.status === RentalStatus.PENDING &&
              equipment.owner.toLowerCase() === account.toLowerCase()) {
              pendingRentals.push(rentalWithDetails);
            }

            currentId++;
          } catch (err) {
            break;
          }
        }

        setStats({
          totalEquipments: userEquipments.length,
          totalRentals: userRentals.length,
          activeRentals: activeRentals.length,
          totalEarnings,
          pendingEarnings,
        });

        setRecentEquipments(userEquipments.slice(-3).reverse());
        setActiveRentalsList(activeRentals);
        setPendingRentalsList(pendingRentals);

      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger les données du tableau de bord.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [isConnected, account, contracts.equipmentRegistry, contracts.rentalManager]);

  if (!isConnected) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
          <Card>
            <CardContent className="text-center py-16">
              <p className="text-lg text-gray-600 mb-8">
                Connectez votre portefeuille pour accéder à votre tableau de bord.
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
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <Button asChild>
            <Link href="/equipments/new">
              Ajouter un équipement
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
        ) : (
          <div className="space-y-8">
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-8">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="h-5 w-5 text-primary" />
                    <span className="text-xs text-gray-500">Total</span>
                  </div>
                  <h2 className="text-2xl font-bold">{stats.totalEquipments}</h2>
                  <p className="text-sm text-gray-600">Équipements publiés</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-8">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-xs text-gray-500">En cours</span>
                  </div>
                  <h2 className="text-2xl font-bold">{stats.activeRentals}</h2>
                  <p className="text-sm text-gray-600">Locations actives</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-8">
                  <div className="flex items-center justify-between mb-2">
                    <Wallet className="h-5 w-5 text-green-500" />
                    <span className="text-xs text-gray-500">Total</span>
                  </div>
                  <h2 className="text-2xl font-bold">
                    {formatEtherSafe(stats.totalEarnings)} ETH
                  </h2>
                  <p className="text-sm text-gray-600">Revenus totaux</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-8">
                  <div className="flex items-center justify-between mb-2">
                    <Wallet className="h-5 w-5 text-yellow-500" />
                    <span className="text-xs text-gray-500">En attente</span>
                  </div>
                  <h2 className="text-2xl font-bold">
                    {formatEtherSafe(stats.pendingEarnings)} ETH
                  </h2>
                  <p className="text-sm text-gray-600">Revenus en attente</p>
                </CardContent>
              </Card>
            </div>

            {/* Demandes en attente */}
            {pendingRentalsList.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Demandes de location en attente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingRentalsList.map((rental) => (
                      <div key={rental.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-medium">{rental.equipmentName}</h3>
                          <p className="text-sm text-gray-600">
                            Du {rental.startDate.toLocaleDateString()} au {rental.endDate.toLocaleDateString()}
                          </p>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/rentals/${rental.id}`}>
                            Voir les détails
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Équipements récents */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Derniers équipements</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/equipments" className="flex items-center gap-2">
                        Voir tout <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentEquipments.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                      Vous n&apos;avez pas encore d&apos;équipement.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {recentEquipments.map((equipment) => (
                        <div key={equipment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h3 className="font-medium">{equipment.name}</h3>
                            <p className="text-sm text-gray-600">
                              {formatEtherSafe(equipment.dailyRate)} ETH/jour
                            </p>
                          </div>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/equipments/${equipment.id}`}>
                              Voir
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Locations actives */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Locations en cours</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/rentals" className="flex items-center gap-2">
                        Voir tout <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {activeRentalsList.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                      Aucune location en cours.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {activeRentalsList.map((rental) => (
                        <div key={rental.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h3 className="font-medium">{rental.equipmentName}</h3>
                            <p className="text-sm text-gray-600">
                              Jusqu&apos;au {rental.endDate.toLocaleDateString()}
                            </p>
                          </div>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/rentals/${rental.id}`}>
                              Gérer
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}