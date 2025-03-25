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
- Composants réutilisables (EquipmentCard, RentalCard, StatusBadge, Button, Loader)

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
│   │   │   ├── layout.tsx  # Layout racine qui utilise le Layout principal
│   │   │   └── providers.tsx # Fournit des contextes à l'application
│   │   ├── components/   # Composants réutilisables
│   │   │   ├── equipments/ # Composants liés aux équipements
│   │   │   ├── rentals/  # Composants liés aux locations
│   │   │   └── ui/       # Composants UI génériques
│   │   │       └── Layout.tsx # Layout principal avec navbar et footer
│   │   ├── lib/          # Bibliothèques et hooks
│   │   ├── types/        # Définitions de types TypeScript
│   │   └── utils/        # Fonctions utilitaires
└── scripts/              # Scripts utilitaires
```

## Structure de l'application

L'application utilise une structure de layout globale qui comprend :

- Un layout principal (`components/ui/Layout.tsx`) qui contient la navbar et le footer
- Ce layout est appliqué à toutes les pages via le `app/layout.tsx`
- Toutes les pages s'affichent à l'intérieur de ce layout

> **Important**: Ne pas inclure le composant Layout.tsx dans d'autres providers ou wrappers pour éviter les duplications de navbar et footer.

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
- ✅ Composants réutilisables pour l'UI (EquipmentCard, RentalCard, StatusBadge, Button, etc.)
- ✅ Pages pour la liste des équipements et la gestion des locations
- ✅ Formatage standardisé des dates, prix et adresses
- ✅ Gestion des états de chargement et des erreurs
- ✅ Build fonctionnel

## Prochaines étapes

- Déploiement sur un testnet Ethereum
- Finalisation de la page détaillée d'un équipement
- Finalisation de la page détaillée d'une location
- Ajout de fonctionnalités avancées (recherche, filtres, avis)
- Implémentation d'un système de notifications
- Optimisation pour mobile

## Contribution

Les contributions sont les bienvenues! Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour plus d'informations.
