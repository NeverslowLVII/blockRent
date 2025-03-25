export interface Equipment {
  id: number;
  name: string;
  description: string;
  dailyRate: string;
  deposit: string;
  isAvailable: boolean;
  owner: string;
  imageUrl?: string;
  createdAt: number;
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