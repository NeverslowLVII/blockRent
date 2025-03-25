'use client';

import { Equipment } from '@/types';
import { formatPrice } from '@/utils/formatters';
import Image from 'next/image';
import Link from 'next/link';
import StatusBadge from '../ui/StatusBadge';

interface EquipmentCardProps {
  equipment: Equipment;
}

export default function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm transform transition duration-300 hover:shadow-md hover:-translate-y-1">
      <div className="h-48 overflow-hidden bg-gray-100 relative">
        <Image 
          src={equipment.imageUrl || '/images/placeholder-equipment.jpg'} 
          alt={equipment.name} 
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">{equipment.name}</h2>
          <StatusBadge status={equipment.isAvailable ? 'available' : 'unavailable'} />
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{equipment.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-blue-600">
            {formatPrice(equipment.dailyRate)} / jour
          </span>
          
          <Link 
            href={`/equipments/${equipment.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Voir détails
          </Link>
        </div>
      </div>
    </div>
  );
} 