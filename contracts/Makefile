-include .env

.PHONY: all test clean help install update build deploy-mumbai deploy-polygon verify-mumbai verify-polygon format lint

help:
	@echo "Commandes disponibles:"
	@echo "  make install        - Installer les dépendances avec Foundry"
	@echo "  make update         - Mettre à jour les dépendances avec Foundry"
	@echo "  make build          - Compiler les contrats"
	@echo "  make test           - Exécuter les tests"
	@echo "  make coverage       - Générer un rapport de couverture de code"
	@echo "  make deploy-mumbai  - Déployer les contrats sur le testnet Mumbai"
	@echo "  make deploy-polygon - Déployer les contrats sur Polygon Mainnet"
	@echo "  make verify-mumbai  - Vérifier les contrats déployés sur Mumbai"
	@echo "  make verify-polygon - Vérifier les contrats déployés sur Polygon"
	@echo "  make format         - Formater le code Solidity"
	@echo "  make lint           - Vérifier le style du code"
	@echo "  make clean          - Nettoyer les fichiers de build"

all: clean install update build test

# Gestion des dépendances
install:
	forge install

update:
	forge update

# Compilation
build:
	forge build --via-ir

# Tests
test:
	forge test -vvv

coverage:
	forge coverage --report lcov
	genhtml lcov.info --branch-coverage --output-directory coverage

# Déploiement
deploy-mumbai:
	@echo "Déploiement des contrats sur Mumbai Testnet..."
	forge script script/DeployContracts.s.sol:DeployContracts --rpc-url polygon_mumbai --broadcast --verify --etherscan-api-key ${POLYGONSCAN_API_KEY} -vvvv

deploy-polygon:
	@echo "Déploiement des contrats sur Polygon Mainnet..."
	@echo "⚠️  ATTENTION: Vous êtes sur le point de déployer sur MAINNET ⚠️"
	@echo "Appuyez sur Ctrl+C pour annuler, ou attendez 5 secondes pour continuer..."
	@sleep 5
	forge script script/DeployContracts.s.sol:DeployContracts --rpc-url polygon --broadcast --verify --etherscan-api-key ${POLYGONSCAN_API_KEY} -vvvv

# Vérification
verify-mumbai:
	@echo "Vérification des contrats sur Mumbai Testnet..."
	forge script script/VerifyContracts.s.sol:VerifyContracts --rpc-url polygon_mumbai -vvvv

verify-polygon:
	@echo "Vérification des contrats sur Polygon Mainnet..."
	forge script script/VerifyContracts.s.sol:VerifyContracts --rpc-url polygon -vvvv

# Formatage et linting
format:
	forge fmt

lint:
	solhint 'src/**/*.sol'
	solhint 'test/**/*.sol'
	solhint 'script/**/*.sol'

# Nettoyage
clean:
	forge clean
	rm -rf coverage
	rm -f lcov.info 