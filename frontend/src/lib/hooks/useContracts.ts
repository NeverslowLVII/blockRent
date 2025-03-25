import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContracts } from '../contracts/config';

export const useContracts = () => {
  const [contracts, setContracts] = useState<{
    equipmentRegistry: ethers.Contract | null;
    rentalManager: ethers.Contract | null;
  }>({
    equipmentRegistry: null,
    rentalManager: null,
  });
  
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour se connecter à Metamask ou Rabby
  const connect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!window.ethereum) {
        throw new Error("Aucun portefeuille Ethereum détecté. Veuillez installer Rabby ou MetaMask.");
      }

      // Demande de connexion au portefeuille
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Récupération du compte connecté
      const signer = await ethProvider.getSigner();
      const userAddress = await signer.getAddress();
      
      // Initialisation des contrats
      const contractInstances = await getContracts(ethProvider);
      
      setProvider(ethProvider);
      setAccount(userAddress);
      setContracts({
        equipmentRegistry: contractInstances.equipmentRegistry,
        rentalManager: contractInstances.rentalManager,
      });
      setIsConnected(true);
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour se déconnecter
  const disconnect = () => {
    setProvider(null);
    setAccount(null);
    setContracts({
      equipmentRegistry: null,
      rentalManager: null,
    });
    setIsConnected(false);
  };

  // Vérifier si déjà connecté au chargement
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        
        if (window.ethereum) {
          const ethProvider = new ethers.BrowserProvider(window.ethereum);
          
          // Vérifier si déjà connecté
          const accounts = await ethProvider.listAccounts();
          
          if (accounts && accounts.length > 0) {
            const userAddress = accounts[0].address;
            const contractInstances = await getContracts(ethProvider);
            
            setProvider(ethProvider);
            setAccount(userAddress);
            setContracts({
              equipmentRegistry: contractInstances.equipmentRegistry,
              rentalManager: contractInstances.rentalManager,
            });
            setIsConnected(true);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de connexion:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  return {
    contracts,
    provider,
    account,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
  };
}; 