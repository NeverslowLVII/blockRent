import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ethers } from "ethers"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate un montant BigInt en ETH avec gestion des valeurs nulles ou undefined
 */
export const formatEtherSafe = (value: bigint | null | undefined): string => {
  if (value === null || value === undefined) {
    return "0.0"
  }
  return ethers.formatEther(value)
}

/**
 * Formate une date timestamp en format local
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleDateString()
}

/**
 * Formate une adresse ethereum en version abrégée
 */
export const formatAddress = (address: string): string => {
  if (!address || address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Tronque un texte à une longueur donnée
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Calcule la durée en jours entre deux dates
 */
export const calculateDurationInDays = (startDate: Date, endDate: Date): number => {
  const differenceInTime = endDate.getTime() - startDate.getTime()
  return Math.ceil(differenceInTime / (1000 * 3600 * 24))
}

/**
 * Vérifie si une date est dans le passé
 */
export const isPastDate = (date: Date): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}
