"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Location d&apos;équipements sur la blockchain
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Une plateforme décentralisée pour la location sécurisée d&apos;équipements professionnels. 
            Louez ou proposez du matériel en toute confiance grâce à la blockchain.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/equipments" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition"
            >
              Explorer les équipements
            </Link>
            <Link 
              href="/rentals" 
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg text-lg transition"
            >
              Mes locations
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sécurité garantie</h3>
              <p className="text-gray-600">
                Toutes les locations sont sécurisées par des smart contracts et un système de caution automatisé sur la blockchain.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Transactions transparentes</h3>
              <p className="text-gray-600">
                Frais de service transparents et paiements automatisés entre propriétaires et locataires.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestion simplifiée</h3>
              <p className="text-gray-600">
                Enregistrez vos équipements, gérez vos locations et suivez l&apos;état de vos transactions facilement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 px-4 bg-blue-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à commencer ?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Rejoignez notre plateforme dès maintenant et découvrez une nouvelle façon de louer ou de mettre en location vos équipements.
          </p>
          <Link 
            href="/equipments" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition inline-block"
          >
            Explorer les équipements disponibles
          </Link>
        </div>
      </section>
    </main>
  );
}
