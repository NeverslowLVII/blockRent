"use client";

import { useState, useEffect, useMemo } from "react";
import { useContracts } from "@/lib/hooks/useContracts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import EquipmentCard from "@/components/equipments/EquipmentCard";
import { formatEtherSafe } from "@/lib/utils";
import { Equipment } from "@/types";
import { motion } from "framer-motion";
import { PackageX } from "lucide-react";
import { EquipmentFilters } from "@/components/equipments/EquipmentFilters";
import { EquipmentCardSkeleton } from "@/components/equipments/EquipmentCardSkeleton";

export default function EquipmentsPage() {
  const { isConnected, connect, contracts, account } = useContracts();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  
  // Filtres et tri
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("newest");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                  Connectez-vous pour découvrir notre catalogue d&apos;équipements
                </p>
                <p className="text-gray-600 mb-8">
                  Parcourez notre sélection d&apos;équipements disponibles à la location ou ajoutez les vôtres.
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
    <div className="container px-4 py-8 mx-auto max-w-6xl">
      <div className="relative space-y-8">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-1/4 -left-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/3 w-60 h-60 bg-indigo-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Équipements disponibles
          </h1>
          <p className="text-gray-600 max-w-prose">
            Découvrez notre sélection d&apos;équipements disponibles à la location. Utilisez les filtres 
            ci-dessous pour affiner votre recherche.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
            <EquipmentFilters
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              searchTerm={searchQuery}
              setSearchTerm={setSearchQuery}
              availabilityFilter={activeTab}
              setAvailabilityFilter={setActiveTab}
              sortOrder={sortOption}
              setSortOrder={setSortOption}
            />
          </div>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          >
            {[...Array(6)].map((_, i) => (
              <EquipmentCardSkeleton key={i} />
            ))}
          </motion.div>
        ) : equipments.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {equipments.map((equipment, index) => (
                <motion.div
                  key={equipment.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * (index % 3) }}
                >
                  <EquipmentCard equipment={equipment} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center mt-12 py-16 text-center space-y-4"
          >
            <div className="rounded-full bg-gray-100/80 p-6">
              <PackageX size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700">Aucun équipement trouvé</h2>
            <p className="text-gray-500 max-w-md">
              Nous n&apos;avons trouvé aucun équipement correspondant à vos critères de recherche. Essayez d&apos;ajuster vos filtres.
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setPriceRange('all');
                setActiveTab('all');
                setSortOption('newest');
              }}
              variant="outline"
              className="mt-4"
            >
              Réinitialiser les filtres
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 