## BlockRent - Smart Contracts

**Ce dossier contient les smart contracts pour la plateforme BlockRent, une application de location d'équipements décentralisée.**

Les contrats sont développés avec Foundry, un toolkit modulaire pour le développement d'applications Ethereum écrit en Rust.

## Contrats principaux

- **EquipmentRegistry.sol**: Gestion de l'enregistrement et du suivi des équipements
- **RentalManager.sol**: Gestion du processus de location (création, confirmation, retour)

## Documentation

Documentation de Foundry: https://book.getfoundry.sh/

## Installation

```shell
$ forge install
```

## Utilisation

### Compilation

```shell
$ forge build
```

### Tests

```shell
$ forge test
```

### Formatage

```shell
$ forge fmt
```

### Captures de gas

```shell
$ forge snapshot
```

### Anvil (nœud local)

```shell
$ anvil
```

### Déploiement

```shell
$ forge script script/Deploy.s.sol:DeployScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

Pour déployer sur Polygon Amoy Testnet, utilisez le script bash:

```shell
$ ./script/deploy.sh
```
Assurez-vous d'avoir un fichier `.env` avec les variables nécessaires (voir `.env.example` à la racine du projet).

### Cast

```shell
$ cast <subcommand>
```

### Aide

```shell
$ forge --help
$ anvil --help
$ cast --help
```
