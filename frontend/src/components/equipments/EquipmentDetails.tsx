import { Equipment } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate, formatAddress } from "@/utils/formatters";
import Image from "next/image";
import { enhanceEquipment } from '@/lib/adapters';

interface EquipmentDetailsProps {
  equipment: Equipment;
}

export default function EquipmentDetails({ equipment }: EquipmentDetailsProps) {
  const enhancedEquipment = enhanceEquipment(equipment);
  
  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
            {equipment.name}
            <Badge variant={equipment.isAvailable ? "default" : "secondary"}>
              {equipment.isAvailable ? "Disponible" : "Indisponible"}
            </Badge>
          </h2>
          <p className="text-gray-600">#{equipment.id}</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <span className="font-semibold text-blue-600 block text-right">
            {formatPrice(equipment.dailyRate)}/jour
          </span>
          <span className="text-gray-500 text-sm block text-right">
            Caution: {formatPrice(enhancedEquipment.deposit)}
          </span>
        </div>
      </div>

      <div className="relative h-48 bg-gray-100 rounded-lg mb-6">
        <Image 
          src={equipment.imageURI || '/images/placeholder-equipment.jpg'}
          alt={equipment.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <p className="mt-1 text-gray-700">{equipment.description}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Propriétaire</h3>
          <p className="mt-1 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {formatAddress(equipment.owner)}
          </p>
        </div>

        <div className="border-t pt-4">
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">Date d'ajout</p>
              <p className="mt-1">{formatDate(equipment.createdAt)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Dernière mise à jour</p>
              <p className="mt-1">{formatDate(equipment.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
} 