"use client";

import Link from "next/link";
import { useContracts } from '@/lib/hooks/useContracts';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Home() {
  const { isConnected, connect } = useContracts();

  return (
    <div className="relative">
      {/* Network notification */}
      <div className="absolute inset-x-0 top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-50/90 to-amber-100/90 border border-amber-200/50 p-3 rounded-xl mt-6 mb-8 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg className="h-4 w-4 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-amber-700">
                Cette application fonctionne exclusivement sur le réseau <span className="font-medium text-amber-900">Polygon Amoy Testnet</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content wrapper */}
      <div className="animate-fade-in">
        {/* Section Hero avec animation */}
        <section className="relative">
          {/* Full-width background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/50 to-white">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>
          
          {/* Content with max-width */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="py-24 md:py-32 mb-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-5xl md:text-6xl font-bold mb-10 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient">
                    Louez de l&apos;équipement <span className="block mt-4">sans tracas !</span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl">
                    🚀 Équipements de qualité, transactions sécurisées par la blockchain, 
                    et le tout sans intermédiaire ! La location nouvelle génération est arrivée.
                  </p>
                  <div className="flex flex-wrap gap-6">
                    <Link href="/equipments">
                      <Button variant="default" size="lg" className="relative group overflow-hidden rounded-xl">
                        <motion.span 
                          className="relative z-10"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Explorer les équipements
                        </motion.span>
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 1, repeat: Infinity }}
                        ></motion.div>
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
                  className="hidden lg:block relative h-[500px]"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl backdrop-blur-3xl"></div>
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="relative w-80 h-80">
                      {/* Animated blockchain elements with mouse follow effect */}
                      <motion.div 
                        className="absolute h-20 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm top-0 left-0"
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.2, 1],
                          y: [0, -20, 0],
                          x: [0, 10, 0]
                        }}
                        transition={{ 
                          duration: 20, 
                          repeat: Infinity, 
                          ease: "linear",
                          y: {
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          },
                          x: {
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                        whileHover={{ scale: 1.3 }}
                      ></motion.div>
                      <motion.div 
                        className="absolute h-16 w-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full top-1/2 right-0"
                        animate={{ 
                          rotate: -360,
                          y: [-10, 10, -10],
                          x: [-5, 5, -5]
                        }}
                        transition={{ 
                          rotate: {
                            duration: 15,
                            repeat: Infinity,
                            ease: "linear"
                          },
                          y: {
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                          },
                          x: {
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                        whileHover={{ scale: 1.3 }}
                      ></motion.div>
                      <motion.div 
                        className="absolute h-14 w-14 bg-gradient-to-r from-green-400 to-teal-500 rounded-full bottom-0 left-1/4"
                        animate={{ 
                          rotate: 360,
                          y: [5, -5, 5],
                          x: [8, -8, 8]
                        }}
                        transition={{ 
                          rotate: {
                            duration: 18,
                            repeat: Infinity,
                            ease: "linear"
                          },
                          y: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                          },
                          x: {
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                        whileHover={{ scale: 1.3 }}
                      ></motion.div>
                      
                      <div className="absolute inset-0 grid place-items-center">
                        <motion.div 
                          className="bg-white/95 p-8 rounded-3xl shadow-2xl text-center backdrop-blur-xl"
                          whileHover={{ 
                            scale: 1.05,
                            rotate: [0, -2, 2, 0],
                            transition: {
                              rotate: {
                                duration: 0.5,
                                ease: "easeInOut"
                              }
                            }
                          }}
                        >
                          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">BlockRent</h3>
                          <p className="text-gray-600 text-lg">Location décentralisée</p>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Section fonctionnalités avec animations */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="py-24 my-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/80 to-white rounded-[3rem]"></div>
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            </div>
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full">Simple comme bonjour</span>
                <h2 className="text-4xl font-bold mt-6 mb-6">Comment ça marche ? 🤔</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Un processus en 3 étapes, aussi facile que de commander une pizza !
              </p>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
              <motion.div 
                className="bg-white p-8 rounded-3xl shadow-lg border-2 border-blue-100/50 hover:border-blue-300 transition-all hover:shadow-2xl hover:-translate-y-2 duration-300 relative overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ 
                  y: -5,
                  transition: {
                    duration: 0.2
                  }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 transform group-hover:scale-110 group-hover:rotate-6 duration-300"
                  whileHover={{ 
                    rotate: [0, -10, 10, 0],
                    transition: {
                      duration: 0.5
                    }
                  }}
                >
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-semibold mb-4 text-center">1. Trouvez votre bonheur</h3>
                <p className="text-lg text-gray-600 text-center">
                  Parcourez notre galerie d&apos;équipements cool et trouvez exactement ce dont vous avez besoin !
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-8 rounded-3xl shadow-lg border-2 border-blue-100/50 hover:border-blue-300 transition-all hover:shadow-2xl hover:-translate-y-2 duration-300 relative overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ 
                  y: -5,
                  transition: {
                    duration: 0.2
                  }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 transform group-hover:scale-110 group-hover:rotate-6 duration-300"
                  whileHover={{ 
                    rotate: [0, -10, 10, 0],
                    transition: {
                      duration: 0.5
                    }
                  }}
                >
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-semibold mb-4 text-center">2. Réservez en 2 clics</h3>
                <p className="text-lg text-gray-600 text-center">
                  Choisissez vos dates et payez en ETH, rapidement, simplement et sans paperasse !
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-8 rounded-3xl shadow-lg border-2 border-blue-100/50 hover:border-blue-300 transition-all hover:shadow-2xl hover:-translate-y-2 duration-300 relative overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ 
                  y: -5,
                  transition: {
                    duration: 0.2
                  }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 transform group-hover:scale-110 group-hover:rotate-6 duration-300"
                  whileHover={{ 
                    rotate: [0, -10, 10, 0],
                    transition: {
                      duration: 0.5
                    }
                  }}
                >
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-semibold mb-4 text-center">3. Profitez et rendez !</h3>
                <p className="text-lg text-gray-600 text-center">
                  Amusez-vous avec l&apos;équipement, puis retournez-le pour récupérer automatiquement votre caution. Magie !
                </p>
              </motion.div>
            </div>
          </section>
          
          {/* Avantages supplémentaires */}
          <section className="py-24 mb-24 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] opacity-50"></div>
            </div>
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-full">Avantages exclusifs</span>
                <h2 className="text-4xl font-bold mt-6 mb-6">Pourquoi choisir BlockRent ? 🌟</h2>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6">
              <motion.div 
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 relative overflow-hidden group"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v3m0 0l3-3m-3 3l-3-3m3-3V4m0 0l-3 3m3-3l3 3" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Caution 100% sécurisée</h3>
                    <p className="text-lg text-gray-600">
                      Votre caution est verrouillée dans un smart contract, pas dans la poche de quelqu&apos;un. Sécurité maximale ! 🔒
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 relative overflow-hidden group"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Zéro intermédiaire</h3>
                    <p className="text-lg text-gray-600">
                      Louez directement entre particuliers. Pas d&apos;entreprise qui prend une commission de 30% ! 🤝
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 relative overflow-hidden group"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Paiements instantanés</h3>
                    <p className="text-lg text-gray-600">
                      Fini l&apos;attente de 3-5 jours ouvrés pour les remboursements. Tout se passe en quelques secondes ! ⚡
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 relative overflow-hidden group"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Transparence totale</h3>
                    <p className="text-lg text-gray-600">
                      Toutes les transactions sont sur la blockchain. Visibles par tous, modifiables par personne ! 👁️
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
          
          {/* Section appel à l'action avec animation */}
          <section className="py-24 md:py-32 text-center relative overflow-hidden mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50/30 to-blue-50 rounded-3xl"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] opacity-30"></div>
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl font-bold mb-8">Prêt à révolutionner vos locations ? 🚀</h2>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                  Rejoignez les centaines d&apos;utilisateurs qui ont déjà adopté la location décentralisée !
              </p>
              <div className="flex flex-wrap justify-center gap-6">
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
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
