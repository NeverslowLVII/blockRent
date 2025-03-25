"use client";

import { useContracts } from "@/lib/hooks/useContracts";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { connect, isConnected } = useContracts();

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Location d'équipements professionnels sur <span className="text-blue-600">blockchain</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Louez en toute sécurité grâce à notre plateforme décentralisée.
              Transactions transparentes, cautions automatisées et service fiable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {!isConnected ? (
                <button
                  onClick={connect}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition"
                >
                  Connecter mon portefeuille
                </button>
              ) : (
                <Link
                  href="/equipments"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition text-center"
                >
                  Voir les équipements
                </Link>
              )}
              <Link
                href="/about"
                className="bg-white hover:bg-gray-100 text-blue-600 font-medium py-3 px-8 rounded-lg text-lg border border-blue-600 transition text-center"
              >
                En savoir plus
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="relative h-80 md:h-96 w-full">
              <div className="bg-blue-600 rounded-2xl h-full w-full absolute top-0 left-0 opacity-10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Équipements professionnels</h3>
                  <p className="text-gray-600">
                    Tractopelles, excavatrices, chariots élévateurs, échafaudages et plus encore...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-t">
        <h2 className="text-3xl font-bold text-center mb-16">Comment ça fonctionne</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-blue-600 font-semibold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Enregistrement d'équipements</h3>
            <p className="text-gray-600">
              Les propriétaires enregistrent leurs équipements avec détails, photos et tarifs journaliers.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-blue-600 font-semibold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Création de location</h3>
            <p className="text-gray-600">
              Les locataires réservent l'équipement pour une période déterminée et déposent une caution.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-blue-600 font-semibold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Confirmation et retour</h3>
            <p className="text-gray-600">
              Le propriétaire confirme la location, puis le retour de l'équipement pour libérer la caution.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 border-t">
        <div className="bg-blue-50 p-8 md:p-12 rounded-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez notre plateforme dès aujourd'hui et découvrez une nouvelle façon de louer ou de proposer des équipements à la location.
          </p>
          {!isConnected ? (
            <button
              onClick={connect}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition"
            >
              Connecter mon portefeuille
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition inline-block"
            >
              Accéder à mon tableau de bord
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
