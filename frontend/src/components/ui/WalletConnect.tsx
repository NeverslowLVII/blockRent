"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useContracts } from "@/lib/hooks/useContracts";
import { Wallet } from "lucide-react";
import NetworkGuideModal from "./NetworkGuideModal";

export default function WalletConnect() {
  const { connect, disconnect, isConnected, account, isLoading, error, networkInstructions } = useContracts();
  const [showNetworkGuide, setShowNetworkGuide] = useState(false);
  
  // Afficher automatiquement le modal si networkInstructions est défini
  useEffect(() => {
    if (networkInstructions) {
      setShowNetworkGuide(true);
    }
  }, [networkInstructions]);
  
  const handleConnect = async () => {
    try {
      await connect();
    } catch (err: any) {
      console.log("Erreur de connexion interceptée:", err.message);
      
      // Détection plus large des erreurs liées à l'ajout de réseau
      if (err.message && (
        err.message.includes("ajouter manuellement") || 
        err.message.includes("Rabby nécessite un ajout manuel") ||
        err.message.includes("Unrecognized chain ID") ||
        err.message.includes("Try adding the chain")
      )) {
        setShowNetworkGuide(true);
      }
    }
  };
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <>
      {isConnected && account ? (
        <div className="flex items-center gap-2">
          <span className="hidden md:inline-block font-medium text-sm">
            {formatAddress(account)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={disconnect}
          >
            Déconnecter
          </Button>
        </div>
      ) : (
        <Button 
          onClick={handleConnect}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <Wallet className="h-4 w-4" />
          {isLoading ? "Connexion..." : "Connecter"}
        </Button>
      )}
      
      {/* Modal d'instructions pour l'ajout du réseau */}
      <NetworkGuideModal 
        isOpen={showNetworkGuide} 
        onClose={() => setShowNetworkGuide(false)} 
      />
    </>
  );
} 