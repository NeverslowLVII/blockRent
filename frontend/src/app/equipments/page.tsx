"use client";

import { useState, useEffect, useMemo } from "react";
import { useContracts } from "@/lib/hooks/useContracts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import Link from "next/link";
import { ethers } from "ethers";
import { Package, Filter, Search, SlidersHorizontal, Plus, ArrowUpDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import EquipmentCard from "@/components/equipments/EquipmentCard";
import { formatEtherSafe } from "@/lib/utils";
import { Equipment } from "@/types";

export default function EquipmentsPage() {
  const { isConnected, connect, contracts, account } = useContracts();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtres et tri
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState(false);

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
            if (equipment && !equipment.isDeleted) {
              equipmentsList.push({
                id: currentId,
                name: equipment.name || '',
                description: equipment.description || '',
                imageURI: equipment.imageURI || '',
                dailyRate: equipment.dailyRate || BigInt(0),
                isAvailable: equipment.isAvailable || false,
                owner: equipment.owner || '',
                createdAt: Number(equipment.createdAt) || Date.now() / 1000,
                updatedAt: Number(equipment.updatedAt) || Date.now() / 1000,
                isDeleted: equipment.isDeleted || false
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

  // Filtrage et tri des équipements
  const filteredAndSortedEquipments = useMemo(() => {
    // Étape 1: Filtrer par onglets (tous, les miens, disponibles)
    let filtered = [...equipments];
    
    if (activeTab === "mine" && account) {
      filtered = filtered.filter(eq => eq.owner.toLowerCase() === account.toLowerCase());
    } else if (activeTab === "available") {
      filtered = filtered.filter(eq => eq.isAvailable);
    }

    // Étape 2: Appliquer la recherche textuelle
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(eq => 
        eq.name.toLowerCase().includes(query) || 
        eq.description.toLowerCase().includes(query)
      );
    }

    // Étape 3: Filtrer par gamme de prix
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(p => parseFloat(p));
      filtered = filtered.filter(eq => {
        const dailyRateValue = typeof eq.dailyRate === 'string' 
          ? BigInt(eq.dailyRate) 
          : eq.dailyRate;
        
        const dailyRateEth = parseFloat(formatEtherSafe(dailyRateValue));
        
        if (max) {
          return dailyRateEth >= min && dailyRateEth <= max;
        } else {
          return dailyRateEth >= min;
        }
      });
    }

    // Étape 4: Trier selon l'option choisie
    return filtered.sort((a, b) => {
      const dailyRateA = typeof a.dailyRate === 'string' ? BigInt(a.dailyRate) : a.dailyRate;
      const dailyRateB = typeof b.dailyRate === 'string' ? BigInt(b.dailyRate) : b.dailyRate;
      
      switch (sortOption) {
        case "priceAsc":
          return dailyRateA < dailyRateB ? -1 : dailyRateA > dailyRateB ? 1 : 0;
        case "priceDesc":
          return dailyRateB < dailyRateA ? -1 : dailyRateB > dailyRateA ? 1 : 0;
        case "oldest":
          return a.createdAt - b.createdAt;
        case "newest":
        default:
          return b.createdAt - a.createdAt;
      }
    });
  }, [equipments, activeTab, account, searchQuery, priceRange, sortOption]);

  if (!isConnected) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Équipements</h1>
          <Card>
            <CardContent className="text-center py-16">
              <div className="flex flex-col items-center max-w-md mx-auto">
                <Package className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  Connectez-vous pour découvrir notre catalogue d'équipements
                </p>
                <p className="text-gray-600 mb-8">
                  Parcourez notre sélection d'équipements disponibles à la location ou ajoutez les vôtres.
                </p>
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Équipements</h1>
            <p className="text-gray-600 mt-1">
              {filteredAndSortedEquipments.length} équipement{filteredAndSortedEquipments.length !== 1 ? 's' : ''}
              {searchQuery ? ` pour "${searchQuery}"` : ''}
            </p>
          </div>
          <Button asChild>
            <Link href="/equipments/new" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un équipement
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Rechercher un équipement..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Tous
                  </TabsTrigger>
                  <TabsTrigger value="available" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Disponibles
                  </TabsTrigger>
                  <TabsTrigger value="mine" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Mes équipements
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-blue-50 text-blue-600" : ""}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <span className="hidden md:inline">Trier</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortOption("newest")}>
                    Plus récents
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("oldest")}>
                    Plus anciens
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("priceAsc")}>
                    Prix croissant
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("priceDesc")}>
                    Prix décroissant
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Filtres avancés */}
          {showFilters && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Gamme de prix (ETH)</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les gammes de prix" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les prix</SelectItem>
                      <SelectItem value="0-0.1">Moins de 0.1 ETH</SelectItem>
                      <SelectItem value="0.1-0.5">0.1 - 0.5 ETH</SelectItem>
                      <SelectItem value="0.5-1">0.5 - 1 ETH</SelectItem>
                      <SelectItem value="1-5">1 - 5 ETH</SelectItem>
                      <SelectItem value="5-">Plus de 5 ETH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Erreur</h3>
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </Button>
          </div>
        ) : filteredAndSortedEquipments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              {searchQuery || priceRange !== "all" || activeTab !== "all" ? (
                <div className="flex flex-col items-center max-w-md mx-auto">
                  <Package className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-xl font-semibold text-gray-800 mb-2">
                    Aucun équipement ne correspond à votre recherche
                  </p>
                  <p className="text-gray-600 mb-8">
                    Essayez de modifier vos critères de recherche ou d'afficher tous les équipements.
                  </p>
                  <div className="flex gap-4">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setPriceRange("all");
                        setActiveTab("all");
                        setShowFilters(false);
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                    <Button asChild>
                      <Link href="/equipments/new">
                        Ajouter un équipement
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center max-w-md mx-auto">
                  <Package className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-xl font-semibold text-gray-800 mb-2">
                    Aucun équipement n'est disponible pour le moment
                  </p>
                  <p className="text-gray-600 mb-8">
                    Soyez le premier à ajouter un équipement à louer sur la plateforme !
                  </p>
                  <Button asChild>
                    <Link href="/equipments/new">
                      Ajouter mon premier équipement
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedEquipments.map((equipment) => (
              <EquipmentCard 
                key={equipment.id} 
                equipment={equipment} 
                highlightNew={Date.now() / 1000 - equipment.createdAt < 7 * 24 * 60 * 60} // Moins de 7 jours
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 