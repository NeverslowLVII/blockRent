"use client";

import Link from "next/link";
import { useContracts } from '@/lib/hooks/useContracts';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Home() {
  const { isConnected, connect } = useContracts();

  return (
    <div className="animate-fade-in">
      {/* Network notification */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-8 shadow-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">Information importante</h3>
            <div className="mt-1 text-sm text-amber-700">
              <p>Cette application fonctionne exclusivement sur le réseau <strong>Polygon Amoy Testnet</strong>. Assurez-vous que votre portefeuille est configuré sur ce réseau. Des instructions détaillées apparaîtront si nécessaire.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section Hero avec animation */}
      <section className="py-16 md:py-24 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Louez de l&apos;équipement <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">sans tracas !</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              🚀 Équipements de qualité, transactions sécurisées par la blockchain, 
              et le tout sans intermédiaire ! La location nouvelle génération est arrivée.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/equipments">
                <Button variant="default" size="lg" className="relative group">
                  <span className="relative z-10">Explorer les trésors</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 rounded-md transition-opacity"></div>
                </Button>
              </Link>
              {!isConnected && (
                <Button variant="secondary" size="lg" onClick={connect} className="group">
                  <span>Connecter mon wallet</span>
                  <svg className="w-5 h-5 ml-2 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v3m0 0l3-3m-3 3l-3-3m3-3V4m0 0l-3 3m3-3l3 3" />
                  </svg>
                </Button>
              )}
            </div>
          </motion.div>
          <motion.div 
            className="hidden lg:block relative h-96"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl"></div>
            <div className="absolute inset-0 grid place-items-center">
              <div className="relative w-64 h-64">
                {/* Animated chain elements */}
                <motion.div 
                  className="absolute h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full top-0 left-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                ></motion.div>
                <motion.div 
                  className="absolute h-12 w-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full top-1/2 right-0"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                ></motion.div>
                <motion.div 
                  className="absolute h-14 w-14 bg-gradient-to-r from-green-400 to-teal-500 rounded-full bottom-0 left-1/4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                ></motion.div>
                
                <div className="absolute inset-0 grid place-items-center">
                  <div className="bg-white/90 p-6 rounded-2xl shadow-lg text-center backdrop-blur-sm">
                    <h3 className="text-2xl font-bold text-blue-800 mb-2">BlockRent</h3>
                    <p className="text-gray-600">Location décentralisée</p>
            </div>
          </div>
            </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Section fonctionnalités avec animations */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white rounded-3xl shadow-sm my-6">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">Simple comme bonjour</span>
            <h2 className="text-3xl font-bold mt-4 mb-4">Comment ça marche ? 🤔</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Un processus en 3 étapes, aussi facile que de commander une pizza !
          </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <motion.div 
            className="bg-white p-8 rounded-2xl shadow-sm border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-md"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-transform hover:rotate-12">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">1. Trouvez votre bonheur</h3>
            <p className="text-gray-600 text-center">
              Parcourez notre galerie d&apos;équipements cool et trouvez exactement ce dont vous avez besoin !
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-8 rounded-2xl shadow-sm border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-md"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-transform hover:rotate-12">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">2. Réservez en 2 clics</h3>
            <p className="text-gray-600 text-center">
              Choisissez vos dates et payez en ETH, rapidement, simplement et sans paperasse !
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-8 rounded-2xl shadow-sm border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-md"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-transform hover:rotate-12">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">3. Profitez et rendez !</h3>
            <p className="text-gray-600 text-center">
              Amusez-vous avec l&apos;équipement, puis retournez-le pour récupérer automatiquement votre caution. Magie !
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Avantages supplémentaires */}
      <section className="py-16 mb-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">Avantages exclusifs</span>
            <h2 className="text-3xl font-bold mt-4 mb-4">Pourquoi choisir BlockRent ? 🌟</h2>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v3m0 0l3-3m-3 3l-3-3m3-3V4m0 0l-3 3m3-3l3 3" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Caution 100% sécurisée</h3>
                <p className="text-gray-600">
                  Votre caution est verrouillée dans un smart contract, pas dans la poche de quelqu&apos;un. Sécurité maximale ! 🔒
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Zéro intermédiaire</h3>
                <p className="text-gray-600">
                  Louez directement entre particuliers. Pas d&apos;entreprise qui prend une commission de 30% ! 🤝
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Paiements instantanés</h3>
                <p className="text-gray-600">
                  Fini l&apos;attente de 3-5 jours ouvrés pour les remboursements. Tout se passe en quelques secondes ! ⚡
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-all"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Transparence totale</h3>
                <p className="text-gray-600">
                  Toutes les transactions sont sur la blockchain. Visibles par tous, modifiables par personne ! 👁️
                </p>
              </div>
          </div>
          </motion.div>
        </div>
      </section>
      
      {/* Section appel à l'action avec animation */}
      <section className="py-16 md:py-24 text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6">Prêt à révolutionner vos locations ? 🚀</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez les centaines d&apos;utilisateurs qui ont déjà adopté la location décentralisée !
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/equipments">
              <Button variant="default" size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all">
              Explorer les équipements
            </Button>
          </Link>
          {!isConnected && (
              <Button variant="secondary" size="lg" onClick={connect} className="group">
                <span>Connecter mon wallet</span>
                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </Button>
          )}
        </div>
        </motion.div>
      </section>
    </div>
  );
}
