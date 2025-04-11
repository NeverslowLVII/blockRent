'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useContracts } from "@/lib/hooks/useContracts";
import { formatAddress } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Package,
  Calendar,
  User,
  Menu,
  X,
  ChevronRight,
  Github,
  ExternalLink,
  HelpCircle
} from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isConnected, connect, disconnect, account } = useContracts();
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Effet pour hydrater le composant côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Définition des liens de navigation
  const navigationLinks = [
    {
      name: "Accueil",
      href: "/",
      icon: <Home className="h-5 w-5" />,
      active: pathname === "/"
    },
    {
      name: "Tableau de bord",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      active: pathname === "/dashboard",
      requiresAuth: true
    },
    {
      name: "Équipements",
      href: "/equipments",
      icon: <Package className="h-5 w-5" />,
      active: pathname.startsWith("/equipments")
    },
    {
      name: "Mes locations",
      href: "/rentals",
      icon: <Calendar className="h-5 w-5" />,
      active: pathname.startsWith("/rentals"),
      requiresAuth: true
    }
  ];
  
  // Empêcher le flash initial lors du rendu
  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background design commun à toutes les pages */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {/* Cercles flous d'arrière-plan */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo et nom du site */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">B</div>
              <span className="text-xl font-bold text-gray-900">BlockRent</span>
            </div>
          </Link>

          {/* Navigation sur desktop */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            {navigationLinks.map((link) => 
              !link.requiresAuth || (link.requiresAuth && isConnected) ? (
                <Link
                  href={link.href}
                  key={link.name}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-blue-600 ${
                    link.active ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  {link.icon}
                  {link.name}
                  {link.active && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-[2px] w-full bg-blue-600"
                      layoutId="activeSection"
                    />
                  )}
                </Link>
              ) : null
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Bouton de connexion/déconnexion */}
            {isConnected ? (
              <div className="hidden md:flex md:items-center md:gap-4">
                <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm text-blue-700">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-mono">{formatAddress(account || "")}</span>
                </div>
                
                <Button
                  onClick={disconnect}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Déconnecter
                </Button>
              </div>
            ) : (
              <Button 
                onClick={connect} 
                variant="default" 
                className="hidden md:flex bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                size="sm"
              >
                Connecter mon wallet
              </Button>
            )}

            {/* Bouton du menu mobile */}
            <Button
              onClick={() => setMobileMenuOpen(true)}
              variant="outline"
              size="icon"
              className="md:hidden"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-y-0 right-0 z-40 w-full max-w-xs bg-white shadow-xl"
            >
              <div className="flex h-16 items-center justify-between px-6 border-b">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">B</div>
                  <span className="text-xl font-bold text-gray-900">BlockRent</span>
                </div>
                <Button
                  onClick={() => setMobileMenuOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-900"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-1 px-3 py-4">
                {/* Navigation mobile */}
                <div className="space-y-1 py-3">
                  {navigationLinks.map((link) => 
                    !link.requiresAuth || (link.requiresAuth && isConnected) ? (
                      <Link
                        href={link.href}
                        key={link.name}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                          link.active
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {link.icon}
                        {link.name}
                        <ChevronRight className={`ml-auto h-4 w-4 ${link.active ? "text-blue-500" : "text-gray-400"}`} />
                      </Link>
                    ) : null
                  )}
                </div>

                {/* Statut de connexion mobile */}
                <div className="my-6 border-t border-gray-100 pt-6">
                  {isConnected ? (
                    <>
                      <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <User className="h-6 w-6 text-gray-600" />
                          <div>
                            <p className="text-xs text-gray-500">Connecté en tant que</p>
                            <p className="font-mono text-sm">{formatAddress(account || "")}</p>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={disconnect}
                        variant="outline"
                        className="w-full"
                      >
                        Déconnecter
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={connect}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                    >
                      Connecter mon wallet
                    </Button>
                  )}
                </div>
                
                {/* Liens externes */}
                <div className="space-y-1 border-t border-gray-100 pt-6">
                  <a
                    href="https://github.com/NeverslowLVII/blockRent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Github className="h-5 w-5" />
                    Code source
                    <ExternalLink className="ml-auto h-4 w-4 text-gray-400" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <HelpCircle className="h-5 w-5" />
                    Aide
                    <ExternalLink className="ml-auto h-4 w-4 text-gray-400" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu principal */}
      <main className="flex-1 bg-gray-50">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">B</div>
                <span className="text-xl font-bold">BlockRent</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Location d&apos;équipements sur blockchain
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-16">
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-900">Produit</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">
                      Accueil
                    </Link>
                  </li>
                  <li>
                    <Link href="/equipments" className="text-sm text-gray-600 hover:text-blue-600">
                      Équipements
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="text-sm text-gray-600 hover:text-blue-600">
                      Tableau de bord
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-900">Ressources</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://github.com/NeverslowLVII/blockRent"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      Documentation
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-900">Légal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-blue-600">
                      Conditions d&apos;utilisation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-blue-600">
                      Politique de confidentialité
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-center text-sm text-gray-600">
              &copy; {new Date().getFullYear()} BlockRent. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 