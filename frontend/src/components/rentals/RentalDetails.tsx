"use client";

import { Rental, RentalStatus, Equipment } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { formatAddress } from "@/lib/utils";
import { formatRental } from '@/lib/adapters';

interface RentalDetailsProps {
  rental: Rental;
  equipment?: Equipment;
  onCancel?: () => void;
  onMarkReturned?: () => void;
}

export default function RentalDetails({ rental, equipment, onCancel, onMarkReturned }: RentalDetailsProps) {
  const formattedRental = formatRental(rental, equipment);
  
  // Determine status badge color
  let statusColor = '';
  switch (formattedRental.status) {
    case RentalStatus.PENDING:
      statusColor = 'bg-yellow-100 border-yellow-400 text-yellow-800';
      break;
    case RentalStatus.CONFIRMED:
      statusColor = 'bg-green-100 border-green-400 text-green-800';
      break;
    case RentalStatus.CANCELLED:
      statusColor = 'bg-red-100 border-red-400 text-red-800';
      break;
    case RentalStatus.RETURNED:
      statusColor = 'bg-blue-100 border-blue-400 text-blue-800';
      break;
    case RentalStatus.COMPLETED:
      statusColor = 'bg-purple-100 border-purple-400 text-purple-800';
      break;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {formattedRental.equipment?.name}
            </h2>
            <p className="text-gray-600">
              {formattedRental.equipment?.description}
            </p>
          </div>
          <div className={`${statusColor} px-3 py-1 rounded-full text-sm border`}>
            {formattedRental.status}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Détails de la location</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Période de location</p>
                <p className="font-medium">
                  Du {new Date(rental.startDate).toLocaleDateString()} au {new Date(rental.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tarif journalier</p>
                <p className="font-medium">{rental.dailyRate} ETH</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Caution</p>
                <p className="font-medium">{rental.deposit} ETH</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Montant total</p>
                <p className="font-medium">{rental.totalAmount} ETH</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Participants</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Propriétaire</p>
                <p className="font-mono text-sm break-all">
                  {formatAddress(rental.owner)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Locataire</p>
                <p className="font-mono text-sm break-all">
                  {formatAddress(rental.renter)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          {(formattedRental.status === RentalStatus.PENDING || formattedRental.status === RentalStatus.CONFIRMED) && (
            <>
              {formattedRental.status === RentalStatus.PENDING && onCancel && (
                <Button variant="destructive" onClick={onCancel}>
                  Annuler la location
                </Button>
              )}
              {formattedRental.status === RentalStatus.CONFIRMED && onMarkReturned && (
                <Button variant="default" onClick={onMarkReturned}>
                  Marquer comme retourné
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 