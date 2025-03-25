// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/EquipmentRegistry.sol";
import "../src/RentalManager.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Déploiement du registre d'équipements
        EquipmentRegistry equipmentRegistry = new EquipmentRegistry();
        console.log(unicode"EquipmentRegistry déployé à: ", address(equipmentRegistry));

        // Déploiement du gestionnaire de location
        RentalManager rentalManager = new RentalManager(address(equipmentRegistry));
        console.log(unicode"RentalManager déployé à: ", address(rentalManager));

        // Configuration du RentalManager dans l'EquipmentRegistry
        equipmentRegistry.setRentalManager(address(rentalManager));
        console.log(unicode"RentalManager configuré dans EquipmentRegistry");

        vm.stopBroadcast();
    }
} 