"use client";

import { useState, useEffect, useCallback } from "react";
import { useContracts } from "@/lib/hooks/useContracts";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardTitle, CardHeader, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, HomeIcon, Package, Calendar, DollarSign, Clock, Filter } from "lucide-react";
import Link from "next/link";
import { ethers } from "ethers";
import { formatEtherSafe } from "@/lib/utils";

// Types
interface Equipment {
  id: number;
  name: string;
  description: string;
  imageURI: string;
  dailyRate: bigint;
  isAvailable: boolean;
  owner: string;
}

enum RentalStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
  COMPLETED = "COMPLETED"
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

// Interface pour les données de location brutes
interface RentalData {
  id: number;
  equipmentId: number;
  renter: string;
  startDate: number;
  endDate: number;
  totalAmount: bigint;
  isActive: boolean;
  isReturned: boolean;
  isCancelled: boolean;
  isDepositReturned: boolean;
}

export default function DashboardPage() {
  const { isConnected, connect, contracts, account } = useContracts();
  const [myEquipments, setMyEquipments] = useState<Equipment[]>([]);
  const [myRentals, setMyRentals] = useState<Rental[]>([]);
  const [loadingEquipments, setLoadingEquipments] = useState(true);
  const [loadingRentals, setLoadingRentals] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRentalFilter, setActiveRentalFilter] = useState<string>("all");

  // Statistiques
  const [stats, setStats] = useState({
    totalEquipments: 0,
    activeRentals: 0,
    totalEarnings: BigInt(0),
    pendingReturns: 0
  });

  const loadMyEquipments = async () => {
    if (!account || !contracts.equipmentRegistry) {
      setLoadingEquipments(false);
      return;
    }
    
    try {
      // Charger les équipements
      const equipmentsList: Equipment[] = [];
      let currentId = 1;

      while (true) {
        try {
          const equipment = await contracts.equipmentRegistry.getEquipment(currentId);
          if (equipment && equipment.owner.toLowerCase() === account.toLowerCase() && !equipment.isDeleted) {
            equipmentsList.push({
              id: currentId,
              name: equipment.name,
              description: equipment.description,
              imageURI: equipment.imageURI,
              dailyRate: equipment.dailyRate,
              isAvailable: equipment.isAvailable,
              owner: equipment.owner
            });
          }
          currentId++;
        } catch (error) {
          // Fin des équipements disponibles ou erreur de lecture
          console.log("Fin de la lecture des équipements ou erreur:", error instanceof Error ? error.message : "Erreur inconnue");
          break;
        }
      }

      setMyEquipments(equipmentsList);
    } catch (error) {
      console.error("Erreur lors du chargement des équipements:", error instanceof Error ? error.message : "Erreur inconnue");
      setError("Impossible de charger vos équipements.");
    }
  };

  const loadMyRentals = async () => {
    if (!account || !contracts.rentalManager || !contracts.equipmentRegistry) {
      setLoadingRentals(false);
      return;
    }
    
    try {
      // Obtenir les locations où l'utilisateur est le locataire
      const rentalsList: Rental[] = [];
      
      // 1. Obtenir les ID des locations
      const renterRentals = await contracts.rentalManager.getRenterRentals(account);
      const rentalIds = renterRentals.map((id: ethers.BigNumberish) => Number(id));
      
      // 2. Charger les détails de chaque location
      for (const id of rentalIds) {
        const rentalData = await contracts.rentalManager.getRental(id);
        
        // 3. Obtenir le nom de l'équipement pour chaque location
        const equipment = await contracts.equipmentRegistry.getEquipment(rentalData.equipmentId);
        
        rentalsList.push({
          id: Number(rentalData.id),
          equipmentId: Number(rentalData.equipmentId),
          renter: rentalData.renter,
          startDate: new Date(Number(rentalData.startDate) * 1000),
          endDate: new Date(Number(rentalData.endDate) * 1000),
          totalPrice: rentalData.totalAmount,
          status: determineRentalStatus(rentalData),
          equipmentName: equipment.name
        });
      }
      
      setMyRentals(rentalsList);
    } catch (err) {
      console.error("Erreur lors du chargement des locations:", err);
      setError("Impossible de charger vos locations.");
    }
  };

  const determineRentalStatus = (rentalData: RentalData): RentalStatus => {
    if (rentalData.isCancelled) return RentalStatus.CANCELLED;
    if (rentalData.isReturned && rentalData.isDepositReturned) return RentalStatus.COMPLETED;
    if (rentalData.isReturned) return RentalStatus.RETURNED;
    if (rentalData.isActive) return RentalStatus.CONFIRMED;
    return RentalStatus.PENDING;
  };

  const calculateStats = () => {
    // Calculer les statistiques à partir des données chargées
    const activeRentals = myRentals.filter(r => 
      r.status === RentalStatus.CONFIRMED || r.status === RentalStatus.PENDING
    ).length;
    
    const pendingReturns = myRentals.filter(r => 
      r.status === RentalStatus.CONFIRMED && new Date() > r.endDate
    ).length;
    
    let totalEarnings = BigInt(0);
    myRentals.forEach(rental => {
      if (rental.status === RentalStatus.COMPLETED || rental.status === RentalStatus.RETURNED) {
        totalEarnings += rental.totalPrice;
      }
    });
    
    setStats({
      totalEquipments: myEquipments.length,
      activeRentals,
      totalEarnings,
      pendingReturns
    });
  };

  const loadDashboardData = useCallback(async () => {
    try {
      setError(null);
      setLoadingEquipments(true);
      setLoadingRentals(true);

      // Charger les équipements et locations en parallèle
      await Promise.all([
        loadMyEquipments(),
        loadMyRentals()
      ]);

      // Calculer les statistiques
      calculateStats();
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error instanceof Error ? error.message : "Erreur inconnue");
      setError("Une erreur est survenue lors du chargement des données.");
    } finally {
      setLoadingEquipments(false);
      setLoadingRentals(false);
    }
  }, [loadMyEquipments, loadMyRentals, calculateStats]);

  // Utilisation d'ESLint disable pour ce hook spécifique car la fonction est déclarée dans le composant
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isConnected && contracts.equipmentRegistry && contracts.rentalManager) {
      loadDashboardData();
    } else {
      setLoadingEquipments(false);
      setLoadingRentals(false);
    }
  }, [isConnected, contracts.equipmentRegistry, contracts.rentalManager, account]);

  const getFilteredRentals = () => {
    if (activeRentalFilter === "all") return myRentals;
    
    return myRentals.filter(rental => {
      switch (activeRentalFilter) {
        case "active":
          return rental.status === RentalStatus.CONFIRMED || rental.status === RentalStatus.PENDING;
        case "completed":
          return rental.status === RentalStatus.COMPLETED || rental.status === RentalStatus.RETURNED;
        case "cancelled":
          return rental.status === RentalStatus.CANCELLED;
        default:
          return true;
      }
    });
  };

  if (!isConnected) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 space-y-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <HomeIcon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold">Connectez-vous pour accéder à votre tableau de bord</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Vous pourrez consulter vos équipements, vos locations et gérer vos transactions.
                  </p>
                </div>
                <Button size="lg" onClick={connect}>
                  Connecter mon portefeuille
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
                <div className="mt-2">
                  <Button variant="outline" size="sm" onClick={loadDashboardData}>
                    Réessayer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section des statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Mes équipements</p>
                  {loadingEquipments ? (
                    <Skeleton className="h-8 w-12 mt-1" />
                  ) : (
                    <h3 className="text-2xl font-bold">{stats.totalEquipments}</h3>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Locations actives</p>
                  {loadingRentals ? (
                    <Skeleton className="h-8 w-12 mt-1" />
                  ) : (
                    <h3 className="text-2xl font-bold">{stats.activeRentals}</h3>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Total des revenus</p>
                  {loadingRentals ? (
                    <Skeleton className="h-8 w-24 mt-1" />
                  ) : (
                    <h3 className="text-2xl font-bold">{formatEtherSafe(stats.totalEarnings)} ETH</h3>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-amber-600 bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-amber-600 font-medium">Retours en attente</p>
                  {loadingRentals ? (
                    <Skeleton className="h-8 w-12 mt-1" />
                  ) : (
                    <h3 className="text-2xl font-bold">{stats.pendingReturns}</h3>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section principale avec équipements et locations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mes équipements */}
          <div>
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Mes équipements</CardTitle>
                  <CardDescription>
                    Les équipements que vous proposez à la location
                  </CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/equipments">
                    Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {loadingEquipments ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-md" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : myEquipments.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">Vous n&apos;avez aucun équipement enregistré</p>
                    <Button asChild variant="secondary">
                      <Link href="/equipments/new">
                        Ajouter un équipement
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myEquipments.slice(0, 5).map((equipment) => (
                      <div key={equipment.id} className="flex items-start border-b border-gray-100 pb-4 last:border-0">
                        <div 
                          className="w-14 h-14 rounded-md bg-gray-100 mr-4 flex-shrink-0 overflow-hidden"
                          style={{ 
                            backgroundImage: equipment.imageURI ? `url(${equipment.imageURI})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          {!equipment.imageURI && <Package className="w-6 h-6 m-auto text-gray-400" />}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-start justify-between">
                            <Link href={`/equipments/${equipment.id}`} className="hover:text-blue-600 font-medium transition-colors">
                              {equipment.name}
                            </Link>
                            <span className={`text-xs px-2 py-1 rounded-full ${equipment.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                              {equipment.isAvailable ? 'Disponible' : 'Indisponible'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{equipment.description}</p>
                          <div className="mt-1 text-sm font-medium text-blue-600">
                            {formatEtherSafe(equipment.dailyRate)} ETH / jour
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {myEquipments.length > 5 && (
                      <div className="text-center pt-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href="/equipments">
                            Voir les {myEquipments.length - 5} autres équipements
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button asChild className="w-full">
                  <Link href="/equipments/new">
                    Ajouter un nouvel équipement
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Mes locations */}
          <div>
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Mes locations</CardTitle>
                  <CardDescription>
                    Les équipements que vous avez loués
                  </CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/rentals">
                    Voir tout <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              
              {!loadingRentals && myRentals.length > 0 && (
                <div className="px-6 mb-2 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <div className="flex gap-2 text-sm">
                    <button 
                      onClick={() => setActiveRentalFilter("all")}
                      className={`px-2 py-1 rounded-md transition-colors ${activeRentalFilter === "all" ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                    >
                      Toutes
                    </button>
                    <button 
                      onClick={() => setActiveRentalFilter("active")}
                      className={`px-2 py-1 rounded-md transition-colors ${activeRentalFilter === "active" ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}`}
                    >
                      Actives
                    </button>
                    <button 
                      onClick={() => setActiveRentalFilter("completed")}
                      className={`px-2 py-1 rounded-md transition-colors ${activeRentalFilter === "completed" ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
                    >
                      Terminées
                    </button>
                    <button 
                      onClick={() => setActiveRentalFilter("cancelled")}
                      className={`px-2 py-1 rounded-md transition-colors ${activeRentalFilter === "cancelled" ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100'}`}
                    >
                      Annulées
                    </button>
                  </div>
                </div>
              )}
              
              <CardContent>
                {loadingRentals ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                        <Skeleton className="h-4 w-52" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                ) : myRentals.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">Vous n&apos;avez aucune location en cours</p>
                    <Button asChild variant="secondary">
                      <Link href="/equipments">
                        Explorer les équipements
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getFilteredRentals().slice(0, 5).map((rental) => (
                      <div key={rental.id} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex justify-between items-start">
                          <Link href={`/rentals/${rental.id}`} className="font-medium hover:text-blue-600 transition-colors">
                            {rental.equipmentName || `Équipement #${rental.equipmentId}`}
                          </Link>
                          <div className={`
                            px-2 py-1 rounded text-xs font-medium
                            ${rental.status === RentalStatus.CONFIRMED ? 'bg-green-100 text-green-700' : 
                              rental.status === RentalStatus.PENDING ? 'bg-yellow-100 text-yellow-700' :
                              rental.status === RentalStatus.CANCELLED ? 'bg-red-100 text-red-700' :
                              rental.status === RentalStatus.RETURNED ? 'bg-blue-100 text-blue-700' :
                              'bg-purple-100 text-purple-700'
                            }
                          `}>
                            {rental.status}
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between items-end">
                          <div className="text-sm text-gray-600">
                            <p>
                              Du {rental.startDate.toLocaleDateString()} au {rental.endDate.toLocaleDateString()}
                            </p>
                          </div>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/rentals/${rental.id}`}>
                              Gérer
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {getFilteredRentals().length > 5 && (
                      <div className="text-center pt-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href="/rentals">
                            Voir les {getFilteredRentals().length - 5} autres locations
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button asChild className="w-full" variant="outline">
                  <Link href="/equipments">
                    Louer un équipement
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}