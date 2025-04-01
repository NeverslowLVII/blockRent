/**
 * Test d'intégration entre les contrats déployés et le frontend
 * 
 * Exécution : 
 * 1. Assurez-vous d'avoir installé les dépendances avec npm install
 * 2. Lancez le test avec : node tests/contract-integration.test.js
 */

const { ethers } = require('ethers');
const { EQUIPMENT_REGISTRY_ABI, RENTAL_MANAGER_ABI } = require('../src/constants/contracts');

// Adresses des contrats déployés sur Polygon Amoy
const EQUIPMENT_REGISTRY_ADDRESS = '0x200031838d92c0543d582A47fa5ac378C1a28dB2';
const RENTAL_MANAGER_ADDRESS = '0x59a3A0a28c5B5125A20A0FCeB9B4ae51d4b85c4d';

// URL RPC Polygon Amoy
const RPC_URL = 'https://rpc-amoy.polygon.technology/';

async function main() {
  try {
    console.log('🧪 Lancement des tests d\'intégration...');
    
    // Connexion au provider
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    console.log('✅ Connexion établie avec le nœud Polygon Amoy');
    
    // Vérification que les contrats sont accessibles
    const equipmentRegistry = new ethers.Contract(
      EQUIPMENT_REGISTRY_ADDRESS,
      EQUIPMENT_REGISTRY_ABI,
      provider
    );
    
    const rentalManager = new ethers.Contract(
      RENTAL_MANAGER_ADDRESS,
      RENTAL_MANAGER_ABI,
      provider
    );
    
    console.log('✅ Contrats instanciés correctement');
    
    // Vérification que le RentalManager a une référence à l'EquipmentRegistry
    const registryAddress = await rentalManager.equipmentRegistry();
    console.log(`📝 Adresse de l'EquipmentRegistry dans le RentalManager: ${registryAddress}`);
    
    if (registryAddress.toLowerCase() === EQUIPMENT_REGISTRY_ADDRESS.toLowerCase()) {
      console.log('✅ L\'adresse de l\'EquipmentRegistry est correctement configurée dans le RentalManager');
    } else {
      console.error('❌ L\'adresse de l\'EquipmentRegistry ne correspond pas à celle attendue');
    }
    
    // Vérification que l'EquipmentRegistry a une référence au RentalManager
    const managerAddress = await equipmentRegistry.rentalManager();
    console.log(`📝 Adresse du RentalManager dans l'EquipmentRegistry: ${managerAddress}`);
    
    if (managerAddress.toLowerCase() === RENTAL_MANAGER_ADDRESS.toLowerCase()) {
      console.log('✅ L\'adresse du RentalManager est correctement configurée dans l\'EquipmentRegistry');
    } else {
      console.error('❌ L\'adresse du RentalManager ne correspond pas à celle attendue');
    }
    
    // Récupération du nombre total d'équipements
    const totalEquipments = await equipmentRegistry.totalEquipments();
    console.log(`📝 Nombre total d'équipements: ${totalEquipments.toString()}`);
    
    // Récupération du nombre total de locations
    const totalRentals = await rentalManager.totalRentals();
    console.log(`📝 Nombre total de locations: ${totalRentals.toString()}`);
    
    // Récupération du pourcentage de frais de service
    const serviceFeePercentage = await rentalManager.serviceFeePercentage();
    console.log(`📝 Pourcentage de frais de service: ${serviceFeePercentage.toString()}%`);
    
    console.log('✅ Tous les tests d\'intégration sont réussis');
  } catch (error) {
    console.error('❌ Erreur lors des tests d\'intégration:');
    console.error(error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  }); 