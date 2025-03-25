"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import { useState, ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [showWalletPrompt, setShowWalletPrompt] = useState(false);

  return (
    <html lang="fr">
      <body className={inter.className}>
        <Navbar setShowWalletPrompt={setShowWalletPrompt} />
        
        {/* Wallet connection prompt modal */}
        {showWalletPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Connexion requise</h3>
              <p className="text-gray-600 mb-6">
                Veuillez connecter votre portefeuille Ethereum pour accéder à cette fonctionnalité.
              </p>
              <div className="flex justify-end">
                <button 
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2"
                  onClick={() => setShowWalletPrompt(false)}
                >
                  Annuler
                </button>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  onClick={() => setShowWalletPrompt(false)}
                >
                  Connecter
                </button>
              </div>
            </div>
          </div>
        )}
        
        {children}
      </body>
    </html>
  );
}
