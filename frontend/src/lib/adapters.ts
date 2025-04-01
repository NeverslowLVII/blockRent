import { Equipment, Rental, RentalStatus, FormattedRental } from '../types';
import { ethers } from 'ethers';

/**
 * Enhances an Equipment object with derived properties
 */
export function enhanceEquipment(equipment: Equipment): Equipment & { deposit: string } {
  return {
    ...equipment,
    deposit: ethers.formatEther(BigInt(equipment.dailyRate) * BigInt(2)) // La caution est 2x le tarif journalier
  };
}

/**
 * Converts a Rental object to a frontend-friendly format
 */
export function formatRental(rental: Rental, equipment?: Equipment): FormattedRental {
  // Determine status based on rental flags
  let status = RentalStatus.PENDING;
  
  if (rental.isCancelled) {
    status = RentalStatus.CANCELLED;
  } else if (rental.isReturned) {
    status = RentalStatus.RETURNED;
  } else if (rental.isConfirmed) {
    status = RentalStatus.CONFIRMED;
  } else if (rental.isConfirmed && rental.isReturned) {
    status = RentalStatus.COMPLETED;
  }
  
  return {
    id: rental.id,
    equipmentId: rental.equipmentId,
    renter: rental.renter,
    owner: rental.owner,
    startDate: rental.startDate,
    endDate: rental.endDate,
    dailyRate: rental.dailyRate,
    deposit: rental.deposit,
    totalAmount: rental.totalAmount,
    createdAt: rental.createdAt,
    updatedAt: rental.updatedAt,
    status,
    equipment
  };
} 