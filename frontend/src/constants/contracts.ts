/**
 * Configuration des contrats et des réseaux pour l'application
 * 
 * IMPORTANT: Après le déploiement des contrats, mettez à jour les adresses dans la section
 * CONTRACT_ADDRESSES ci-dessous en remplaçant les chaînes vides par les adresses déployées.
 */

interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  blockExplorer: string;
  isTestnet: boolean;
  currency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface ContractAddresses {
  equipmentRegistry: string;
  rentalManager: string;
}

// Configuration des réseaux supportés
export const NETWORKS: Record<number, NetworkConfig> = {
  // Polygon Amoy (Testnet)
  80002: {
    name: 'Polygon Amoy Testnet',
    chainId: 80002,
    rpcUrl: 'https://rpc-amoy.polygon.technology/',
    blockExplorer: 'https://amoy.polygonscan.com/',
    isTestnet: true,
    currency: {
      name: 'POL',
      symbol: 'POL',
      decimals: 18,
    },
  },
  // Polygon (Mainnet)
  137: {
    name: 'Polygon',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com/',
    blockExplorer: 'https://polygonscan.com/',
    isTestnet: false,
    currency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
};

/**
 * Adresses des contrats déployés
 * 
 * APRÈS LE DÉPLOIEMENT: Mettez à jour ces adresses avec celles obtenues lors du déploiement
 * des contrats sur Polygon Amoy Testnet.
 * 
 * Si vous avez déployé sur un autre réseau, ajoutez les adresses correspondantes.
 */
export const CONTRACT_ADDRESSES: Record<number, ContractAddresses> = {
  // Polygon Amoy (Testnet)
  80002: {
    equipmentRegistry: '0xeF362e504937468103938c489a89b6f9f3ffDD6D',
    rentalManager: '0xB466a7d6CEeacDf02e67fe459822AeEAdE0d4f1B',
  },
  // Polygon (Mainnet)
  137: {
    equipmentRegistry: '', // À ne remplir que pour le déploiement en production
    rentalManager: '',     // À ne remplir que pour le déploiement en production
  },
};

// Réseau par défaut pour l'application
export const DEFAULT_CHAIN_ID = 80002; // Polygon Amoy Testnet

// ABIs des contrats (interfaces simplifiées pour TypeScript)
export const EQUIPMENT_REGISTRY_ABI = [
  // Fonctions de lecture
  'function equipments(uint256 equipmentId) external view returns (uint256 id, address owner, string name, string description, string imageURI, uint256 dailyRate, bool isAvailable, uint256 createdAt, uint256 updatedAt, bool isDeleted)',
  'function getEquipment(uint256 equipmentId) external view returns (tuple(uint256 id, address owner, string name, string description, string imageURI, uint256 dailyRate, bool isAvailable, uint256 createdAt, uint256 updatedAt, bool isDeleted))',
  'function totalEquipments() external view returns (uint256)',
  'function ownerEquipments(address owner, uint256 index) external view returns (uint256)',
  'function getOwnerEquipments(address owner) external view returns (uint256[])',
  'function isEquipmentAvailable(uint256 equipmentId) external view returns (bool)',
  'function rentalManager() external view returns (address)',
  
  // Fonctions d'écriture
  'function registerEquipment(string memory name, string memory description, string memory imageURI, uint256 dailyRate) external returns (uint256)',
  'function updateEquipment(uint256 equipmentId, string memory name, string memory description, string memory imageURI, uint256 dailyRate, bool isAvailable) external',
  'function setEquipmentAvailability(uint256 equipmentId, bool isAvailable) external',
  'function removeEquipment(uint256 equipmentId) external',
  'function setRentalManager(address _rentalManager) external',
  
  // Événements
  'event EquipmentRegistered(uint256 indexed id, address indexed owner, string name, uint256 dailyRate)',
  'event EquipmentUpdated(uint256 indexed id, address indexed owner, bool isAvailable, uint256 dailyRate)',
  'event EquipmentRemoved(uint256 indexed id, address indexed owner)',
  'event RentalManagerSet(address indexed oldManager, address indexed newManager)',
];

export const RENTAL_MANAGER_ABI = [
  // Fonctions de lecture
  'function rentals(uint256 rentalId) external view returns (uint256 id, uint256 equipmentId, address renter, address owner, uint256 startDate, uint256 endDate, uint256 dailyRate, uint256 deposit, uint256 totalAmount, bool isActive, bool isReturned, bool isCancelled, bool isDepositReturned, bool isConfirmed, uint256 createdAt, uint256 updatedAt)',
  'function equipmentRentals(uint256 equipmentId, uint256 index) external view returns (uint256)',
  'function renterRentals(address renter, uint256 index) external view returns (uint256)',
  'function ownerRentals(address owner, uint256 index) external view returns (uint256)',
  'function totalRentals() external view returns (uint256)',
  'function serviceFeePercentage() external view returns (uint256)',
  'function platformOwner() external view returns (address)',
  'function equipmentRegistry() external view returns (address)',
  
  // Fonctions d'écriture
  'function createRental(uint256 equipmentId, uint256 startDate, uint256 endDate) external payable returns (uint256)',
  'function confirmRental(uint256 rentalId) external',
  'function cancelRental(uint256 rentalId) external',
  'function markEquipmentReturned(uint256 rentalId) external',
  'function returnDeposit(uint256 rentalId) external',
  'function updateServiceFee(uint256 newFeePercentage) external onlyPlatformOwner',
  
  // Événements
  'event RentalCreated(uint256 indexed rentalId, uint256 indexed equipmentId, address indexed renter, uint256 startDate, uint256 endDate, uint256 totalAmount, uint256 deposit)',
  'event RentalConfirmed(uint256 indexed rentalId, uint256 indexed equipmentId, address indexed owner)',
  'event RentalCancelled(uint256 indexed rentalId, uint256 indexed equipmentId, address indexed initiator)',
  'event EquipmentReturned(uint256 indexed rentalId, uint256 indexed equipmentId, address indexed owner)',
  'event DepositReturned(uint256 indexed rentalId, uint256 indexed equipmentId, address indexed renter, uint256 amount)',
  'event ServiceFeeUpdated(uint256 newFeePercentage)',
]; 