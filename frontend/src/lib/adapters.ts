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

  // Helper function to safely format values that might be decimals
  const formatValue = (value: string | bigint): string => {
    // If it's already a bigint, just format it
    if (typeof value === 'bigint') {
      return ethers.formatEther(value);
    }
    
    try {
      // If it's a decimal string like "0.001", it's already in ETH format
      if (value.includes('.')) {
        return value;
      }
      
      // Otherwise, it's likely in wei format and needs to be formatted
      return ethers.formatEther(BigInt(value));
    } catch (e) {
      console.error("Error formatting value:", value, e);
      return "0";
    }
  };
  
  return {
    id: rental.id,
    equipmentId: rental.equipmentId,
    renter: rental.renter,
    owner: rental.owner,
    startDate: rental.startDate,
    endDate: rental.endDate,
    dailyRate: rental.dailyRate,
    deposit: rental.deposit,
    totalAmount: rental.totalAmount.toString(),
    status,
    equipment,
    durationInDays: calculateDurationInDays(rental.startDate, rental.endDate),
    isPastDue: isPastDue(rental.endDate),
    formattedDailyRate: formatValue(rental.dailyRate),
    formattedDeposit: formatValue(rental.deposit),
    formattedTotalAmount: formatValue(rental.totalAmount)
  };
}

function calculateDurationInDays(startDate: number, endDate: number): number {
  return Math.ceil((endDate - startDate) / (24 * 60 * 60 * 1000));
}

function isPastDue(endDate: number): boolean {
  return Date.now() > endDate;
} 