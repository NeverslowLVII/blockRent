'use client';

import { useContracts } from '@/lib/hooks/useContracts';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function NetworkAlert() {
  const { walletType, connect, isConnected, error, networkInstructions } = useContracts();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  // If no error or network instructions, don't show anything
  if (!error && !networkInstructions) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 z-50 max-w-md w-full md:w-96 shadow-lg rounded-lg bg-white border border-red-200 overflow-hidden">
      <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-white flex justify-between items-center">
        <h3 className="font-semibold">Erreur de réseau</h3>
        <button 
          onClick={() => connect()} 
          className="text-white bg-white/20 hover:bg-white/30 rounded-full p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <div className="p-4 bg-white">
        {error && (
          <div className="mb-3 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}
        
        {networkInstructions && (
          <div className="space-y-3">
            <p className="text-gray-700 text-sm">
              Vous utilisez un portefeuille {
                walletType === 'rabby' ? 'Rabby' : 
                walletType === 'metamask' ? 'MetaMask' : 
                'compatible Ethereum'
              }. Veuillez suivre ces instructions:
            </p>
            
            <div className="bg-gray-50 p-3 rounded text-xs text-gray-800 font-mono whitespace-pre-wrap">
              {networkInstructions}
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => connect()} size="sm" variant="default">
                Réessayer la connexion
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 