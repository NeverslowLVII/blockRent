import { ethers } from 'ethers';

// Adresses des contrats depuis les variables d'environnement
export const CONTRACT_ADDRESSES = {
  equipmentRegistry: process.env.NEXT_PUBLIC_EQUIPMENT_REGISTRY_ADDRESS as string,
  rentalManager: process.env.NEXT_PUBLIC_RENTAL_MANAGER_ADDRESS as string,
};

// Configuration du réseau
export const NETWORK_CONFIG = {
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '80002'),
  networkName: process.env.NEXT_PUBLIC_NETWORK_NAME || 'Polygon Amoy',
  rpcUrl: process.env.NEXT_PUBLIC_PROVIDER_URL || 'https://rpc-amoy.polygon.technology/',
};

// ABIs des contrats (à importer depuis les fichiers générés après compilation)
export const EQUIPMENT_REGISTRY_ABI = [
  // Fonctions de lecture
  'function getEquipment(uint256 _equipmentId) external view returns (tuple(uint256 id, address owner, string name, string description, string imageURI, uint256 dailyRate, bool isAvailable, uint256 createdAt, uint256 updatedAt, bool isDeleted))',
  'function getOwnerEquipments(address _owner) external view returns (uint256[])',
  'function isEquipmentAvailable(uint256 _equipmentId) external view returns (bool)',
  {
    "inputs": [],
    "name": "rentalManager",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalEquipments",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  'function equipments(uint256) view returns (uint256 id, address owner, string name, string description, string imageURI, uint256 dailyRate, bool isAvailable, uint256 createdAt, uint256 updatedAt, bool isDeleted)',
  'function ownerEquipments(address, uint256) view returns (uint256)',
  
  // Fonctions d'écriture
  'function registerEquipment(string memory _name, string memory _description, string memory _imageURI, uint256 _dailyRate) external returns (uint256)',
  'function updateEquipment(uint256 _equipmentId, string memory _name, string memory _description, string memory _imageURI, uint256 _dailyRate, bool _isAvailable) external',
  'function setEquipmentAvailability(uint256 _equipmentId, bool _isAvailable) external',
  'function removeEquipment(uint256 _equipmentId) external',
  'function setRentalManager(address _rentalManager) external',
  
  // Événements
  'event EquipmentRegistered(uint256 indexed id, address indexed owner, string name, uint256 dailyRate)',
  'event EquipmentUpdated(uint256 indexed id, address indexed owner, bool isAvailable, uint256 dailyRate)',
  'event EquipmentRemoved(uint256 indexed id, address indexed owner)',
  'event RentalManagerSet(address indexed oldManager, address indexed newManager)',
];

export const RENTAL_MANAGER_ABI = [
  // Fonctions de lecture
  'function getRental(uint256 _rentalId) external view returns (tuple(uint256 id, uint256 equipmentId, address renter, address owner, uint256 startDate, uint256 endDate, uint256 dailyRate, uint256 deposit, uint256 totalAmount, bool isActive, bool isReturned, bool isCancelled, bool isDepositReturned, bool isConfirmed, uint256 createdAt, uint256 updatedAt))',
  'function rentals(uint256) view returns (uint256 id, uint256 equipmentId, address renter, address owner, uint256 startDate, uint256 endDate, uint256 dailyRate, uint256 deposit, uint256 totalAmount, bool isActive, bool isReturned, bool isCancelled, bool isDepositReturned, bool isConfirmed, uint256 createdAt, uint256 updatedAt)',
  'function getEquipmentRentals(uint256 _equipmentId) external view returns (uint256[])',
  'function getRenterRentals(address _renter) external view returns (uint256[])',
  'function getOwnerRentals(address _owner) external view returns (uint256[])',
  'function equipmentRegistry() external view returns (address)',
  'function serviceFeePercentage() external view returns (uint256)',
  'function platformOwner() external view returns (address)',
  'function totalRentals() external view returns (uint256)',
  'function checkAvailability(uint256 _equipmentId, uint256 _startDate, uint256 _endDate) external view returns (bool)',
  'function equipmentRentals(uint256, uint256) view returns (uint256)',
  'function renterRentals(address, uint256) view returns (uint256)',
  'function ownerRentals(address, uint256) view returns (uint256)',
  
  // Fonctions d'écriture
  'function createRental(uint256 _equipmentId, uint256 _startDate, uint256 _endDate) external payable returns (uint256)',
  'function confirmRental(uint256 _rentalId) external',
  'function cancelRental(uint256 _rentalId) external',
  'function confirmReturn(uint256 _rentalId, bool _withoutDamage) external',
  'function claimDeposit(uint256 _rentalId) external',
  'function setServiceFeePercentage(uint256 _percentage) external',
  
  // Événements
  'event RentalCreated(uint256 indexed rentalId, uint256 indexed equipmentId, address indexed renter, uint256 startDate, uint256 endDate, uint256 totalAmount, uint256 deposit)',
  'event RentalConfirmed(uint256 indexed rentalId, uint256 indexed equipmentId, address indexed owner)',
  'event RentalCancelled(uint256 indexed rentalId, uint256 indexed equipmentId, address indexed initiator)',
  'event EquipmentReturned(uint256 indexed rentalId, uint256 indexed equipmentId, address indexed owner)',
  'event DepositReturned(uint256 indexed rentalId, uint256 indexed equipmentId, address indexed renter, uint256 amount)',
  'event ServiceFeeUpdated(uint256 newFeePercentage)',
];

// Fonction pour créer des instances de contrats
export const getContracts = async (provider: ethers.BrowserProvider) => {
  if (!CONTRACT_ADDRESSES.equipmentRegistry || !CONTRACT_ADDRESSES.rentalManager) {
    throw new Error('Contract addresses not configured in environment variables');
  }

  const signer = await provider.getSigner();
  
  const equipmentRegistry = new ethers.Contract(
    CONTRACT_ADDRESSES.equipmentRegistry,
    EQUIPMENT_REGISTRY_ABI,
    signer
  );
  
  const rentalManager = new ethers.Contract(
    CONTRACT_ADDRESSES.rentalManager,
    RENTAL_MANAGER_ABI,
    signer
  );
  
  return {
    equipmentRegistry,
    rentalManager,
  };
}; 