'use client';

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RentalStatus, FormattedRental } from "@/types";

// Helper function to format date
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
};

interface RentalCardProps {
  rental: FormattedRental;
  onCancel?: () => void;
  onMarkReturned?: () => void;
}

export default function RentalCard({ rental, onCancel, onMarkReturned }: RentalCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Determine status badge color
  let statusColor = '';
  switch (rental.status) {
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

  const handleCancel = async () => {
    if (onCancel) {
      await onCancel();
    }
  };

  const handleMarkReturned = async () => {
    if (onMarkReturned) {
      await onMarkReturned();
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CardContent className="p-6">
          <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span>
                  Location #{rental.id}
                </span>
                <div className={`${statusColor} px-2 py-1 rounded text-sm border`}>
                  {rental.status}
                </div>
              </h2>
              <p className="text-gray-600">Équipement #{rental.equipmentId}</p>
            </div>

            <div className="flex justify-between items-end mb-4">
              <div>
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 inline-block mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                  </span>
                </div>
              </div>
              <div>
                <span className="font-bold text-blue-600 block text-right text-xl">
                  {rental.totalAmount} ETH
                </span>
                <span className="text-gray-500 text-sm block text-right">
                  + {rental.deposit} ETH (caution)
                </span>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-between mt-6">
            <Link href={`/rentals/${rental.id}`} passHref>
              <Button variant="outline">
                Voir les détails
              </Button>
            </Link>

            {rental.status === RentalStatus.CONFIRMED && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="default"
                  onClick={handleMarkReturned}
                >
                  Marquer comme retourné
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </motion.div>
    </Card>
  );
} 