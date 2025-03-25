"use client";

import { useState, useEffect } from "react";
import { useContracts } from "@/lib/hooks/useContracts";
import Link from "next/link";

export default function DashboardPage() {
  const { isConnected, connect, account } = useContracts();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simuler le chargement des données
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Si l'utilisateur n'est pas connecté, demander la connexion
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
          <p className="text-lg text-gray-600 mb-8">
            Connectez votre portefeuille pour accéder à votre tableau de bord.
          </p>
          <button
            onClick={connect}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition"
          >
            Connecter mon portefeuille
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Mes équipements</h2>
            <p className="text-gray-600 mb-4">
              Gérez les équipements que vous avez enregistrés pour la location.
            </p>
            <Link
              href="/equipments"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              Voir tous mes équipements
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Mes locations</h2>
            <p className="text-gray-600 mb-4">
              Suivez l'état de vos locations en cours et passées.
            </p>
            <Link
              href="/rentals"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              Voir toutes mes locations
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Informations du compte</h2>
            <div className="mb-4">
              <p className="text-gray-600">Adresse du portefeuille</p>
              <p className="font-medium break-all">{account}</p>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Actions rapides</h3>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/equipments?action=new"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition text-sm"
                >
                  Ajouter un équipement
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 