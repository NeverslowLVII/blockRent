"use client";

import { Button } from "@/components/ui/Button";
import { X, AlertTriangle, Check, Copy } from "lucide-react";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface NetworkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NetworkGuideModal({ isOpen, onClose }: NetworkGuideModalProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-xl translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg p-0 overflow-auto max-h-[85vh] animate-fade-in">
          <div className="relative">
            <Dialog.Close asChild>
              <button 
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
            
            <div className="p-6 pt-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-7 w-7 text-yellow-500" />
                <Dialog.Title className="text-2xl font-bold">Configuration du réseau Polygon Amoy</Dialog.Title>
              </div>
              
              <Dialog.Description className="sr-only">
                Instructions pour ajouter manuellement le réseau Polygon Amoy à votre portefeuille
              </Dialog.Description>
              
              <div className="my-4 text-gray-700">
                <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200 text-yellow-800">
                  <p className="font-medium">Votre portefeuille nécessite l'ajout manuel du réseau Polygon Amoy Testnet.</p>
                  <p>L'erreur "Unrecognized chain ID" indique que votre portefeuille ne reconnaît pas ce réseau.</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                  <h3 className="font-semibold text-lg mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-blue-100 text-blue-700 rounded-full w-6 h-6 mr-2">1</span>
                    Étapes d'ajout du réseau
                  </h3>
                  <ol className="space-y-3 list-decimal list-inside pl-8">
                    <li>Ouvrez votre portefeuille (Rabby ou MetaMask)</li>
                    <li>Allez dans <span className="font-semibold">Paramètres &gt; Réseaux &gt; Ajouter un réseau</span></li>
                    <li>Sélectionnez <span className="font-semibold">Ajouter un réseau manuellement</span></li>
                    <li>Entrez les informations suivantes :</li>
                  </ol>
                  
                  <div className="mt-4 bg-white p-4 rounded border border-gray-200 font-mono text-sm">
                    {[
                      { label: "Nom du réseau", value: "Polygon Amoy Testnet" },
                      { label: "URL RPC", value: "https://rpc-amoy.polygon.technology" },
                      { label: "ID de chaîne", value: "80002" },
                      { label: "Symbole de devise", value: "POL" },
                      { label: "Explorateur de blocs", value: "https://amoy.polygonscan.com/" }
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center mb-2 last:mb-0">
                        <p><span className="font-semibold">{item.label}:</span> {item.value}</p>
                        <button 
                          onClick={() => copyToClipboard(item.value, item.label)}
                          className="p-1 rounded hover:bg-gray-100"
                          title="Copier"
                        >
                          {copied === item.label ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    ))}
                    <p className="text-xs text-gray-500 mt-2">Note: Pour l'ID de chaîne en hexadécimal, utilisez 0x13882</p>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-100">
                  <h3 className="font-semibold text-lg mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-green-100 text-green-700 rounded-full w-6 h-6 mr-2">2</span>
                    Obtenir des POL de test
                  </h3>
                  <p className="mb-2">Une fois connecté au réseau, vous aurez besoin de POL de test :</p>
                  <div className="flex flex-col space-y-2">
                    <a 
                      href="https://amoy.polygonscan.com/faucet" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium flex items-center gap-2"
                    >
                      Visiter le faucet officiel Polygon Amoy
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7"></path>
                        <path d="M7 7H17V17"></path>
                      </svg>
                    </a>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg mb-6 border border-purple-100">
                  <h3 className="font-semibold text-lg mb-2">Résolution des problèmes</h3>
                  <ul className="space-y-2 pl-5 list-disc">
                    <li>Si vous rencontrez encore des erreurs, essayez de redémarrer votre navigateur</li>
                    <li>Assurez-vous que vous êtes bien connecté à Internet</li>
                    <li>Vérifiez que vous avez bien entré l'ID de chaîne 80002</li>
                    <li>Si vous utilisez Rabby, vérifiez qu'il est à jour</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <Dialog.Close asChild>
                  <Button size="lg" className="px-8">
                    J'ai compris, fermer
                  </Button>
                </Dialog.Close>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 