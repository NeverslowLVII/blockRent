'use client';

import Link from 'next/link';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useContracts } from '@/lib/hooks/useContracts';

interface NavbarProps {
  setShowWalletPrompt?: Dispatch<SetStateAction<boolean>>;
}

export default function Navbar({ setShowWalletPrompt }: NavbarProps) {
  const { account, isConnected, isLoading, connect, disconnect } = useContracts();
  const [mounted, setMounted] = useState(false);

  // Éviter les problèmes d'hydratation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Formater l'adresse pour l'affichage
  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleConnect = () => {
    connect();
    if (setShowWalletPrompt) {
      setShowWalletPrompt(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-4 fixed w-full top-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            BlockRent
          </Link>
          <div className="hidden md:flex ml-10 space-x-6">
            <Link href="/equipments" className="text-gray-700 hover:text-blue-500">
              Équipements
            </Link>
            <Link href="/rentals" className="text-gray-700 hover:text-blue-500">
              Locations
            </Link>
            {isConnected && mounted && (
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-500">
                Tableau de bord
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {mounted && !isLoading && (
            isConnected ? (
              <div className="flex items-center space-x-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {formatAddress(account)}
                </span>
                <button
                  onClick={disconnect}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                Connecter Portefeuille
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
} 