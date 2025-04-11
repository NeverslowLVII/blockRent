// Ajout de la déclaration de type en haut du fichier
declare global {
  interface Window {
    ethereum: any;
  }
}

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContracts } from '../contracts/config';

// Network configuration for Amoy testnet
const AMOY_CHAIN_ID = '0x13882'; // 80002 in decimal
const AMOY_NETWORK = {
  chainId: AMOY_CHAIN_ID,
  chainName: 'Polygon Amoy Testnet',
  nativeCurrency: {
    name: 'POL',
    symbol: 'POL',
    decimals: 18
  },
  rpcUrls: ['https://rpc-amoy.polygon.technology'],
  blockExplorerUrls: ['https://amoy.polygonscan.com/']
};

// Instructions for manual network addition
const getManualNetworkInstructions = () => {
  return `
    Pour ajouter manuellement le réseau Polygon Amoy Testnet:
    1. Ouvrez votre portefeuille Rabby/MetaMask
    2. Allez dans Paramètres > Réseaux > Ajouter un réseau
    3. Entrez les informations suivantes:
       - Nom du réseau: Polygon Amoy Testnet
       - URL RPC: https://rpc-amoy.polygon.technology
       - ID de chaîne: 80002
       - Symbole: POL
       - Explorateur de blocs: https://amoy.polygonscan.com/
    
    Une fois connecté au réseau, vous aurez besoin de POL de test:
    - Visitez le faucet officiel: https://amoy.polygonscan.com/faucet
  `;
};

// Détection du type de portefeuille
const detectWalletType = () => {
  if (typeof window === 'undefined' || !window.ethereum) return 'unknown';
  
  // Détection de Rabby
  if (window.ethereum.isRabby) return 'rabby';
  
  // Détection de MetaMask
  if (window.ethereum.isMetaMask) return 'metamask';
  
  return 'unknown';
};

// Vérifier si nous sommes sur un réseau Polygon (mais pas Amoy)
const isOnPolygonNetwork = (chainId: string) => {
  // Polygone Mainnet: 0x89, Mumbai: 0x13881
  // Nous vérifions si l'utilisateur est sur un réseau Polygon mais pas Amoy
  const polygonNetworks = ['0x89', '0x13881'];
  return chainId.startsWith('0x') && 
    polygonNetworks.includes(chainId) &&
    chainId !== AMOY_CHAIN_ID;
};

// Obtenir un message d'erreur personnalisé en fonction du réseau actuel
const getNetworkErrorMessage = (currentChainId: string) => {
  if (isOnPolygonNetwork(currentChainId)) {
    return `Vous êtes actuellement sur un autre réseau Polygon (${currentChainId}). Cette application fonctionne exclusivement sur le réseau Polygon Amoy Testnet (${AMOY_CHAIN_ID}).`;
  }
  return "Veuillez changer manuellement pour le réseau Polygon Amoy Testnet dans votre portefeuille.";
};

