export interface Equipment {
  id: number;
  owner: string;
  name: string;
  description: string;
  imageURI: string;
  dailyRate: string;
  isAvailable: boolean;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

export interface Rental {
  id: number;
  equipmentId: number;
  renter: string;
  owner: string;
  startDate: number;
  endDate: number;
  dailyRate: string;
  deposit: string;
  totalAmount: string;
  isActive: boolean;
  isReturned: boolean;
  isCancelled: boolean;
  isDepositReturned: boolean;
  isConfirmed: boolean;
  createdAt: number;
  updatedAt: number;
}

export enum RentalStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
  COMPLETED = 'COMPLETED'
}

export interface FormattedRental extends Omit<Rental, 'isActive' | 'isReturned' | 'isCancelled' | 'isDepositReturned' | 'isConfirmed'> {
  status: RentalStatus;
  equipment?: Equipment;
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