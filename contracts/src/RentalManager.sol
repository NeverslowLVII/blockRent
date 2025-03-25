// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./EquipmentRegistry.sol";

/**
 * @title RentalManager
 * @dev Gère les locations d'équipements, les cautions et les paiements
 */
contract RentalManager {
    // Structure de location
    struct Rental {
        uint256 id;
        uint256 equipmentId;
        address renter;
        address owner;
        uint256 startDate;
        uint256 endDate;
        uint256 dailyRate;
        uint256 deposit;
        uint256 totalAmount;
        bool isActive;
        bool isReturned;
        bool isCancelled;
        bool isDepositReturned;
        bool isConfirmed;     // Indique si la location a été confirmée
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    // Référence au contrat de registre d'équipements
    EquipmentRegistry public equipmentRegistry;
    
    // Mapping pour stocker les détails de location
    mapping(uint256 => Rental) public rentals;
    
    // Mapping pour suivre les locations par équipement
    mapping(uint256 => uint256[]) public equipmentRentals;
    
    // Mapping pour suivre les locations par emprunteur
    mapping(address => uint256[]) public renterRentals;
    
    // Mapping pour suivre les locations par propriétaire
    mapping(address => uint256[]) public ownerRentals;
    
    // Compteur de locations
    uint256 public totalRentals;
    
    // Pourcentage de frais de service (en points de base: 100 = 1%)
    uint256 public serviceFeePercentage = 300; // 3% par défaut
    
    // Adresse du propriétaire de la plateforme pour percevoir les frais
    address public platformOwner;
    
    // Événements
    event RentalCreated(uint256 indexed rentalId, uint256 indexed equipmentId, address indexed renter, uint256 startDate, uint256 endDate, uint256 totalAmount, uint256 deposit);
    event RentalConfirmed(uint256 indexed rentalId, uint256 indexed equipmentId, address indexed owner);
    event RentalCancelled(uint256 indexed rentalId, uint256 indexed equipmentId, address indexed initiator);
    event EquipmentReturned(uint256 indexed rentalId, uint256 indexed equipmentId, address indexed owner);
    event DepositReturned(uint256 indexed rentalId, uint256 indexed equipmentId, address indexed renter, uint256 amount);
    event ServiceFeeUpdated(uint256 newFeePercentage);
    
    // Modificateurs
    modifier onlyPlatformOwner() {
        require(msg.sender == platformOwner, unicode"Seul le propriétaire de la plateforme peut effectuer cette action");
        _;
    }
    
    modifier onlyRenter(uint256 _rentalId) {
        require(rentals[_rentalId].renter == msg.sender, unicode"Seul le locataire peut effectuer cette action");
        _;
    }
    
    modifier onlyOwner(uint256 _rentalId) {
        require(rentals[_rentalId].owner == msg.sender, unicode"Seul le propriétaire peut effectuer cette action");
        _;
    }
    
    modifier rentalExists(uint256 _rentalId) {
        require(_rentalId <= totalRentals, unicode"La location n'existe pas");
        _;
    }
    
    modifier rentalIsActive(uint256 _rentalId) {
        require(rentals[_rentalId].isActive, unicode"La location n'est pas active");
        _;
    }
    
    modifier rentalNotReturned(uint256 _rentalId) {
        require(!rentals[_rentalId].isReturned, unicode"L'équipement a déjà été retourné");
        _;
    }
    
    /**
     * @dev Constructeur qui initialise le contrat avec une référence à l'EquipmentRegistry
     * @param _equipmentRegistry Adresse du contrat EquipmentRegistry
     */
    constructor(address _equipmentRegistry) {
        equipmentRegistry = EquipmentRegistry(_equipmentRegistry);
        platformOwner = msg.sender;
    }
    
    // Fallback et Receive pour accepter les paiements
    receive() external payable {}
    fallback() external payable {}
    
    /**
     * @dev Crée une nouvelle demande de location avec dépôt de caution
     * @param _equipmentId ID de l'équipement à louer
     * @param _startDate Date de début de la location (timestamp Unix)
     * @param _endDate Date de fin de la location (timestamp Unix)
     */
    function createRental(uint256 _equipmentId, uint256 _startDate, uint256 _endDate) external payable returns (uint256) {
        // Vérification des paramètres
        require(_endDate > _startDate, unicode"La date de fin doit être postérieure à la date de début");
        require(_startDate >= block.timestamp, unicode"La date de début doit être dans le futur");
        
        // Récupère les détails de l'équipement
        EquipmentRegistry.Equipment memory equipment = equipmentRegistry.getEquipment(_equipmentId);
        
        // Vérifie que l'équipement est disponible
        require(equipment.isAvailable, unicode"L'équipement n'est pas disponible");
        require(equipment.owner != msg.sender, unicode"Vous ne pouvez pas louer votre propre équipement");
        
        // Calcul de la durée en jours (arrondi au jour supérieur)
        uint256 durationInDays = (_endDate - _startDate + 86399) / 86400;
        
        // Calcul du montant total à payer
        uint256 rentalAmount = equipment.dailyRate * durationInDays;
        
        // La caution est égale à deux fois le tarif journalier
        uint256 deposit = equipment.dailyRate * 2;
        
        // Montant total incluant location et caution
        uint256 totalAmount = rentalAmount + deposit;
        
        // Vérifie que l'utilisateur a envoyé suffisamment d'ETH
        require(msg.value >= totalAmount, unicode"Montant insuffisant pour la location et la caution");
        
        // Crée la location
        uint256 rentalId = ++totalRentals;
        
        Rental storage newRental = rentals[rentalId];
        newRental.id = rentalId;
        newRental.equipmentId = _equipmentId;
        newRental.renter = msg.sender;
        newRental.owner = equipment.owner;
        newRental.startDate = _startDate;
        newRental.endDate = _endDate;
        newRental.dailyRate = equipment.dailyRate;
        newRental.deposit = deposit;
        newRental.totalAmount = rentalAmount;
        newRental.isActive = true;
        newRental.isReturned = false;
        newRental.isCancelled = false;
        newRental.isDepositReturned = false;
        newRental.isConfirmed = false;
        newRental.createdAt = block.timestamp;
        newRental.updatedAt = block.timestamp;
        
        // Met à jour les tableaux de suivi
        equipmentRentals[_equipmentId].push(rentalId);
        renterRentals[msg.sender].push(rentalId);
        ownerRentals[equipment.owner].push(rentalId);
        
        // Rend l'équipement indisponible
        equipmentRegistry.setEquipmentAvailability(_equipmentId, false);
        
        // Rembourse l'excédent si l'utilisateur a envoyé trop d'ETH
        if (msg.value > totalAmount) {
            payable(msg.sender).transfer(msg.value - totalAmount);
        }
        
        // Émet l'événement
        emit RentalCreated(rentalId, _equipmentId, msg.sender, _startDate, _endDate, rentalAmount, deposit);
        
        return rentalId;
    }
    
    /**
     * @dev Confirme une location et transfère le paiement au propriétaire (après frais de service)
     * @param _rentalId ID de la location à confirmer
     */
    function confirmRental(uint256 _rentalId) external 
        rentalExists(_rentalId) 
        onlyOwner(_rentalId) 
        rentalIsActive(_rentalId) 
    {
        Rental storage rental = rentals[_rentalId];
        require(!rental.isConfirmed, unicode"Cette location a déjà été confirmée");
        
        // Calcul des frais de service
        uint256 serviceFee = (rental.totalAmount * serviceFeePercentage) / 10000;
        
        // Paiement au propriétaire après déduction des frais de service
        uint256 ownerPayment = rental.totalAmount - serviceFee;
        
        // Transfert au propriétaire
        (bool ownerSuccess, ) = payable(rental.owner).call{value: ownerPayment}("");
        require(ownerSuccess, unicode"Le transfert au propriétaire a échoué");
        
        // Transfert des frais de service au propriétaire de la plateforme
        (bool platformSuccess, ) = payable(platformOwner).call{value: serviceFee}("");
        require(platformSuccess, unicode"Le transfert des frais a échoué");
        
        // Mise à jour du statut
        rental.isConfirmed = true;
        rental.updatedAt = block.timestamp;
        
        emit RentalConfirmed(_rentalId, rental.equipmentId, msg.sender);
    }
    
    /**
     * @dev Annule une location et rembourse le montant total
     * @param _rentalId ID de la location à annuler
     */
    function cancelRental(uint256 _rentalId) external 
        rentalExists(_rentalId) 
        rentalIsActive(_rentalId) 
        rentalNotReturned(_rentalId) 
    {
        Rental storage rental = rentals[_rentalId];
        
        // Seul le locataire ou le propriétaire peut annuler
        require(
            msg.sender == rental.renter || msg.sender == rental.owner,
            unicode"Seul le locataire ou le propriétaire peut annuler la location"
        );
        
        // Si la location n'a pas encore commencé, remboursement complet
        if (block.timestamp < rental.startDate) {
            // Rembourse le montant total + caution au locataire
            (bool success, ) = payable(rental.renter).call{value: rental.totalAmount + rental.deposit}("");
            require(success, unicode"Le remboursement a échoué");
        } else {
            // Si la location a déjà commencé, calcul au prorata
            uint256 durationInDays = (rental.endDate - rental.startDate + 86399) / 86400;
            uint256 elapsedDays = (block.timestamp - rental.startDate + 86399) / 86400;
            
            // Limite les jours écoulés à la durée totale
            if (elapsedDays > durationInDays) {
                elapsedDays = durationInDays;
            }
            
            // Calcul du montant à facturer
            uint256 amountToCharge = rental.dailyRate * elapsedDays;
            
            // Calcul du remboursement
            uint256 refundAmount = rental.totalAmount - amountToCharge;
            
            // Remboursement au locataire
            (bool renterSuccess, ) = payable(rental.renter).call{value: refundAmount + rental.deposit}("");
            require(renterSuccess, unicode"Le remboursement au locataire a échoué");
            
            // Paiement au propriétaire
            uint256 serviceFee = (amountToCharge * serviceFeePercentage) / 10000;
            uint256 ownerPayment = amountToCharge - serviceFee;
            
            (bool ownerSuccess, ) = payable(rental.owner).call{value: ownerPayment}("");
            require(ownerSuccess, unicode"Le paiement au propriétaire a échoué");
            
            (bool platformSuccess, ) = payable(platformOwner).call{value: serviceFee}("");
            require(platformSuccess, unicode"Le paiement des frais de service a échoué");
        }
        
        // Mise à jour du statut
        rental.isActive = false;
        rental.isCancelled = true;
        rental.isDepositReturned = true;
        rental.updatedAt = block.timestamp;
        
        // Rend l'équipement disponible à nouveau
        equipmentRegistry.setEquipmentAvailability(rental.equipmentId, true);
        
        emit RentalCancelled(_rentalId, rental.equipmentId, msg.sender);
    }
    
    /**
     * @dev Marque l'équipement comme retourné par le propriétaire et gère la caution
     * @param _rentalId ID de la location
     * @param _withoutDamage Indique si l'équipement a été retourné sans dommage
     */
    function confirmReturn(uint256 _rentalId, bool _withoutDamage) external 
        rentalExists(_rentalId) 
        onlyOwner(_rentalId) 
        rentalIsActive(_rentalId) 
        rentalNotReturned(_rentalId) 
    {
        Rental storage rental = rentals[_rentalId];
        require(rental.isConfirmed, unicode"La location doit d'abord être confirmée");
        
        // Marque l'équipement comme retourné
        rental.isReturned = true;
        rental.updatedAt = block.timestamp;
        
        // Rend l'équipement disponible à nouveau
        equipmentRegistry.setEquipmentAvailability(rental.equipmentId, true);
        
        // Si retourné sans dommage, rembourse la caution
        if (_withoutDamage) {
            (bool success, ) = payable(rental.renter).call{value: rental.deposit}("");
            require(success, unicode"Le remboursement de la caution a échoué");
            
            rental.isDepositReturned = true;
            
            emit DepositReturned(_rentalId, rental.equipmentId, rental.renter, rental.deposit);
        } else {
            // Sinon, transfère la caution au propriétaire
            (bool success, ) = payable(rental.owner).call{value: rental.deposit}("");
            require(success, unicode"Le transfert de la caution au propriétaire a échoué");
        }
        
        emit EquipmentReturned(_rentalId, rental.equipmentId, msg.sender);
    }
    
    /**
     * @dev Permet au locataire de réclamer sa caution si la location est terminée et que l'équipement n'a pas été marqué comme retourné
     * @param _rentalId ID de la location
     */
    function claimDeposit(uint256 _rentalId) external 
        rentalExists(_rentalId) 
        onlyRenter(_rentalId) 
        rentalIsActive(_rentalId) 
        rentalNotReturned(_rentalId) 
    {
        Rental storage rental = rentals[_rentalId];
        require(rental.isConfirmed, unicode"La location doit d'abord être confirmée");
        
        // Vérifie que la période de location est terminée depuis plus de 3 jours
        require(block.timestamp > rental.endDate + 3 days, unicode"La période de grâce n'est pas encore terminée");
        
        // Rembourse la caution
        (bool success, ) = payable(rental.renter).call{value: rental.deposit}("");
        require(success, unicode"Le remboursement de la caution a échoué");
        
        // Mise à jour du statut
        rental.isReturned = true;
        rental.isDepositReturned = true;
        rental.updatedAt = block.timestamp;
        
        // Rend l'équipement disponible à nouveau
        equipmentRegistry.setEquipmentAvailability(rental.equipmentId, true);
        
        emit DepositReturned(_rentalId, rental.equipmentId, rental.renter, rental.deposit);
        emit EquipmentReturned(_rentalId, rental.equipmentId, rental.owner);
    }
    
    /**
     * @dev Définit le pourcentage de frais de service
     * @param _newFeePercentage Nouveau pourcentage de frais (en points de base)
     */
    function setServiceFeePercentage(uint256 _newFeePercentage) external onlyPlatformOwner {
        require(_newFeePercentage <= 1000, unicode"Les frais ne peuvent pas dépasser 10%");
        serviceFeePercentage = _newFeePercentage;
        emit ServiceFeeUpdated(_newFeePercentage);
    }
    
    /**
     * @dev Récupère toutes les locations d'un équipement spécifique
     * @param _equipmentId ID de l'équipement
     * @return Tableau des IDs de location
     */
    function getEquipmentRentals(uint256 _equipmentId) external view returns (uint256[] memory) {
        return equipmentRentals[_equipmentId];
    }
    
    /**
     * @dev Récupère toutes les locations d'un locataire
     * @param _renter Adresse du locataire
     * @return Tableau des IDs de location
     */
    function getRenterRentals(address _renter) external view returns (uint256[] memory) {
        return renterRentals[_renter];
    }
    
    /**
     * @dev Récupère toutes les locations d'un propriétaire
     * @param _owner Adresse du propriétaire
     * @return Tableau des IDs de location
     */
    function getOwnerRentals(address _owner) external view returns (uint256[] memory) {
        return ownerRentals[_owner];
    }
    
    /**
     * @dev Vérifie si un équipement est disponible à la location pour une période donnée
     * @param _equipmentId ID de l'équipement
     * @param _startDate Date de début proposée
     * @param _endDate Date de fin proposée
     * @return Disponibilité de l'équipement pour la période donnée
     */
    function checkAvailability(uint256 _equipmentId, uint256 _startDate, uint256 _endDate) external view returns (bool) {
        // Vérifie d'abord si l'équipement est marqué comme disponible dans le registre
        bool isAvailable = equipmentRegistry.isEquipmentAvailable(_equipmentId);
        
        if (!isAvailable) {
            return false;
        }
        
        // Vérifie s'il n'y a pas de chevauchement avec les locations existantes
        uint256[] memory equipRentals = equipmentRentals[_equipmentId];
        
        for (uint256 i = 0; i < equipRentals.length; i++) {
            Rental memory rental = rentals[equipRentals[i]];
            
            // Ignore les locations annulées ou terminées
            if (rental.isCancelled || rental.isReturned) {
                continue;
            }
            
            // Vérifie le chevauchement
            if ((_startDate <= rental.endDate) && (_endDate >= rental.startDate)) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * @dev Récupère les détails d'une location
     * @param _rentalId ID de la location
     * @return Les détails de la location
     */
    function getRental(uint256 _rentalId) external view rentalExists(_rentalId) returns (Rental memory) {
        return rentals[_rentalId];
    }
} 