export const useContracts = () => {
  const [contracts, setContracts] = useState<{
    equipmentRegistry: ethers.Contract | null;
    rentalManager: ethers.Contract | null;
  }>({
    equipmentRegistry: null,
    rentalManager: null,
  });
  
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkInstructions, setNetworkInstructions] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<string>('unknown');

  // Fonction pour vérifier et basculer sur le réseau Amoy si nécessaire
  const switchToAmoyNetwork = async (ethereum: Window['ethereum']) => {
    try {
      // Essayer de changer pour le réseau Amoy
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AMOY_CHAIN_ID }],
      });
      return true;
    } catch (switchError: unknown) {
      console.error("Erreur lors du changement de réseau:", switchError);
      
      // On type l'erreur pour accéder à ses propriétés
      const typedError = switchError as { code?: number; chainId?: string };
      
      // Si le réseau n'est pas configuré dans le portefeuille, on essaie de l'ajouter
      if (typedError.code === 4902 || typedError.code === -32603) {
        try {
          // Pour Rabby, on va proposer une instruction détaillée d'ajout manuel
          const walletTypeDetected = detectWalletType();
          if (walletTypeDetected === 'rabby') {
            console.log("Rabby détecté, fournissant des instructions spécifiques pour l'ajout du réseau");
            setNetworkInstructions(getManualNetworkInstructions());
            throw new Error(`Rabby nécessite un ajout manuel du réseau Amoy. Veuillez suivre les instructions affichées pour ajouter le réseau Polygon Amoy Testnet.`);
          }
          
          // Pour les autres portefeuilles, on tente l'ajout automatique
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [AMOY_NETWORK],
          });
          return true;
        } catch (addError: any) {
          console.error("Erreur lors de l'ajout du réseau Amoy:", addError);
          // Afficher les instructions pour l'ajout manuel du réseau
          setNetworkInstructions(getManualNetworkInstructions());
          
          // Message personnalisé en fonction du code d'erreur
          if (addError.code === 4001) {
            throw new Error("Vous avez refusé l'ajout du réseau. Veuillez l'ajouter manuellement en suivant les instructions.");
          } else {
            throw new Error(`Impossible d'ajouter automatiquement le réseau Amoy. Veuillez l'ajouter manuellement à votre portefeuille.`);
          }
        }
      }
      
      // Afficher les instructions pour l'ajout manuel du réseau
      setNetworkInstructions(getManualNetworkInstructions());
      
      // Si l'erreur est liée à un rejet utilisateur
      if (typedError.code === 4001) {
        throw new Error("Vous avez refusé le changement de réseau. Veuillez changer manuellement vers Polygon Amoy.");
      }
      
      throw new Error(getNetworkErrorMessage(typedError.chainId || '0x0'));
    }
  };

  // Fonction pour se connecter à Metamask ou Rabby
  const connect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setNetworkInstructions(null);
      
      if (!window.ethereum) {
        throw new Error("Aucun portefeuille Ethereum détecté. Veuillez installer Rabby ou MetaMask.");
      }
      
      // Détecter le type de portefeuille
      const detectedWalletType = detectWalletType();
      setWalletType(detectedWalletType);
      console.log(`Portefeuille détecté: ${detectedWalletType}`);

      // Demande de connexion au portefeuille
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Vérifier le réseau actuel
      const network = await ethProvider.getNetwork();
      const chainId = '0x' + network.chainId.toString(16);
      
      if (chainId !== AMOY_CHAIN_ID) {
        console.log("Réseau actuel:", chainId, "Tentative de changement vers Amoy:", AMOY_CHAIN_ID);
        
        // Message spécifique si on est sur un autre réseau Polygon
        if (isOnPolygonNetwork(chainId)) {
          console.log("L'utilisateur est sur un autre réseau Polygon:", chainId);
        }
        
        // Vérifier et basculer sur le réseau Amoy si nécessaire
        await switchToAmoyNetwork(window.ethereum);
      }
      
      // Récupération du compte connecté
      const signer = await ethProvider.getSigner();
      const userAddress = await signer.getAddress();
      
      // Initialisation des contrats
      const contractInstances = await getContracts(window.ethereum);
      
      // Vérifier que les contrats sont bien initialisés
      if (!contractInstances.equipmentRegistry || !contractInstances.rentalManager) {
        throw new Error("Erreur d'initialisation des contrats. Veuillez vérifier les adresses des contrats.");
      }
      
      // Vérification de la connectivité avec le réseau
      try {
        // Vérifier si le code est déployé à l'adresse du contrat
        const code = await window.ethereum.getCode(contractInstances.equipmentRegistry.target);
        if (code === '0x' || code === '0x0') {
          throw new Error("Le contrat n'est pas déployé à l'adresse spécifiée sur ce réseau. Vérifiez que vous êtes sur le réseau Polygon Amoy.");
        }

        // Vérifier que le contrat répond correctement
        try {
          const totalEquipments = await contractInstances.equipmentRegistry.totalEquipments();
          console.log("Total des équipements:", totalEquipments);
        } catch (err) {
          console.error("Erreur lors de l'appel à totalEquipments:", err);
          throw new Error("Le contrat ne répond pas correctement. Vérifiez que vous utilisez la bonne adresse de contrat.");
        }

        console.log("Connexion au contrat EquipmentRegistry réussie");
      } catch (contractErr) {
        console.error("Erreur lors de la connexion aux contrats:", contractErr);
        throw new Error("Impossible de se connecter aux contrats. Veuillez vérifier que vous êtes sur le réseau Polygon Amoy Testnet et que vous utilisez les bonnes adresses de contrats.");
      }
      
      setAccount(userAddress);
      setContracts({
        equipmentRegistry: contractInstances.equipmentRegistry,
        rentalManager: contractInstances.rentalManager,
      });
      setIsConnected(true);
    } catch (err: any) {
      console.error("Erreur lors de la connexion:", err);
      setError(err.message || "Erreur lors de la connexion au portefeuille. Veuillez réessayer.");
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour se déconnecter du portefeuille
  const disconnect = async () => {
    try {
      // Réinitialiser l'état
      setAccount(null);
      setIsConnected(false);
      setContracts({
        equipmentRegistry: null,
        rentalManager: null
      });
      
      // Stocker dans localStorage qu'on a déconnecté volontairement
      localStorage.setItem('walletDisconnected', 'true');
      
      console.log('Déconnecté avec succès');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Initialisation automatique du provider au montage du composant
  useEffect(() => {
    const initProvider = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const ethProvider = new ethers.BrowserProvider(window.ethereum);
          
          // Vérifier si déjà connecté
          const accounts = await ethProvider.listAccounts();
          
          if (accounts && accounts.length > 0) {
            try {
              // Vérifier le réseau
              const network = await ethProvider.getNetwork();
              const chainId = '0x' + network.chainId.toString(16);
              
              if (chainId !== AMOY_CHAIN_ID) {
                console.warn("L'utilisateur n'est pas sur le réseau Polygon Amoy");
                return;
              }
              
              const userAddress = await accounts[0].getAddress();
              const contractInstances = await getContracts(ethProvider);
              
              // Vérifier que les contrats sont bien initialisés
              if (!contractInstances.equipmentRegistry || !contractInstances.rentalManager) {
                console.warn("Contrats non initialisés correctement");
                return;
              }
              
              // Vérifier la connectivité avec le réseau
              try {
                // Vérifier si le code est déployé à l'adresse du contrat
                const code = await ethProvider.getCode(contractInstances.equipmentRegistry.target);
                if (code === '0x' || code === '0x0') {
                  console.warn("Le contrat n'est pas déployé à l'adresse spécifiée.");
                  return;
                }

                // Vérifier que le contrat répond correctement
                try {
                  const totalEquipments = await contractInstances.equipmentRegistry.totalEquipments();
                  console.log("Total des équipements:", totalEquipments);
                } catch (err) {
                  console.error("Erreur lors de l'appel à totalEquipments:", err);
                  return;
                }

                console.log("Connexion au contrat EquipmentRegistry réussie");
              } catch (contractErr) {
                console.error("Erreur lors de la connexion aux contrats:", contractErr);
                return;
              }
              
              setAccount(userAddress);
              setContracts({
                equipmentRegistry: contractInstances.equipmentRegistry,
                rentalManager: contractInstances.rentalManager,
              });
              setIsConnected(true);
            } catch (err) {
              console.error("Erreur lors de l'initialisation des contrats:", err);
            }
          }
        } catch (err) {
          console.error("Erreur lors de l'initialisation du provider:", err);
        }
      }
    };

    initProvider();
  }, []);

  // Gérer les changements de compte
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          // Déconnexion
          setAccount(null);
          setIsConnected(false);
          setContracts({
            equipmentRegistry: null,
            rentalManager: null,
          });
        } else {
          // Mise à jour du compte
          setAccount(accounts[0]);
        }
      });
      
      // Gérer les changements de réseau
      window.ethereum.on('chainChanged', (chainId: string) => {
        // Si le réseau change, on réinitialise tout
        if (chainId !== AMOY_CHAIN_ID) {
          setAccount(null);
          setIsConnected(false);
          setContracts({
            equipmentRegistry: null,
            rentalManager: null,
          });
          setError(getNetworkErrorMessage(chainId));
        } else {
          // Si le réseau est correct, on réinitialise le provider
          window.location.reload();
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  return {
    isConnected,
    connect,
    account,
    contracts,
    isLoading,
    error,
    networkInstructions,
    walletType,
    disconnect
  };
}; 