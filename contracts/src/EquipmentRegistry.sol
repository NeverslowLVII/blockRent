// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title RegistreEquipement
 * @dev Gère l'enregistrement et le suivi des équipements disponibles à la location
 */
contract EquipmentRegistry {
    struct Equipment {
        uint256 id;
        address owner;
        string name;
        string description;
        string imageURI;
        uint256 dailyRate;
        bool isAvailable;
        uint256 createdAt;
        uint256 updatedAt;
        bool isDeleted;
    }

    // ID de l'équipement => détails de l'équipement
    mapping(uint256 => Equipment) public equipments;
    
    // Adresse du propriétaire => tableau des IDs d'équipement
    mapping(address => uint256[]) public ownerEquipments;
    
    // Nombre total d'équipements enregistrés
    uint256 public totalEquipments;

    // Adresse autorisée à gérer les locations (RentalManager)
    address public rentalManager;

    // Événements
    event EquipmentRegistered(uint256 indexed id, address indexed owner, string name, uint256 dailyRate);
    event EquipmentUpdated(uint256 indexed id, address indexed owner, bool isAvailable, uint256 dailyRate);
    event EquipmentRemoved(uint256 indexed id, address indexed owner);
    event RentalManagerSet(address indexed oldManager, address indexed newManager);

    // Modificateur pour vérifier si l'expéditeur est le gestionnaire de location autorisé
    modifier onlyRentalManager() {
        require(msg.sender == rentalManager, unicode"Seul le gestionnaire de location peut effectuer cette action");
        _;
    }

    /**
     * @dev Définit l'adresse du gestionnaire de location
     * @param _rentalManager Adresse du contrat RentalManager
     */
    function setRentalManager(address _rentalManager) external {
        address oldManager = rentalManager;
        rentalManager = _rentalManager;
        emit RentalManagerSet(oldManager, _rentalManager);
    }

    /**
     * @dev Enregistre un nouvel équipement
     * @param _name Nom de l'équipement
     * @param _description Description de l'équipement
     * @param _imageURI URI de l'image de l'équipement
     * @param _dailyRate Tarif journalier en wei
     */
    function registerEquipment(
        string memory _name,
        string memory _description,
        string memory _imageURI,
        uint256 _dailyRate
    ) external returns (uint256) {
        require(bytes(_name).length > 0, unicode"Le nom ne peut pas être vide");
        require(_dailyRate > 0, unicode"Le tarif journalier doit être supérieur à 0");

        uint256 equipmentId = totalEquipments + 1;
        
        equipments[equipmentId] = Equipment({
            id: equipmentId,
            owner: msg.sender,
            name: _name,
            description: _description,
            imageURI: _imageURI,
            dailyRate: _dailyRate,
            isAvailable: true,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            isDeleted: false
        });
        
        ownerEquipments[msg.sender].push(equipmentId);
        totalEquipments = equipmentId;
        
        emit EquipmentRegistered(equipmentId, msg.sender, _name, _dailyRate);
        
        return equipmentId;
    }

    /**
     * @dev Met à jour les détails d'un équipement
     * @param _equipmentId ID de l'équipement
     * @param _name Nom mis à jour
     * @param _description Description mise à jour
     * @param _imageURI URI de l'image mise à jour
     * @param _dailyRate Tarif journalier mis à jour
     * @param _isAvailable Statut de disponibilité mis à jour
     */
    function updateEquipment(
        uint256 _equipmentId,
        string memory _name,
        string memory _description,
        string memory _imageURI,
        uint256 _dailyRate,
        bool _isAvailable
    ) external {
        require(_equipmentId <= totalEquipments, unicode"L'équipement n'existe pas");
        require(equipments[_equipmentId].owner == msg.sender, unicode"Vous n'êtes pas le propriétaire");
        require(bytes(_name).length > 0, unicode"Le nom ne peut pas être vide");
        require(_dailyRate > 0, unicode"Le tarif journalier doit être supérieur à 0");
        
        Equipment storage equipment = equipments[_equipmentId];
        
        equipment.name = _name;
        equipment.description = _description;
        equipment.imageURI = _imageURI;
        equipment.dailyRate = _dailyRate;
        equipment.isAvailable = _isAvailable;
        equipment.updatedAt = block.timestamp;
        
        emit EquipmentUpdated(_equipmentId, msg.sender, _isAvailable, _dailyRate);
    }

    /**
     * @dev Définit la disponibilité d'un équipement
     * @param _equipmentId ID de l'équipement
     * @param _isAvailable Nouveau statut de disponibilité
     */
    function setEquipmentAvailability(uint256 _equipmentId, bool _isAvailable) external {
        require(_equipmentId <= totalEquipments, unicode"L'équipement n'existe pas");
        require(
            equipments[_equipmentId].owner == msg.sender || msg.sender == rentalManager,
            unicode"Vous n'êtes pas le propriétaire ou le gestionnaire de location"
        );
        
        equipments[_equipmentId].isAvailable = _isAvailable;
        equipments[_equipmentId].updatedAt = block.timestamp;
        
        emit EquipmentUpdated(_equipmentId, equipments[_equipmentId].owner, _isAvailable, equipments[_equipmentId].dailyRate);
    }

    /**
     * @dev Supprime un équipement du registre
     * @param _equipmentId ID de l'équipement à supprimer
     */
    function removeEquipment(uint256 _equipmentId) external {
        require(_equipmentId <= totalEquipments, unicode"L'équipement n'existe pas");
        require(equipments[_equipmentId].owner == msg.sender, unicode"Vous n'êtes pas le propriétaire");
        require(!equipments[_equipmentId].isDeleted, unicode"L'équipement a déjà été supprimé");
        
        equipments[_equipmentId].isAvailable = false;
        equipments[_equipmentId].isDeleted = true;
        equipments[_equipmentId].updatedAt = block.timestamp;
        
        emit EquipmentRemoved(_equipmentId, msg.sender);
    }

    /**
     * @dev Vérifie si un équipement est disponible à la location
     * @param _equipmentId ID de l'équipement
     * @return bool indiquant si l'équipement est disponible
     */
    function isEquipmentAvailable(uint256 _equipmentId) external view returns (bool) {
        require(_equipmentId <= totalEquipments, unicode"L'équipement n'existe pas");
        return equipments[_equipmentId].isAvailable;
    }

    /**
     * @dev Obtient les détails d'un équipement
     * @param _equipmentId ID de l'équipement
     * @return Détails de l'équipement
     */
    function getEquipment(uint256 _equipmentId) external view returns (Equipment memory) {
        require(_equipmentId <= totalEquipments, unicode"L'équipement n'existe pas");
        require(!equipments[_equipmentId].isDeleted, unicode"L'équipement a été supprimé");
        return equipments[_equipmentId];
    }

    /**
     * @dev Obtient tous les IDs des équipements possédés par une adresse
     * @param _owner Adresse du propriétaire
     * @return Tableau des IDs d'équipement
     */
    function getOwnerEquipments(address _owner) external view returns (uint256[] memory) {
        return ownerEquipments[_owner];
    }
} 