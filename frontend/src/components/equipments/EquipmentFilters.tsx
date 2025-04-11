import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EquipmentFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  priceRange: string;
  setPriceRange: (value: string) => void;
  availabilityFilter: string;
  setAvailabilityFilter: (value: string) => void;
   
  sortOrder: string;
  setSortOrder: (value: string) => void;
}

export function EquipmentFilters({
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange,
  availabilityFilter,
  setAvailabilityFilter,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sortOrder,
  setSortOrder,
}: EquipmentFiltersProps) {
  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Rechercher un équipement..."
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={availabilityFilter === "all" ? "default" : "outline"}
            onClick={() => setAvailabilityFilter("all")}
            className="px-3"
          >
            Tous
          </Button>
          <Button
            variant={availabilityFilter === "available" ? "default" : "outline"}
            onClick={() => setAvailabilityFilter("available")}
            className="px-3"
          >
            Disponibles
          </Button>
          <Button
            variant={availabilityFilter === "mine" ? "default" : "outline"}
            onClick={() => setAvailabilityFilter("mine")}
            className="px-3"
          >
            Mes équipements
          </Button>
          
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
              <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                Plus récents
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                Plus anciens
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("priceAsc")}>
                Prix croissant
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("priceDesc")}>
                Prix décroissant
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Filtres avancés */}
      {showFilters && (
        <div className="mt-2 p-4 border border-gray-200 rounded-lg bg-white/70 backdrop-blur-sm">
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
  );
} 