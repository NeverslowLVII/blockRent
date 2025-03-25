'use client';

import { ReactNode } from 'react';
import { useContracts } from '@/lib/hooks/useContracts';
import { formatAddress } from '@/utils/formatters';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isConnected, connect, account, disconnect } = useContracts();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header avec navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-10">
              <Link href="/" className="font-bold text-xl text-blue-600">
                BlockRent
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link
                  href="/equipments"
                  className="text-gray-600 hover:text-blue-600 transition font-medium"
                >
                  Équipements
                </Link>
                <Link
                  href="/rentals"
                  className="text-gray-600 hover:text-blue-600 transition font-medium"
                >
                  Mes locations
                </Link>
              </nav>
            </div>

            <div>
              {isConnected ? (
                <div className="flex items-center gap-4">
                  <span className="hidden md:block text-sm text-gray-600 bg-gray-100 py-1 px-3 rounded-full">
                    {formatAddress(account || '')}
                  </span>
                  <button
                    onClick={disconnect}
                    className="text-sm py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
                  >
                    Déconnecter
                  </button>
                </div>
              ) : (
                <button
                  onClick={connect}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                >
                  Connecter
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Navigation mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-top z-10">
        <div className="flex items-center justify-around">
          <Link
            href="/"
            className="flex flex-col items-center py-3 px-4 text-gray-600 hover:text-blue-600"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Accueil</span>
          </Link>
          <Link
            href="/equipments"
            className="flex flex-col items-center py-3 px-4 text-gray-600 hover:text-blue-600"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs">Équipements</span>
          </Link>
          <Link
            href="/rentals"
            className="flex flex-col items-center py-3 px-4 text-gray-600 hover:text-blue-600"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xs">Locations</span>
          </Link>
        </div>
      </div>
      
      {/* Contenu principal */}
      <main className="flex-grow container mx-auto px-4 py-8 mb-16 md:mb-0">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white shadow-inner py-6 mt-auto hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} BlockRent - Plateforme de location décentralisée
              </p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600">
                Conditions d&apos;utilisation
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600">
                Politique de confidentialité
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-600">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 