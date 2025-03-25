# Système de Location de Matériel sur Blockchain

Un système décentralisé de location de matériel de construction et d'équipements professionnels basé sur la blockchain. Cette plateforme permet aux propriétaires d'équipements de les proposer à la location, et aux utilisateurs de les louer de manière sécurisée grâce aux smart contracts et au système de cautions automatisé.

## Fonctionnalités

- **Registre d'équipements** : Les propriétaires peuvent enregistrer, mettre à jour et gérer leurs équipements disponibles à la location
- **Gestion des locations** : Création, confirmation et annulation des locations
- **Système de caution** : Cautions gérées par smart contracts pour sécuriser les transactions
- **Partage des frais** : Frais de service configurables prélevés sur chaque transaction (3% par défaut)
- **Vérification de disponibilité** : Contrôle des disponibilités des équipements sur des périodes spécifiques
- **Gestion des conflits** : Permet aux locataires de réclamer leurs cautions après la période de location
- **Interface utilisateur moderne** : Application web responsive avec connexion au portefeuille Ethereum

## Statut du projet

### État actuel

- ✅ Smart contracts développés et testés
- ✅ Tous les tests fonctionnels (20 tests passent avec succès)
- ✅ Système de gestion des équipements et des locations fonctionnel
- ✅ Frontend développé avec Next.js et Ethers.js v6
- ✅ Connectivité avec les portefeuilles Ethereum (MetaMask, Rabby, etc.)
- ✅ Pages principales implémentées (équipements, locations, détails)
- 🔄 Documentation en cours de finalisation

## Architecture technique

Le projet est composé des éléments suivants :

### Smart Contracts

- `EquipmentRegistry.sol` : Gère l'enregistrement et le suivi des équipements
- `RentalManager.sol` : Gère le processus de location, les cautions et les paiements

### Frontend

- **Framework** : Next.js 14 avec App Router
- **Bibliothèque Web3** : ethers.js v6 pour interaction avec la blockchain
- **Styles** : Tailwind CSS pour une interface responsive et moderne
- **État** : Hooks React personnalisés pour gérer la connexion et les contrats
- **Fonctionnalités** :
  - Connexion au portefeuille Ethereum
  - Visualisation des équipements disponibles
  - Système de réservation avec vérification de disponibilité
  - Gestion des locations existantes
  - Affichage des détails et suivi des locations

### Fonctionnement du système

1. Les propriétaires enregistrent leurs équipements avec détails et tarifs journaliers
2. Les utilisateurs peuvent consulter les équipements disponibles et vérifier leur disponibilité
3. Pour louer, l'utilisateur crée une demande de location et dépose le montant (location + caution)
4. Le propriétaire confirme la location et reçoit le paiement (moins les frais de service)
5. À la fin de la période, le propriétaire confirme le retour et évalue l'état du matériel
6. Si l'équipement est retourné en bon état, la caution est remboursée
7. En cas de litige, le locataire peut réclamer sa caution après une période de grâce

## Dépendances techniques

- Solidity ^0.8.19
- Foundry (pour le développement et les tests des smart contracts)
- Next.js 14 (framework frontend)
- Ethers.js v6 (interaction avec la blockchain)
- Tailwind CSS (styles et UI)
- TypeScript (typage statique)

## Installation et développement

### Prérequis

- [Foundry](https://getfoundry.sh/)
- Node.js et npm (pour le frontend)

### Installation et compilation des smart contracts

1. Cloner le repository

```bash
git clone https://github.com/votre-utilisateur/blockchain-renting.git
cd blockchain-renting
```

2. Installer les dépendances et compiler les contrats

```bash
cd contracts
forge install
forge build
```

3. Lancer les tests

```bash
forge test
```

### Installation et lancement du frontend

1. Installer les dépendances

```bash
cd frontend
npm install
```

2. Lancer le serveur de développement

```bash
npm run dev
```

3. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

### Structure des tests

Le projet comprend deux suites de tests principales :

- `EquipmentRegistry.t.sol` : 9 tests qui vérifient les fonctionnalités du registre d'équipements
- `RentalManager.t.sol` : 11 tests qui vérifient le cycle de vie complet d'une location

## Déploiement

### Smart Contracts

1. Configurer le fichier .env

```bash
cp .env.example .env
# Modifier .env avec vos propres clés
```

2. Déployer sur le réseau de test

```bash
forge script contracts/script/Deploy.s.sol --rpc-url <RPC_URL> --private-key <PRIVATE_KEY>
```

### Frontend

1. Construire le frontend pour la production

```bash
cd frontend
npm run build
```

2. Déployer le frontend (exemple avec Vercel)

```bash
npx vercel
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

- [X] Registre d'équipements
- [X] Système de location et cautions
- [X] Tests unitaires complets
- [X] Interface utilisateur de base
- [X] Connectivité avec les portefeuilles Ethereum
- [ ] Système de réputation décentralisé
- [ ] Paiements automatisés via tokens
- [ ] Intégration mobile
- [ ] Audit de sécurité des smart contracts

## Contribuer

Les contributions sont les bienvenues! Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour plus d'informations.

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE.md](LICENSE.md) pour plus de détails.
