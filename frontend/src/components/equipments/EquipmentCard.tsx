'use client';

import { Equipment } from '@/types';
import { formatPrice } from '@/utils/formatters';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EquipmentCardProps {
  equipment: Equipment;
}

export default function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <Card className="overflow-hidden transition hover:shadow-md group">
      <div className="h-48 overflow-hidden bg-gray-100 relative">
        <Image 
          src={equipment.imageUrl || '/images/placeholder-equipment.jpg'} 
          alt={equipment.name} 
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      
      <CardHeader className="pt-6 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{equipment.name}</h2>
          <Badge variant={equipment.isAvailable ? "default" : "destructive"}>
            {equipment.isAvailable ? 'Disponible' : 'Indisponible'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-2">{equipment.description}</p>
        
        <div className="text-lg font-semibold text-blue-600">
          {formatPrice(equipment.dailyRate)} / jour
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button asChild>
          <Link href={`/equipments/${equipment.id}`}>
            Voir détails
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 