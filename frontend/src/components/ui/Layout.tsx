'use client';

import { ReactNode } from 'react';
import { useContracts } from '@/lib/hooks/useContracts';
import { formatAddress } from '@/utils/formatters';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isConnected, connect, account, disconnect, isLoading } = useContracts();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for styling header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Header avec navigation */}
      <header 
        className={`fixed w-full top-0 z-10 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-200/50' 
            : 'bg-white border-b border-gray-200'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-10">
              <Link href="/" className="relative group">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 relative z-10 group-hover:opacity-80 transition-opacity">
                    BlockRent
                  </span>
                  <span className="absolute -bottom-1 left-0 h-1 w-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded group-hover:w-full transition-all duration-300"></span>
                </motion.div>
              </Link>
              
              <nav className="hidden md:flex gap-6">
                <NavLink href="/equipments" label="Équipements" />
                <NavLink href="/rentals" label="Mes locations" />
                {isConnected && mounted && (
                  <NavLink href="/dashboard" label="Tableau de bord" />
                )}
              </nav>
            </div>

            <div>
              {mounted && !isLoading && (
                isConnected ? (
                  <motion.div 
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="hidden md:flex text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 py-1 px-4 rounded-full items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      {formatAddress(account || '')}
                    </span>
                    <button
                      onClick={disconnect}
                      className="text-sm py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium hover:scale-105 active:scale-95"
                    >
                      Déconnecter
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={connect}
                    className="py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Connecter
                  </motion.button>
                )
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Navigation mobile */}
      <motion.div 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-10 rounded-t-xl border-t border-gray-200"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
      >
        <div className="flex items-center justify-around">
          <MobileNavLink href="/" icon={HomeIcon} label="Accueil" />
          <MobileNavLink href="/equipments" icon={EquipmentIcon} label="Équipements" />
          <MobileNavLink href="/rentals" icon={RentalIcon} label="Locations" />
        </div>
      </motion.div>
      
      {/* Contenu principal */}
      <main className="flex-grow container mx-auto px-4 py-8 mb-24 md:mb-8 mt-20">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-50 to-purple-50 shadow-inner py-8 mt-auto hidden md:block rounded-t-3xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600 flex items-center">
                <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mr-1">
                  BlockRent
                </span>
                &copy; {new Date().getFullYear()} - Location décentralisée
              </p>
            </div>
            <div className="flex gap-6">
              <FooterLink href="#" label="Conditions" />
              <FooterLink href="#" label="Confidentialité" />
              <FooterLink href="#" label="Contact" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-gray-600 hover:text-blue-600 transition font-medium relative group"
    >
      {label}
      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
    </Link>
  );
}

function MobileNavLink({ href, icon: Icon, label }: { href: string; icon: React.FC; label: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center py-3 px-2 text-gray-600 hover:text-blue-600 relative group"
    >
      <div className="relative">
        <Icon />
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-0 rounded-full bg-blue-500 group-hover:w-4 transition-all duration-300"></span>
      </div>
      <span className="text-xs mt-1 font-medium">{label}</span>
    </Link>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <a 
      href={href} 
      className="text-sm text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105"
    >
      {label}
    </a>
  );
}

// Icons
function HomeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function EquipmentIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

function RentalIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
} 