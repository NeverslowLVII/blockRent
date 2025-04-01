#!/bin/bash

# Vérification de la présence du fichier .env
if [ ! -f .env ]; then
    echo "Erreur: Le fichier .env n'existe pas"
    exit 1
fi

# Chargement des variables d'environnement
set -a
source .env
set +a

# Vérification des variables requises
if [ -z "$PRIVATE_KEY" ]; then
    echo "Erreur: PRIVATE_KEY n'est pas définie dans le fichier .env"
    exit 1
fi

if [ -z "$POLYGONSCAN_API_KEY" ]; then
    echo "Erreur: POLYGONSCAN_API_KEY n'est pas définie dans le fichier .env"
    exit 1
fi

# Déploiement des contrats
echo "Déploiement des contrats sur Polygon Amoy..."
forge script script/Deploy.s.sol:DeployScript \
    --rpc-url https://rpc-amoy.polygon.technology/ \
    --broadcast \
    --verify \
    -vvvv

# Nettoyage des variables sensibles
unset PRIVATE_KEY
unset POLYGONSCAN_API_KEY

echo "Déploiement terminé. Les variables sensibles ont été effacées." 