'use client';

import { Rental } from '@/types';
import { formatPrice, formatDate } from '@/utils/formatters';
import Link from 'next/link';

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

  // Traduire le statut en français
  const getStatusText = () => {
    switch (getStatus()) {
      case 'cancelled': return 'Annulée';
      case 'returned': return 'Retournée';
      case 'completed': return 'Terminée';
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      default: return 'Inconnue';
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-3">
              Location #{rental.id}
              <Badge variant={getBadgeVariant()}>{getStatusText()}</Badge>
            </h2>
            <p className="text-gray-600">Équipement #{rental.equipmentId}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className="font-semibold text-blue-600 block text-right">
              {formatPrice(rental.totalAmount)} + {formatPrice(rental.deposit)} (caution)
            </span>
            <span className="text-gray-500 text-sm block text-right">
              {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2">
        <Button asChild variant="default">
          <Link href={`/rentals/${rental.id}`}>
            Voir les détails
          </Link>
        </Button>
        
        {rental.isActive && !rental.isConfirmed && (
          <Button
            variant="destructive"
            onClick={() => onCancel(rental.id)}
          >
            Annuler
          </Button>
        )}
        
        {rental.isActive && rental.isConfirmed && !rental.isReturned && (
          <Button
            variant="outline"
            onClick={() => onMarkReturned(rental.id)}
          >
            Marquer comme retourné
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 