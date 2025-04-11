import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import type { Metadata } from "next";
import Layout from '@/components/ui/Layout'
import NetworkAlert from '@/components/dashboard/NetworkAlert';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "BlockRent - Location d'équipements sur blockchain",
  description: "Plateforme décentralisée de location d'équipements basée sur la blockchain Ethereum",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable}`}>
      <body>
        <Providers>
          {/* 
            Layout contient déjà le header/navbar et le footer global
            Ne pas ajouter de navbar ou footer dans les pages individuelles
          */}
          <Layout>
            {children}
          </Layout>
          <NetworkAlert />
        </Providers>
      </body>
    </html>
  );
}
