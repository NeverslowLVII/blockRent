# Système de Location de Matériel sur Blockchain

Un système décentralisé de location de matériel de construction et d'équipements professionnels basé sur la blockchain. Cette plateforme permet aux propriétaires d'équipements de les proposer à la location, et aux utilisateurs de les louer de manière sécurisée grâce aux smart contracts et au système de cautions automatisé.

## Fonctionnalités

- **Registre d'équipements** : Les propriétaires peuvent enregistrer, mettre à jour et gérer leurs équipements disponibles à la location
- **Gestion des locations** : Création, confirmation et annulation des locations
- **Système de caution** : Cautions gérées par smart contracts pour sécuriser les transactions
- **Partage des frais** : Frais de service configurables prélevés sur chaque transaction (3% par défaut)
- **Vérification de disponibilité** : Contrôle des disponibilités des équipements sur des périodes spécifiques
- **Gestion des conflits** : Permet aux locataires de réclamer leurs cautions après la période de location

## Statut du projet

### État actuel
- ✅ Smart contracts développés et testés
- ✅ Tous les tests fonctionnels (20 tests passent avec succès)
- ✅ Système de gestion des équipements et des locations fonctionnel
- 🔄 Frontend en développement
- 🔄 Documentation en cours de finalisation

## Architecture technique

Le projet est composé des éléments suivants :

### Smart Contracts

- `EquipmentRegistry.sol` : Gère l'enregistrement et le suivi des équipements
- `RentalManager.sol` : Gère le processus de location, les cautions et les paiements

### Fonctionnement du système

1. Les propriétaires enregistrent leurs équipements avec détails et tarifs journaliers
2. Les utilisateurs peuvent consulter les équipements disponibles et vérifier leur disponibilité
3. Pour louer, l'utilisateur crée une demande de location et dépose le montant (location + caution)
4. Le propriétaire confirme la location et reçoit le paiement (moins les frais de service)
5. À la fin de la période, le propriétaire confirme le retour et évalue l'état du matériel
6. Si l'équipement est retourné en bon état, la caution est remboursée
7. En cas de litige, le locataire peut réclamer sa caution après une période de grâce

### Frontend (en développement)

- Application web pour interagir avec les smart contracts
- Interface utilisateur pour propriétaires et locataires

## Dépendances techniques

- Solidity ^0.8.19
- Foundry (pour le développement et les tests)
- Web3.js / Ethers.js (pour l'interaction frontend)

## Installation et développement

### Prérequis

- [Foundry](https://getfoundry.sh/)
- Node.js et npm (pour le frontend)

### Installation

1. Cloner le repository
```bash
git clone https://github.com/votre-utilisateur/blockchain-renting.git
cd blockchain-renting
```

2. Installer les dépendances
```bash
forge install
```

3. Compiler les contrats
```bash
cd contracts
forge build
```

4. Lancer les tests
```bash
forge test
```

### Structure des tests

Le projet comprend deux suites de tests principales :
- `EquipmentRegistry.t.sol` : 9 tests qui vérifient les fonctionnalités du registre d'équipements
- `RentalManager.t.sol` : 11 tests qui vérifient le cycle de vie complet d'une location

Tous les tests sont passants et couvrent les scénarios suivants :
- Enregistrement et gestion des équipements
- Création et gestion des locations
- Confirmation et annulation des locations
- Retour d'équipement avec ou sans dommages
- Réclamation de caution
- Vérification de disponibilité

## Déploiement

1. Configurer le fichier .env
```bash
cp .env.example .env
# Modifier .env avec vos propres clés
```

2. Déployer sur le réseau de test
```bash
forge script contracts/script/Deploy.s.sol --rpc-url <RPC_URL> --private-key <PRIVATE_KEY>
```

## Interfaces utilisateur

### Pour les propriétaires d'équipements
- Enregistrer de nouveaux équipements
- Gérer les équipements existants
- Confirmer les locations
- Gérer les retours et évaluer l'état des équipements

### Pour les locataires
- Parcourir les équipements disponibles
- Créer des demandes de location
- Payer les locations et cautions
- Récupérer les cautions après retour

## Roadmap

- [x] Registre d'équipements
- [x] Système de location et cautions
- [x] Tests unitaires complets
- [ ] Système de réputation décentralisé
- [ ] Paiements automatisés via tokens
- [ ] Interface utilisateur complète
- [ ] Intégration mobile
- [ ] Audit de sécurité des smart contracts

## Contribuer

Les contributions sont les bienvenues! Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour plus d'informations.

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE.md](LICENSE.md) pour plus de détails.
