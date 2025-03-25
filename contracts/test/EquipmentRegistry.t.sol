// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import "../src/EquipmentRegistry.sol";

contract EquipmentRegistryTest is Test {
    EquipmentRegistry public equipmentRegistry;
    
    address public owner = address(1);
    address public nonOwner = address(2);
    
    uint256 public constant INITIAL_BALANCE = 10 ether;
    
    event EquipmentRegistered(uint256 indexed id, address indexed owner, string name, uint256 dailyRate);
    event EquipmentUpdated(uint256 indexed id, address indexed owner, bool isAvailable, uint256 dailyRate);
    event EquipmentRemoved(uint256 indexed id, address indexed owner);

    function setUp() public {
        // Fund accounts
        vm.deal(owner, INITIAL_BALANCE);
        vm.deal(nonOwner, INITIAL_BALANCE);
        
        // Deploy contract
        equipmentRegistry = new EquipmentRegistry();
    }

    function testRegisterEquipment() public {
        vm.startPrank(owner);
        
        string memory name = "Excavatrice JCB";
        string memory description = "Excavatrice professionnelle pour travaux de construction";
        string memory imageUrl = "https://example.com/excavator.jpg";
        uint256 dailyRate = 0.5 ether;
        
        // Check event emission (les paramètres exacts de l'événement peuvent varier)
        vm.expectEmit(true, true, false, true);
        emit EquipmentRegistered(1, owner, name, dailyRate);
        
        // Register equipment
        uint256 equipmentId = equipmentRegistry.registerEquipment(
            name,
            description,
            imageUrl,
            dailyRate
        );
        
        // Verify equipment data
        EquipmentRegistry.Equipment memory equipment = equipmentRegistry.getEquipment(equipmentId);
        
        assertEq(equipment.owner, owner);
        assertEq(equipment.name, name);
        assertEq(equipment.description, description);
        assertEq(equipment.imageURI, imageUrl);
        assertEq(equipment.dailyRate, dailyRate);
        assertTrue(equipment.isAvailable);
        
        vm.stopPrank();
    }

    function testGetOwnerEquipments() public {
        // Register several pieces of equipment
        vm.startPrank(owner);
        
        uint256 id1 = equipmentRegistry.registerEquipment(
            "Excavatrice JCB",
            "Excavatrice professionnelle",
            "https://example.com/excavator.jpg",
            0.5 ether
        );
        
        uint256 id2 = equipmentRegistry.registerEquipment(
            "Tractopelle CAT",
            "Tractopelle performance",
            "https://example.com/backhoe.jpg",
            0.7 ether
        );
        
        uint256 id3 = equipmentRegistry.registerEquipment(
            unicode"Bétonnière",
            unicode"Bétonnière électrique 250L",
            "https://example.com/mixer.jpg",
            0.2 ether
        );
        
        vm.stopPrank();
        
        // Register equipment from another account
        vm.startPrank(nonOwner);
        equipmentRegistry.registerEquipment(
            unicode"Échafaudage",
            unicode"Échafaudage 10m",
            "https://example.com/scaffold.jpg",
            0.3 ether
        );
        vm.stopPrank();
        
        // Get owner's equipment list
        uint256[] memory ownerEquipment = equipmentRegistry.getOwnerEquipments(owner);
        
        // Verify the correct equipment is returned
        assertEq(ownerEquipment.length, 3);
        assertEq(ownerEquipment[0], id1);
        assertEq(ownerEquipment[1], id2);
        assertEq(ownerEquipment[2], id3);
    }

    function testUpdateEquipment() public {
        // First register equipment
        vm.startPrank(owner);
        
        uint256 equipmentId = equipmentRegistry.registerEquipment(
            "Excavatrice JCB",
            "Excavatrice professionnelle",
            "https://example.com/excavator.jpg",
            0.5 ether
        );
        
        // New data for update
        string memory newName = "Excavatrice JCB Pro";
        string memory newDescription = unicode"Excavatrice professionnelle mise à jour";
        string memory newImageUrl = "https://example.com/excavator_pro.jpg";
        uint256 newDailyRate = 0.6 ether;
        bool isAvailable = true;
        
        // Check event emission
        vm.expectEmit(true, true, false, true);
        emit EquipmentUpdated(equipmentId, owner, isAvailable, newDailyRate);
        
        // Update equipment
        equipmentRegistry.updateEquipment(
            equipmentId,
            newName,
            newDescription,
            newImageUrl,
            newDailyRate,
            isAvailable
        );
        
        // Verify updated data
        EquipmentRegistry.Equipment memory equipment = equipmentRegistry.getEquipment(equipmentId);
        
        assertEq(equipment.name, newName);
        assertEq(equipment.description, newDescription);
        assertEq(equipment.imageURI, newImageUrl);
        assertEq(equipment.dailyRate, newDailyRate);
        
        vm.stopPrank();
    }

    function testCannotUpdateEquipmentIfNotOwner() public {
        // First register equipment
        vm.startPrank(owner);
        uint256 equipmentId = equipmentRegistry.registerEquipment(
            "Excavatrice JCB",
            "Excavatrice professionnelle",
            "https://example.com/excavator.jpg",
            0.5 ether
        );
        vm.stopPrank();
        
        // Try to update as non-owner
        vm.startPrank(nonOwner);
        vm.expectRevert(unicode"Vous n'êtes pas le propriétaire");
        equipmentRegistry.updateEquipment(
            equipmentId,
            unicode"Nom modifié",
            unicode"Description modifiée",
            "https://example.com/new.jpg",
            0.6 ether,
            true
        );
        vm.stopPrank();
    }

    function testSetEquipmentAvailability() public {
        // First register equipment
        vm.startPrank(owner);
        uint256 equipmentId = equipmentRegistry.registerEquipment(
            "Excavatrice JCB",
            "Excavatrice professionnelle",
            "https://example.com/excavator.jpg",
            0.5 ether
        );
        
        // Set equipment availability to false
        equipmentRegistry.setEquipmentAvailability(equipmentId, false);
        
        // Verify equipment is not available
        EquipmentRegistry.Equipment memory equipment = equipmentRegistry.getEquipment(equipmentId);
        assertFalse(equipment.isAvailable);
        
        vm.stopPrank();
    }

    function testCannotSetAvailabilityIfNotOwner() public {
        // First register equipment
        vm.startPrank(owner);
        uint256 equipmentId = equipmentRegistry.registerEquipment(
            "Excavatrice JCB",
            "Excavatrice professionnelle",
            "https://example.com/excavator.jpg",
            0.5 ether
        );
        vm.stopPrank();
        
        // Try to set availability as non-owner
        vm.startPrank(nonOwner);
        vm.expectRevert(unicode"Vous n'êtes pas le propriétaire ou le gestionnaire de location");
        equipmentRegistry.setEquipmentAvailability(equipmentId, false);
        vm.stopPrank();
    }

    function testRemoveEquipment() public {
        // First register equipment
        vm.startPrank(owner);
        uint256 equipmentId = equipmentRegistry.registerEquipment(
            "Excavatrice JCB",
            "Excavatrice professionnelle",
            "https://example.com/excavator.jpg",
            0.5 ether
        );
        
        // Check event emission
        vm.expectEmit(true, true, false, false);
        emit EquipmentRemoved(equipmentId, owner);
        
        // Remove equipment
        equipmentRegistry.removeEquipment(equipmentId);
        
        // Attempting to get removed equipment should revert
        vm.expectRevert(unicode"L'équipement a été supprimé");
        equipmentRegistry.getEquipment(equipmentId);
        
        vm.stopPrank();
    }

    function testIsEquipmentAvailable() public {
        // First register equipment
        vm.startPrank(owner);
        uint256 equipmentId = equipmentRegistry.registerEquipment(
            "Excavatrice JCB",
            "Excavatrice professionnelle",
            "https://example.com/excavator.jpg",
            0.5 ether
        );
        
        // By default, equipment should be available
        bool isAvailable = equipmentRegistry.isEquipmentAvailable(equipmentId);
        assertTrue(isAvailable);
        
        // Set equipment to unavailable
        equipmentRegistry.setEquipmentAvailability(equipmentId, false);
        
        // Check equipment is now unavailable
        isAvailable = equipmentRegistry.isEquipmentAvailable(equipmentId);
        assertFalse(isAvailable);
        
        vm.stopPrank();
    }

    function testGetNonexistentEquipment() public {
        // Try to get nonexistent equipment
        vm.expectRevert(unicode"L'équipement n'existe pas");
        equipmentRegistry.getEquipment(999);
    }
} 