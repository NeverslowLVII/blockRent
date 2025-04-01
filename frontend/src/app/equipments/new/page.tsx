"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContracts } from "@/lib/hooks/useContracts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ethers } from "ethers";
import Loader from "@/components/ui/Loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Upload, Link as LinkIcon } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

// Initialiser le client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NewEquipmentPage() {
  const router = useRouter();
  const { isConnected, connect, contracts } = useContracts();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageTab, setImageTab] = useState<"upload" | "url">("upload");
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageURI: "",
    dailyRate: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5MB");
      return;
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError("Format d'image non supporté. Utilisez JPG, PNG ou WEBP");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Créer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload vers Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('equipment-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(uploadError.message || "Erreur lors de l'upload de l'image");
      }

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('equipment-images')
        .getPublicUrl(fileName);

      // Mettre à jour le formulaire avec l'URL de l'image
      setFormData(prev => ({ ...prev, imageURI: publicUrl }));
      setPreview(URL.createObjectURL(file));

    } catch (err: any) {
      console.error("Erreur lors de l'upload de l'image:", err);
      setError(err.message || "Erreur lors de l'upload de l'image. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      connect();
      return;
    }

    if (!contracts.equipmentRegistry) {
      setError("Contrat non disponible. Veuillez vérifier votre connexion.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Validation des champs
      if (!formData.name || !formData.description || !formData.dailyRate) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      if (!formData.imageURI) {
        throw new Error("Veuillez ajouter une image");
      }

      // Convertir le tarif journalier en wei
      const dailyRateWei = ethers.parseEther(formData.dailyRate);

      // Estimer les frais de gas
      const gasEstimate = await contracts.equipmentRegistry.registerEquipment.estimateGas(
        formData.name,
        formData.description,
        formData.imageURI,
        dailyRateWei
      );

      // Enregistrer l'équipement avec des paramètres de gas optimisés
      const tx = await contracts.equipmentRegistry.registerEquipment(
        formData.name,
        formData.description,
        formData.imageURI,
        dailyRateWei,
        {
          gasLimit: gasEstimate + (gasEstimate / BigInt(5)),
          maxFeePerGas: ethers.parseUnits("0.1", "gwei"),
          maxPriorityFeePerGas: ethers.parseUnits("0.1", "gwei")
        }
      );

      await tx.wait();
      router.push("/equipments");
    } catch (err: any) {
      console.error("Erreur lors de l'enregistrement de l'équipement:", err);
      
      // Gestion des erreurs spécifiques
      if (err.code === 'ACTION_REJECTED') {
        setError("Transaction rejetée. Vous avez annulé la transaction.");
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        setError("Fonds insuffisants pour effectuer la transaction.");
      } else if (err.message?.includes('user rejected')) {
        setError("Transaction annulée. Vous avez rejeté la signature.");
      } else if (err.message?.includes('gas')) {
        setError("Erreur de gas. Veuillez réessayer avec un montant de gas plus élevé.");
      } else {
        setError("Une erreur est survenue lors de l'enregistrement de l'équipement. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "imageURI" && imageTab === "url") {
      setPreview(value);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isConnected) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Ajouter un équipement</h1>
          <Card>
            <CardContent className="text-center py-16">
              <p className="text-lg text-gray-600 mb-8">
                Connectez votre portefeuille pour ajouter un équipement.
              </p>
              <div className="flex justify-center">
                <Button size="lg" onClick={connect}>
                  Connecter mon portefeuille
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Ajouter un équipement</h1>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l&apos;équipement
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Tractopelle CAT"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez votre équipement en détail..."
                  required
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Image de l&apos;équipement
                </label>
                <Tabs value={imageTab} onValueChange={(v) => setImageTab(v as "upload" | "url")} className="mb-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Uploader une image
                    </TabsTrigger>
                    <TabsTrigger value="url" className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      URL de l&apos;image
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="mt-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mb-4"
                      disabled={isLoading}
                    />
                    {isLoading && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Loader size="sm" />
                        <span>Upload en cours...</span>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="url" className="mt-4">
                    <Input
                      name="imageURI"
                      type="url"
                      value={formData.imageURI}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="mb-4"
                    />
                  </TabsContent>
                </Tabs>

                {/* Prévisualisation de l'image */}
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Prévisualisation"
                      className="w-full h-full object-cover"
                      onError={() => {
                        setPreview(null);
                        if (imageTab === "url") {
                          setFormData(prev => ({ ...prev, imageURI: "" }));
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <Package className="h-12 w-12 mb-2" />
                      <p className="text-sm">Aucune image sélectionnée</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="dailyRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Tarif journalier (en ETH)
                </label>
                <Input
                  id="dailyRate"
                  name="dailyRate"
                  type="number"
                  step="0.001"
                  min="0"
                  value={formData.dailyRate}
                  onChange={handleChange}
                  placeholder="0.1"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                  {error}
                </div>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader size="sm" />
                      <span className="ml-2">Enregistrement en cours...</span>
                    </div>
                  ) : (
                    "Enregistrer l'équipement"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 