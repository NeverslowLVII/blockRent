"use client";

import Link from "next/link";
import { useContracts } from '@/lib/hooks/useContracts';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function Home() {
  const { isConnected, connect } = useContracts();
  
  return (
    <div className="relative">
      {/* Network notification */}
      <div className="absolute top-2 right-2 z-30">
        <div className="inline-flex items-center px-2 py-1 bg-amber-50/90 border border-amber-200/50 text-xs text-amber-800 rounded-full shadow-sm backdrop-blur-sm hover:bg-amber-100/90 transition-colors duration-200">
          <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
          Polygon Testnet
        </div>
      </div>
      
      {/* Main content wrapper */}
      <div className="animate-fade-in">
        {/* Section Hero avec animation */}
        <section className="relative">
          {/* Full-width background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            {/* Cercles flous d'arrière-plan */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
          </div>
          
          {/* Content with max-width */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="py-24 md:py-32 mb-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <motion.div
                  className="lg:col-span-7"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="relative">
                    <motion.div 
                      className="absolute -top-6 -left-6 w-12 h-12 bg-blue-500/10 rounded-full blur-sm"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div 
                      className="absolute top-1/2 -right-8 w-16 h-16 bg-purple-500/10 rounded-full blur-sm"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                    <h1 className="text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                      <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Louez de l&apos;équipement</span>
                      <span className="block mt-2 text-gray-900">sans <span className="relative inline-block">
                        tracas
                        <motion.div 
                          className="absolute bottom-2 left-0 w-full h-3 bg-indigo-200 -z-10 rounded-sm"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 0.8, duration: 0.6 }}
                        ></motion.div>
                      </span> !</span>
                    </h1>
                  </div>
                  <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
                    Transactions sécurisées par blockchain, zéro intermédiaire, location nouvelle génération.
                  </p>
                  <div className="flex flex-wrap gap-5">
                    <Link href="/equipments">
                      <Button variant="default" size="lg" className="rounded-full bg-indigo-600 hover:bg-indigo-700 px-8 h-14 shadow-lg shadow-indigo-500/20 font-medium group transition-all duration-300 ease-out hover:translate-y-[-2px]">
                        <span className="relative z-10">Explorer les équipements</span>
                        <motion.div 
                          className="absolute right-8 flex items-center"
                          initial={{ opacity: 1 }}
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </motion.div>
                      </Button>
                    </Link>
                    {!isConnected && (
                      <Button variant="outline" size="lg" onClick={connect} className="rounded-full h-14 border-2 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50/50 font-medium transition-all duration-300 hover:translate-y-[-2px]">
                        <svg className="w-5 h-5 mr-2 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.67 2H16.67C15.56 2 14.67 2.9 14.67 4V6C14.67 7.1 15.57 8 16.67 8H18.67C19.77 8 20.67 7.1 20.67 6V4C20.67 2.9 19.77 2 18.67 2Z" fill="currentColor"/>
                          <path d="M7.33 16H5.33C4.23 16 3.33 16.9 3.33 18V20C3.33 21.1 4.23 22 5.33 22H7.33C8.43 22 9.33 21.1 9.33 20V18C9.33 16.9 8.43 16 7.33 16Z" fill="currentColor"/>
                          <path d="M18.67 16H16.67C15.56 16 14.67 16.9 14.67 18V20C14.67 21.1 15.57 22 16.67 22H18.67C19.77 22 20.67 21.1 20.67 20V18C20.67 16.9 19.77 16 18.67 16Z" fill="currentColor" opacity="0.4"/>
                          <path d="M7.33 2H5.33C4.23 2 3.33 2.9 3.33 4V6C3.33 7.1 4.23 8 5.33 8H7.33C8.43 8 9.33 7.1 9.33 6V4C9.33 2.9 8.43 2 7.33 2Z" fill="currentColor" opacity="0.4"/>
                          <path d="M12 14.33C9.52 14.33 7.5 12.31 7.5 9.83V8.5C7.5 8.09 7.84 7.75 8.25 7.75C8.66 7.75 9 8.09 9 8.5V9.83C9 11.49 10.34 12.83 12 12.83C13.66 12.83 15 11.49 15 9.83V8.5C15 8.09 15.34 7.75 15.75 7.75C16.16 7.75 16.5 8.09 16.5 8.5V9.83C16.5 12.31 14.48 14.33 12 14.33Z" fill="currentColor"/>
                        </svg>
                        <span className="text-gray-800">Connecter mon wallet</span>
                      </Button>
                    )}
                  </div>
                  
                  {/* Badges feature */}
                  <div className="mt-16 hidden md:flex space-x-6">
                    <motion.div 
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <span className="text-gray-600">Sécurisé</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <span className="text-gray-600">Rapide</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-600">Économique</span>
                    </motion.div>
                  </div>
                </motion.div>
                <div className="lg:col-span-5 hidden lg:block relative">
                  <div className="relative h-[520px] w-full">
                    <div className="absolute top-0 right-0 w-full h-full">
                      {/* Arrière-plan avec effet de blob animé */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-400/5 to-blue-500/10 rounded-3xl backdrop-blur-[2px]"
                        animate={{ 
                          borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "70% 30% 30% 70% / 70% 70% 30% 30%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
                        }}
                        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,white_0%,rgba(255,255,255,0)_60%)] opacity-60"></div>
                      </motion.div>
                      
                      {/* Illustration 3D d'un téléphone montrant l'app */}
                      <motion.div 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                      >
                        <motion.div 
                          className="relative w-[320px] h-[580px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-[45px] shadow-[0_50px_100px_-20px_rgba(79,70,229,0.25),0_30px_60px_-30px_rgba(79,70,229,0.3)] border-[6px] border-gray-800 overflow-hidden"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ 
                            duration: 4, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                        >
                          {/* Boutons latéraux */}
                          <div className="absolute left-[-6px] top-[130px] w-[6px] h-[40px] bg-gray-700 rounded-l-lg"></div>
                          <div className="absolute left-[-6px] top-[190px] w-[6px] h-[70px] bg-gray-700 rounded-l-lg"></div>
                          <div className="absolute right-[-6px] top-[150px] w-[6px] h-[50px] bg-gray-700 rounded-r-lg"></div>
                          
                          {/* Encoche */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[140px] h-[35px] bg-gray-900 rounded-b-[18px] z-20"></div>
                          
                          {/* Écran */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 m-[1px] rounded-[40px] overflow-hidden">
                            {/* Contenu de l'app */}
                            <div className="w-full h-full flex flex-col">
                              {/* Header de l'app */}
                              <div className="bg-white py-4 px-5 flex items-center border-b border-gray-100 shadow-sm">
                                {/* Logo déplacé plus bas pour éviter la notch */}
                                <div className="w-full flex items-center justify-between mt-5">
                                  <motion.div 
                                    className="w-9 h-9 flex items-center justify-center"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  >
                                    <img src="/blockrent.svg" alt="BlockRent Logo" className="h-8" />
                                  </motion.div>
                                  <div className="flex space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Contenu de l'app */}
                              <div className="flex-1 overflow-hidden bg-gray-50/50">
                                <div className="py-6 px-5">
                                  <motion.div 
                                    className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 mb-4 hover:shadow-lg transition-shadow duration-300"
                                    whileHover={{ y: -4 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                  >
                                    <div className="flex items-center mb-3">
                                      <div className="h-3 w-28 bg-indigo-200 rounded-full"></div>
                                      <div className="ml-auto flex space-x-1">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                                          <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="relative w-full h-36 bg-gray-100 rounded-xl mb-3 overflow-hidden">
                                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10"></div>
                                      <div className="absolute bottom-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md shadow-sm">0.320 ETH/jour</div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <div className="h-2.5 w-24 bg-gray-200 rounded-full mb-2"></div>
                                        <div className="h-2.5 w-32 bg-gray-200 rounded-full"></div>
                                      </div>
                                      <div className="h-8 w-20 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <div className="h-2 w-12 bg-indigo-400 rounded-full"></div>
                                      </div>
                                    </div>
                                  </motion.div>
                                  
                                  <motion.div 
                                    className="bg-white rounded-2xl shadow-md p-4 border border-gray-100 mb-4 hover:shadow-lg transition-shadow duration-300"
                                    whileHover={{ y: -4 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                  >
                                    <div className="flex items-center mb-3">
                                      <div className="h-3 w-28 bg-purple-200 rounded-full"></div>
                                      <div className="ml-auto flex space-x-1">
                                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                                          <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="relative w-full h-36 bg-gray-100 rounded-xl mb-3 overflow-hidden">
                                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10"></div>
                                      <div className="absolute bottom-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-md shadow-sm">0.150 ETH/jour</div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <div className="h-2.5 w-24 bg-gray-200 rounded-full mb-2"></div>
                                        <div className="h-2.5 w-32 bg-gray-200 rounded-full"></div>
                                      </div>
                                      <div className="h-8 w-20 bg-purple-100 rounded-full flex items-center justify-center">
                                        <div className="h-2 w-12 bg-purple-400 rounded-full"></div>
                                      </div>
                                    </div>
                                  </motion.div>
                                </div>
                              </div>
                              
                              {/* Navigation app */}
                              <div className="bg-white py-4 px-4 border-t border-gray-100 flex justify-around items-center shadow-[0_-1px_5px_rgba(0,0,0,0.05)]">
                                <motion.div 
                                  className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm"
                                  whileHover={{ scale: 1.1, backgroundColor: "#c7d2fe" }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                  </svg>
                                </motion.div>
                                <motion.div 
                                  className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shadow-sm"
                                  whileHover={{ scale: 1.1, backgroundColor: "#e5e7eb" }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                                  </svg>
                                </motion.div>
                                <motion.div 
                                  className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shadow-sm"
                                  whileHover={{ scale: 1.1, backgroundColor: "#e5e7eb" }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                        
                        {/* Badges flottants */}
                        <motion.div 
                          className="absolute -right-12 -top-6 bg-white px-4 py-2 rounded-full shadow-lg font-medium text-sm flex items-center border border-gray-50"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2, duration: 0.6 }}
                        >
                          <span className="text-indigo-600 mr-2">🔒</span>
                          <span className="text-gray-700">Caution sécurisée</span>
                        </motion.div>
                        
                        <motion.div 
                          className="absolute -left-16 top-[30%] bg-white px-4 py-2 rounded-full shadow-lg font-medium text-sm flex items-center border border-gray-50"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.5, duration: 0.6 }}
                        >
                          <span className="text-green-600 mr-2">⚡</span>
                          <span className="text-gray-700">Paiement rapide</span>
                        </motion.div>
                        
                        <motion.div 
                          className="absolute -left-12 -bottom-6 bg-white px-4 py-2 rounded-full shadow-lg font-medium text-sm flex items-center border border-gray-50"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.8, duration: 0.6 }}
                        >
                          <span className="text-amber-600 mr-2">🤝</span>
                          <span className="text-gray-700">Zéro intermédiaire</span>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Petits éléments décoratifs */}
                  <motion.div 
                    className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, 0],
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                </div>
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
