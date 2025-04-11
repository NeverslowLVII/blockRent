'use client';

import { Equipment } from '@/types';
import { formatEtherSafe } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Tag, Calendar } from 'lucide-react';

interface EquipmentCardProps {
  equipment: Equipment;
  highlightNew?: boolean;
}

export default function EquipmentCard({ equipment, highlightNew = false }: EquipmentCardProps) {
  const [imageError, setImageError] = useState(false);
  const isNewEquipment = highlightNew && Date.now() - (equipment.createdAt * 1000) < 7 * 24 * 60 * 60 * 1000; // 7 jours
  
  // Palette de couleur en fonction de la disponibilité
  const colorScheme = equipment.isAvailable 
    ? { badge: 'bg-green-100 text-green-800 border-green-200', accent: 'text-green-600' }
    : { badge: 'bg-orange-100 text-orange-800 border-orange-200', accent: 'text-orange-600' };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col border hover:border-blue-200/70 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
        {/* Image container avec overlay si indisponible */}
        <div className="relative aspect-video bg-gray-50 overflow-hidden group">
          {!imageError ? (
            <Image 
              src={equipment.imageURI || '/images/placeholder-equipment.jpg'}
              alt={equipment.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center p-8">
              <Package size={64} className="text-gray-300" />
            </div>
          )}
          
          {/* Badge "Nouveau" si applicable */}
          {isNewEquipment && (
            <div className="absolute top-2 left-2 z-10">
              <Badge variant="outline" className="bg-blue-100/80 text-blue-800 border-blue-200 font-semibold backdrop-blur-sm">
                NOUVEAU
              </Badge>
            </div>
          )}
          
          {/* Badge de disponibilité */}
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="outline" className={`${colorScheme.badge} backdrop-blur-sm`}>
              {equipment.isAvailable ? 'Disponible' : 'Indisponible'}
            </Badge>
          </div>
          
          {/* Overlay sombre si indisponible */}
          {!equipment.isAvailable && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-medium px-4 py-2 rounded-full bg-black/50 text-sm">
                Actuellement loué
              </span>
            </div>
          )}
        </div>
        
        <CardContent className="flex-grow pt-4">
          <div className="space-y-3">
            <div>
              <h2 className="text-xl font-bold line-clamp-1 group-hover:text-blue-600 transition-colors">
                {equipment.name}
              </h2>
              <p className="text-gray-600 mt-1 line-clamp-2 text-sm">{equipment.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1.5">
                <Tag size={16} className={colorScheme.accent} />
                <span className="font-medium">
                  {typeof equipment.dailyRate === 'string' 
                    ? formatEtherSafe(BigInt(equipment.dailyRate))
                    : formatEtherSafe(equipment.dailyRate)
                  } ETH
                </span>
                <span className="text-gray-500">/jour</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-gray-600">
                  {new Date(equipment.createdAt * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 pb-4">
          <Button asChild variant="default" className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:to-indigo-500">
            <Link href={`/equipments/${equipment.id}`}>
              <span className="relative z-10 flex items-center justify-center font-medium">
                Voir les détails
                <svg className="ml-1.5 w-4 h-4 transition-transform duration-300 transform group-hover:translate-x-1" 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="absolute inset-0 -z-10 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-indigo-600 to-blue-500"></span>
              </span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}