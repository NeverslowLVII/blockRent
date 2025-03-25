'use client';

import { Equipment } from '@/types';
import { formatPrice } from '@/utils/formatters';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden transition h-full bg-white border-2 hover:border-blue-200 hover:shadow-xl">
        <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Image 
                src={equipment.imageUrl || '/images/placeholder-equipment.jpg'} 
                alt={equipment.name} 
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant={equipment.isAvailable ? "default" : "destructive"} className="animate-pulse">
              {equipment.isAvailable ? '✨ Disponible' : '🚫 Indisponible'}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="pt-6 pb-2">
          <motion.h2 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {equipment.name}
          </motion.h2>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-600 mb-4 line-clamp-2">{equipment.description}</p>
          
          <motion.div 
            className="text-lg font-bold flex items-baseline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl text-blue-600">{formatPrice(equipment.dailyRate)}</span>
            <span className="ml-1 text-gray-500 text-sm">/ jour</span>
          </motion.div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 group">
            <Link href={`/equipments/${equipment.id}`}>
              <span className="flex items-center">
                Voir détails
                <svg className="ml-1 w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
} 