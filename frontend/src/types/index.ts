export enum RentalStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
  COMPLETED = "COMPLETED"
}

// Type des équipements depuis les smart contracts
export interface Equipment {
  id: number;
  owner: string;
  name: string;
  description: string;
  imageURI: string;
  dailyRate: string | bigint; // Peut être un bigint ou une string selon la source
  isAvailable: boolean;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

// Type des équipements avec des champs supplémentaires pour l'interface
export interface EnhancedEquipment extends Equipment {
  deposit: string;
  formattedDailyRate: string;
  formattedDeposit: string;
}

// Type pour les locations depuis le smart contract
export interface Rental {
  id: number;
  equipmentId: number;
  renter: string;
  owner: string;
  startDate: number;
  endDate: number;
  dailyRate: string;
  deposit: string;
  totalAmount: string | bigint;
  isActive: boolean;
  isReturned: boolean;
  isCancelled: boolean;
  isDepositReturned: boolean;
  isConfirmed: boolean;
  createdAt: number;
  updatedAt: number;
}

// Type pour les locations formatées pour l'interface
export interface FormattedRental {
  id: number;
  equipmentId: number;
  renter: string;
  owner: string;
  startDate: number;
  endDate: number;
  dailyRate: string;
  deposit: string;
  totalAmount: string;
  status: RentalStatus;
  equipment?: Equipment;
  durationInDays: number;
  isPastDue: boolean;
  formattedDailyRate: string;
  formattedDeposit: string;
  formattedTotalAmount: string;
}

export interface ContractsHookReturn {
  contracts: {
    equipmentRegistry: any | null;
    rentalManager: any | null;
  };
  provider: any | null;
  account: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
} 