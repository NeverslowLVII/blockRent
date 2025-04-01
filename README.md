# Blockchain Renting Platform

Un projet décentralisé de location d'équipements basé sur la blockchain Ethereum.

## Réseau requis: Polygon Amoy Testnet

Cette application fonctionne exclusivement sur le réseau **Polygon Amoy Testnet**. Assurez-vous d'avoir:

1. Un portefeuille compatible Ethereum (Rabby, MetaMask, etc.)
2. Le réseau Polygon Amoy configuré dans votre portefeuille
3. Des tokens POL de test pour les transactions

### Configuration manuelle du réseau Polygon Amoy

Si votre portefeuille ne reconnaît pas automatiquement le réseau Polygon Amoy, ajoutez-le manuellement avec ces paramètres:

```
Nom du réseau: Polygon Amoy Testnet
URL RPC: https://rpc-amoy.polygon.technology
ID de chaîne: 80002
Symbole: POL
Explorateur de blocs: https://amoy.polygonscan.com/
```

> **Note pour les utilisateurs de Rabby**: Ces paramètres ont été testés et fonctionnent spécifiquement avec Rabby. Si vous rencontrez des problèmes, assurez-vous d'utiliser exactement ces valeurs.

### Obtenir des POL de test

Visitez le faucet officiel: https://amoy.polygonscan.com/faucet

## Composants du projet

### Smart Contracts

- **EquipmentRegistry.sol**: Gestion de l'enregistrement et du suivi des équipements
- **RentalManager.sol**: Gestion du processus de location (création, confirmation, retour)

### Frontend (Next.js)

- Interface utilisateur moderne et ludique avec Tailwind CSS
- Animations fluides avec Framer Motion
- Intégration avec ethers.js pour interagir avec les smart contracts
- Design réactif et interactif avec des dégradés et effets visuels
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

## Expérience utilisateur

L'interface a été conçue pour être à la fois fonctionnelle et ludique :

- **Animations réactives** : Les éléments réagissent aux interactions avec des animations fluides
- **Design visuel moderne** : Utilisation de dégradés, d'effets de hover et de transitions
- **Expérience interactive** : Les composants réagissent visuellement aux actions de l'utilisateur
- **Navigation simplifiée** : Menus adaptés aux formats mobile et desktop
- **Retours visuels** : Badges animés, loader personnalisé et transitions entre les états

## Fonctionnalités

- Enregistrement d'équipements par les propriétaires
- Création et gestion des locations
- Paiements automatisés via smart contracts
- Système de caution sécurisé
- Interface utilisateur intuitive

## Technologies utilisées

- **Smart Contracts**: Solidity, Foundry
- **Frontend**: Next.js, ethers.js, Tailwind CSS, Framer Motion
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

## Déploiement

### Déploiement des Smart Contracts sur Polygon Amoy Testnet

1. **Configurer le fichier .env**

   Copiez le fichier `.env.example` en `.env` et complétez les informations suivantes:

   ```
   PRIVATE_KEY=votre_clé_privée_sans_0x
   POLYGONSCAN_API_KEY=votre_clé_api_polygonscan (optionnel pour la vérification des contrats)
   ```
2. **Déployer les contrats**

   ```bash
   cd contracts
   forge script script/Deploy.s.sol --rpc-url polygon_amoy --broadcast --verify
   ```
3. **Mettre à jour les adresses des contrats**

   Une fois le déploiement réussi, notez les adresses des contrats déployés et mettez-les à jour dans le fichier `frontend/src/constants/contracts.ts` :

   ```typescript
   export const CONTRACT_ADDRESSES: Record<number, ContractAddresses> = {
     // Polygon Amoy (Testnet)
     80002: {
       equipmentRegistry: '0x...', // Adresse obtenue lors du déploiement
       rentalManager: '0x...',      // Adresse obtenue lors du déploiement
     },
     // ...
   };
   ```

### Déploiement du Frontend sur Vercel

1. **Connecter votre compte GitHub à Vercel**
2. **Importer le projet**

   Dans le dashboard Vercel, cliquez sur "Add New..." puis "Project" et sélectionnez votre dépôt GitHub.
3. **Configurer le projet**

   - Dossier racine: `frontend`
   - Commande de build: `npm run build`
   - Dossier de sortie: `.next`
4. **Variables d'environnement**

   Ajoutez les variables d'environnement nécessaires dans les paramètres du projet Vercel:

   ```
   NEXT_PUBLIC_CHAIN_ID=80002
   NEXT_PUBLIC_NETWORK_NAME="Polygon Amoy"
   ```
5. **Déployer**

   Cliquez sur "Deploy" et attendez que le déploiement soit terminé.

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
- ✅ Animations et transitions fluides avec Framer Motion
- ✅ Design réactif et ludique
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

## Déploiement des Smart Contracts

### Prérequis
- Un wallet Rabby configuré pour Polygon Amoy
- Des tokens POL de test (obtenus via le faucet Polygon Amoy)
- Une clé API Polygonscan (pour la vérification des contrats)

### Configuration de l'environnement
1. Copiez le fichier `.env.example` vers `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configurez les variables suivantes dans le fichier `.env`:
   - `PRIVATE_KEY`: Votre clé privée (sans le préfixe 0x)
   - `POLYGONSCAN_API_KEY`: Votre clé API Polygonscan
   - `POLYGON_AMOY_RPC_URL`: L'URL RPC de Polygon Amoy

### Déploiement sécurisé
1. Assurez-vous d'être dans le répertoire `contracts`
2. Rendez le script de déploiement exécutable:
   ```bash
   chmod +x scripts/deploy.sh
   ```
3. Exécutez le script de déploiement:
   ```bash
   ./scripts/deploy.sh
   ```

### Sécurité
- Ne partagez JAMAIS votre clé privée
- N'utilisez que des wallets de test pour le développement
- Changez immédiatement votre clé privée si elle est exposée
- Ne committez jamais le fichier `.env` dans le dépôt Git
