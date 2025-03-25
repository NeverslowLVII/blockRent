'use client';

import { Rental } from '@/types';
import { formatPrice, formatDate } from '@/utils/formatters';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RentalCardProps {
  rental: Rental;
  onCancel: (rentalId: number) => void;
  onMarkReturned: (rentalId: number) => void;
}

export default function RentalCard({ rental, onCancel, onMarkReturned }: RentalCardProps) {
  // Déterminer le statut basé sur les propriétés de la location
  const getStatus = () => {
    if (rental.isCancelled) return 'cancelled';
    if (rental.isReturned) return 'returned';
    if (!rental.isActive) return 'completed';
    if (!rental.isConfirmed) return 'pending';
    return 'confirmed';
  };

  // Déterminer la variante du badge en fonction du statut
  const getBadgeVariant = () => {
    switch (getStatus()) {
      case 'cancelled': return 'destructive';
      case 'returned': return 'default';
      case 'completed': return 'secondary';
      case 'pending': return 'outline';
      case 'confirmed': return 'default';
      default: return 'default';
    }
  };

  // Traduire le statut en français et ajouter des emojis
  const getStatusText = () => {
    switch (getStatus()) {
      case 'cancelled': return '❌ Annulée';
      case 'returned': return '✅ Retournée';
      case 'completed': return '🏁 Terminée';
      case 'pending': return '⏳ En attente';
      case 'confirmed': return '🔆 Confirmée';
      default: return '❓ Inconnue';
    }
  };

  // Animation pour les cartes
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    hover: { y: -5, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <Card className="overflow-hidden border-2 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Location #{rental.id}
                </span>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Badge variant={getBadgeVariant()} className="text-xs font-semibold">
                    {getStatusText()}
                  </Badge>
                </motion.div>
              </h2>
              <p className="text-gray-600">Équipement #{rental.equipmentId}</p>
            </div>
            <motion.div 
              className="mt-4 sm:mt-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-bold text-blue-600 block text-right text-xl">
                {formatPrice(rental.totalAmount)}
              </span>
              <span className="text-gray-500 text-sm block text-right">
                + {formatPrice(rental.deposit)} (caution)
              </span>
              <div className="text-right mt-1 flex items-center justify-end text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {formatDate(rental.startDate).slice(0, 5)} - {formatDate(rental.endDate).slice(0, 5)}
                </span>
              </div>
            </motion.div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-wrap gap-2 pt-2 border-t">
          <Button asChild variant="default" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 group">
            <Link href={`/rentals/${rental.id}`}>
              <span className="flex items-center">
                Voir les détails
                <svg className="ml-1 w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </Button>
          
          {rental.isActive && !rental.isConfirmed && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="destructive"
                onClick={() => onCancel(rental.id)}
                className="group"
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Annuler
                </span>
              </Button>
            </motion.div>
          )}
          
          {rental.isActive && rental.isConfirmed && !rental.isReturned && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => onMarkReturned(rental.id)}
                className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 group"
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Retourné
                </span>
              </Button>
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
} 