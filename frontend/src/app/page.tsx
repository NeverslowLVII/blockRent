"use client";

import Link from "next/link";
import { useContracts } from '@/lib/hooks/useContracts';
import Button from '@/components/ui/Button';

export default function Home() {
  const { isConnected, connect } = useContracts();

  return (
    <div className="animate-fade-in">
      {/* Section Hero */}
      <section className="py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Location d&apos;équipements <span className="text-blue-600">décentralisée</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Louez ou proposez en location vos équipements de manière sécurisée
              grâce à la blockchain Ethereum. Sans intermédiaire et avec des garanties
              automatisées par smart contracts.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/equipments">
                <Button variant="primary" size="lg">
                  Explorer les équipements
                </Button>
              </Link>
              {!isConnected && (
                <Button variant="secondary" size="lg" onClick={connect}>
                  Connecter mon portefeuille
                </Button>
              )}
            </div>
          </div>
          <div className="hidden lg:block bg-blue-50 rounded-xl p-8 relative overflow-hidden h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
            <div className="absolute -bottom-10 -right-10">
              <svg width="280" height="280" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500 opacity-20">
                <path d="M300 0C134.4 0 0 134.4 0 300C0 465.6 134.4 600 300 600C465.6 600 600 465.6 600 300C600 134.4 465.6 0 300 0ZM450 330H330V450H270V330H150V270H270V150H330V270H450V330Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-center">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Location simplifiée</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Système de caution sécurisé</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Aucun intermédiaire</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Paiements automatisés</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Transparence totale des transactions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section fonctionnalités */}
      <section className="py-16 bg-white rounded-xl shadow-sm">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Comment ça fonctionne</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Un processus simple et sécurisé pour la location d&apos;équipements
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">1. Trouvez l&apos;équipement</h3>
            <p className="text-gray-600">
              Parcourez notre catalogue d&apos;équipements disponibles à la location.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">2. Réservez et payez</h3>
            <p className="text-gray-600">
              Choisissez vos dates et confirmez la location en payant automatiquement avec ETH.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">3. Utilisez et retournez</h3>
            <p className="text-gray-600">
              Après utilisation, retournez l&apos;équipement pour récupérer automatiquement votre caution.
            </p>
          </div>
        </div>
      </section>
      
      {/* Section appel à l'action */}
      <section className="py-16 md:py-24 text-center">
        <h2 className="text-3xl font-bold mb-6">Prêt à commencer ?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Rejoignez notre plateforme et commencez à louer ou proposer vos équipements dès aujourd&apos;hui.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/equipments">
            <Button variant="primary" size="lg">
              Explorer les équipements
            </Button>
          </Link>
          {!isConnected && (
            <Button variant="secondary" size="lg" onClick={connect}>
              Connecter mon portefeuille
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
