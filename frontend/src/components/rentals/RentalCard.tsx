'use client';

import { Rental } from '@/types';
import { formatPrice, formatDate } from '@/utils/formatters';
import Link from 'next/link';
import StatusBadge from '../ui/StatusBadge';

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

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              Location #{rental.id}
              <div className="ml-3">
                <StatusBadge status={getStatus()} />
              </div>
            </h2>
            <p className="text-gray-600">Équipement #{rental.equipmentId}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className="font-semibold text-blue-600 block">
              {formatPrice(rental.totalAmount)} + {formatPrice(rental.deposit)} (caution)
            </span>
            <span className="text-gray-500 text-sm block">
              {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-6">
          <Link
            href={`/rentals/${rental.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition text-sm"
          >
            Voir les détails
          </Link>
          
          {rental.isActive && !rental.isConfirmed && (
            <button
              onClick={() => onCancel(rental.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition text-sm"
            >
              Annuler
            </button>
          )}
          
          {rental.isActive && rental.isConfirmed && !rental.isReturned && (
            <button
              onClick={() => onMarkReturned(rental.id)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded transition text-sm"
            >
              Marquer comme retourné
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 