# Blockchain Renting Platform

Un projet décentralisé de location d'équipements basé sur la blockchain Ethereum.

## Composants du projet

### Smart Contracts
- **EquipmentRegistry.sol**: Gestion de l'enregistrement et du suivi des équipements
- **RentalManager.sol**: Gestion du processus de location (création, confirmation, retour)

### Frontend (Next.js)
- Interface utilisateur moderne avec Tailwind CSS
- Intégration avec ethers.js pour interagir avec les smart contracts
- Pages pour consulter les équipements disponibles et gérer les locations

## Structure du projet

```
blockchain-renting/
├── contracts/            # Smart contracts Solidity
│   ├── src/              # Code source des contrats
│   ├── test/             # Tests des contrats
│   └── script/           # Scripts de déploiement
├── frontend/             # Application frontend Next.js
│   ├── src/              # Code source frontend
│   │   ├── app/          # Pages et composants de l'application
│   │   └── lib/          # Bibliothèques et hooks
└── scripts/              # Scripts utilitaires
```

## Fonctionnalités

- Enregistrement d'équipements par les propriétaires
- Création et gestion des locations
- Paiements automatisés via smart contracts
- Système de caution sécurisé
- Interface utilisateur intuitive

## Technologies utilisées

- **Smart Contracts**: Solidity, Foundry
- **Frontend**: Next.js, ethers.js, Tailwind CSS
- **Tests**: Forge (Foundry)
- **Déploiement**: Scripts Foundry

## Installation

### Prérequis
- Node.js et npm
- Foundry (pour les smart contracts)
- Un portefeuille Ethereum (Rabby, MetaMask, etc.)

### Installation des dépendances

```bash
# Pour les smart contracts
cd contracts
forge install

# Pour le frontend
cd frontend
npm install
```

## Développement

### Smart Contracts

```bash
cd contracts
forge test         # Exécuter les tests
forge build        # Compiler les contrats
```

### Frontend

```bash
cd frontend
npm run dev        # Démarrer le serveur de développement
npm run build      # Construire pour la production
```

## État actuel du projet

- ✅ Smart contracts développés et testés
- ✅ Frontend de base avec Next.js
- ✅ Intégration avec ethers.js
- ✅ Pages pour la liste des équipements et la gestion des locations
- ✅ Build fonctionnel

## Prochaines étapes

- Déploiement sur un testnet Ethereum
- Ajout de fonctionnalités avancées (recherche, filtres, avis)
- Implémentation d'un système de notifications
- Optimisation pour mobile

## Contribution

Les contributions sont les bienvenues! Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour plus d'informations.
