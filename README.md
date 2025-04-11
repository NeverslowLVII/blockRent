# 🏗️ BlockRent - Location d'équipements décentralisée

![Polygon Amoy](https://img.shields.io/badge/Polygon-Amoy_Testnet-8247E5?style=for-the-badge&logo=polygon&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-13.4+-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-0.8.19-363636?style=for-the-badge&logo=solidity&logoColor=white)
![ethers.js](https://img.shields.io/badge/ethers.js-6.0-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

> 🚀 **Location P2P sans intermédiaire, propulsée par la blockchain**

BlockRent révolutionne la location d'équipements en connectant directement propriétaires et locataires grâce à la technologie blockchain. Fini les intermédiaires coûteux, les délais de paiement et les procédures compliquées : louez en quelques clics, avec des garanties automatisées et une transparence totale !

![Demo BlockRent](https://github.com/NeverslowLVII/blockRent/raw/master/docs/preview.png)

## ✨ Caractéristiques Principales

- **💸 Zéro Commission** - Transactions directes entre particuliers
- **🔒 Cautions Sécurisées** - Verrouillées dans des smart contracts, pas dans la poche de quelqu'un
- **⚡ Paiements Instantanés** - Fini l'attente de 3-5 jours pour les remboursements
- **👁️ Transparence Totale** - Toutes les transactions sont visibles sur la blockchain
- **🌐 Interface Intuitive** - Une expérience utilisateur moderne et fluide
- **📱 Responsive Design** - Parfaitement optimisé pour mobile, tablette et desktop

## 🔧 Technologie

BlockRent combine des technologies de pointe pour offrir une expérience de location sans friction :

- **Frontend** : Next.js, TailwindCSS, Framer Motion
- **Blockchain** : Polygon Amoy Testnet, Solidity, ethers.js
- **UX/UI** : Animations fluides, design intuitif, feedback instantané

## 🏄‍♂️ Comment ça marche ?

### 1. Trouvez votre bonheur
Parcourez notre galerie d'équipements et trouvez exactement ce dont vous avez besoin !

### 2. Réservez en 2 clics
Choisissez vos dates et payez en ETH, rapidement, simplement et sans paperasse !

### 3. Profitez et rendez !
Amusez-vous avec l'équipement, puis retournez-le pour récupérer automatiquement votre caution. Magie !

## 📋 Réseau requis: Polygon Amoy Testnet

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

## 🏛️ Architecture du projet

### Smart Contracts

- **EquipmentRegistry.sol**: Gestion de l'enregistrement et du suivi des équipements
- **RentalManager.sol**: Gestion du processus de location (création, confirmation, retour)

### Frontend (Next.js)

- Interface utilisateur moderne avec Tailwind CSS et Framer Motion
- Intégration avec ethers.js pour interagir avec les smart contracts
- Composants réutilisables et optimisés pour les performances

## 📁 Structure du projet

```
blockchain-renting/
├── contracts/            # Smart contracts Solidity
│   ├── src/              # Code source des contrats
│   ├── test/             # Tests des contrats
│   └── script/           # Scripts de déploiement
├── frontend/             # Application frontend Next.js
│   ├── src/              # Code source frontend
│   │   ├── app/          # Pages et composants de l'application
│   │   ├── components/   # Composants réutilisables
│   │   ├── lib/          # Bibliothèques et hooks
│   │   ├── types/        # Définitions de types TypeScript
│   │   └── utils/        # Fonctions utilitaires
└── scripts/              # Scripts utilitaires
```

## 🚀 Installation

### Prérequis

- Node.js (v16+) et npm
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

## 🛠️ Développement

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

## 🌐 Déploiement

### Déploiement des Smart Contracts sur Polygon Amoy Testnet

1. **Configurer le fichier .env**

   Copiez le fichier `.env.example` en `.env` et complétez les informations:

   ```
   PRIVATE_KEY=votre_clé_privée_sans_0x
   POLYGONSCAN_API_KEY=votre_clé_api_polygonscan
   ```
2. **Déployer les contrats**

   ```bash
   cd contracts
   forge script script/Deploy.s.sol --rpc-url polygon_amoy --broadcast --verify
   ```
3. **Mettre à jour les adresses des contrats**

   Mettez à jour les adresses dans `frontend/src/lib/contracts/config.ts`

### Déploiement du Frontend

#### Vercel (recommandé)

1. Connectez votre dépôt GitHub à Vercel
2. Configurez le répertoire du projet (`frontend`)
3. Définissez les variables d'environnement:
   ```
   NEXT_PUBLIC_CHAIN_ID=80002
   NEXT_PUBLIC_NETWORK_NAME="Polygon Amoy"
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anonyme_supabase
   ```
4. Déployez!

## 🤝 Contribution

Les contributions sont les bienvenues! Proposez des améliorations via des pull requests ou signalez des problèmes dans les issues GitHub.

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE.md pour plus de détails.

---

Développé avec ❤️ par [Sofiane Benzaied](https://github.com/NeverslowLVII)
