import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="fr">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
