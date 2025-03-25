import { ethers } from 'ethers';

// Adresses des contrats (à remplacer par les adresses réelles après déploiement)
export const CONTRACT_ADDRESSES = {
  // Remplacer ces adresses par les adresses réelles après déploiement
  equipmentRegistry: '0x0000000000000000000000000000000000000000',
  rentalManager: '0x0000000000000000000000000000000000000000',
};

// ABIs des contrats (à importer depuis les fichiers générés après compilation)
export const EQUIPMENT_REGISTRY_ABI = [
  // À remplacer par l'ABI réel après compilation
  'function registerEquipment(string memory _name, string memory _description, string memory _imageURI, uint256 _dailyRate) external returns (uint256)',
  'function getEquipment(uint256 _equipmentId) external view returns (tuple(uint256 id, address owner, string name, string description, string imageURI, uint256 dailyRate, bool isAvailable, uint256 createdAt, uint256 updatedAt, bool isDeleted))',
  'function isEquipmentAvailable(uint256 _equipmentId) external view returns (bool)',
  'function getOwnerEquipments(address _owner) external view returns (uint256[] memory)',
  'function updateEquipment(uint256 _equipmentId, string memory _name, string memory _description, string memory _imageURI, uint256 _dailyRate, bool _isAvailable) external',
  'function setEquipmentAvailability(uint256 _equipmentId, bool _isAvailable) external',
  'function removeEquipment(uint256 _equipmentId) external',
];

export const RENTAL_MANAGER_ABI = [
  // À remplacer par l'ABI réel après compilation
  'function createRental(uint256 _equipmentId, uint256 _startDate, uint256 _endDate) external payable returns (uint256)',
  'function confirmRental(uint256 _rentalId) external',
  'function cancelRental(uint256 _rentalId) external',
  'function confirmReturn(uint256 _rentalId, bool _withoutDamage) external',
  'function claimDeposit(uint256 _rentalId) external',
  'function checkAvailability(uint256 _equipmentId, uint256 _startDate, uint256 _endDate) external view returns (bool)',
  'function getRental(uint256 _rentalId) external view returns (tuple(uint256 id, uint256 equipmentId, address renter, address owner, uint256 startDate, uint256 endDate, uint256 dailyRate, uint256 deposit, uint256 totalAmount, bool isActive, bool isReturned, bool isCancelled, bool isDepositReturned, bool isConfirmed, uint256 createdAt, uint256 updatedAt))',
  'function getRenterRentals(address _renter) external view returns (uint256[] memory)',
  'function getOwnerRentals(address _owner) external view returns (uint256[] memory)',
];

// Fonction pour créer des instances de contrats
export const getContracts = async (provider: ethers.BrowserProvider) => {
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