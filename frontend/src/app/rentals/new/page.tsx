"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useContracts } from "@/lib/hooks/useContracts";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ethers } from "ethers";
import Loader from "@/components/ui/Loader";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getMinDate } from "@/utils/formatters";

// Schéma de validation zod pour le formulaire de location
const rentalSchema = z.object({
  startDate: z.string().refine(val => new Date(val) >= new Date(getMinDate()), {
    message: "La date de début doit être aujourd'hui ou ultérieure"
  }),
  endDate: z.string().refine(val => new Date(val) >= new Date(getMinDate()), {
    message: "La date de fin doit être aujourd'hui ou ultérieure"
  }),
}).refine(data => new Date(data.endDate) >= new Date(data.startDate), {
  message: "La date de fin doit être postérieure ou égale à la date de début",
  path: ["endDate"]
});

type RentalFormValues = z.infer<typeof rentalSchema>;

// Type pour l'équipement
interface Equipment {
  id: number;
  owner: string;
  name: string;
  description: string;
  imageURI: string;
  dailyRate: string;
  isAvailable: boolean;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

export default function NewRentalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const equipmentId = searchParams.get("equipmentId");
  
  const { isConnected, connect, contracts, account } = useContracts();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [totalAmount, setTotalAmount] = useState<string>("0");
  
  // Initialiser React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm<RentalFormValues>({
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      startDate: getMinDate(),
      endDate: getMinDate()
    }
  });

  // Observer les dates pour calculer le montant total
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  // Charger les détails de l'équipement
  useEffect(() => {
    if (!equipmentId) {
      setError("ID d'équipement manquant");
      setIsLoadingEquipment(false);
      return;
    }

    if (isConnected && contracts.equipmentRegistry) {
      loadEquipmentData();
    }
  }, [isConnected, contracts, equipmentId]);

  // Calculer le montant total lorsque les dates changent
  useEffect(() => {
    if (equipment && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Calculer le nombre de jours
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 pour inclure le jour de début

      // Calculer le montant total
      const dailyRateEth = parseFloat(equipment.dailyRate);
      const totalEth = dailyRateEth * diffDays;
      
      setTotalAmount(totalEth.toFixed(5));
    }
  }, [equipment, startDate, endDate]);

  const loadEquipmentData = async () => {
    if (!contracts.equipmentRegistry || !equipmentId) return;
    
    try {
      setIsLoadingEquipment(true);
      setError(null);

      // Récupérer les détails de l'équipement
      const equipmentData = await contracts.equipmentRegistry.getEquipment(equipmentId);
      
      const equipmentObj = {
        id: Number(equipmentData.id),
        owner: equipmentData.owner,
        name: equipmentData.name,
        description: equipmentData.description,
        imageURI: equipmentData.imageURI,
        dailyRate: ethers.formatEther(equipmentData.dailyRate),
        isAvailable: equipmentData.isAvailable,
        createdAt: Number(equipmentData.createdAt),
        updatedAt: Number(equipmentData.updatedAt),
        isDeleted: equipmentData.isDeleted
      };
      
      // Vérifier si l'équipement est disponible
      if (!equipmentObj.isAvailable) {
        setError("Cet équipement n'est pas disponible à la location");
      }
      
      // Vérifier si l'utilisateur est le propriétaire de l'équipement
      if (account && account.toLowerCase() === equipmentObj.owner.toLowerCase()) {
        setError("Vous ne pouvez pas louer votre propre équipement");
      }
      
      setEquipment(equipmentObj);
    } catch (err: any) {
      console.error("Erreur lors du chargement de l'équipement:", err);
      setError("Erreur lors du chargement de l'équipement. Veuillez réessayer.");
    } finally {
      setIsLoadingEquipment(false);
    }
  };

  const onSubmit = async (data: RentalFormValues) => {
    if (!isConnected) {
      try {
        await connect();
        return; // Après connexion, l'utilisateur devra resoumettre le formulaire
      } catch (err) {
        return;
      }
    }

    if (!contracts.rentalManager || !equipment) {
      setError("Contrat non disponible ou équipement non chargé");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Convertir les dates en timestamps (secondes depuis l'epoch)
      const startTimestamp = Math.floor(new Date(data.startDate).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(data.endDate).getTime() / 1000);
      
      // Vérifier que l'équipement est disponible pour ces dates
      const isAvailable = await contracts.rentalManager.checkAvailability(
        equipment.id,
        startTimestamp,
        endTimestamp
      );
      
      if (!isAvailable) {
        throw new Error("L'équipement n'est pas disponible pour ces dates");
      }

      // Calculer le montant à payer (tarif journalier * nombre de jours)
      const dailyRateWei = ethers.parseEther(equipment.dailyRate);
      const days = Math.ceil((endTimestamp - startTimestamp) / 86400) + 1; // +1 pour inclure le jour de début
      const amountWei = dailyRateWei * BigInt(days);
      const depositWei = dailyRateWei * BigInt(2); // La caution est 2x le tarif journalier
      const totalWei = amountWei + depositWei;
      
      console.log("Montant à payer:", ethers.formatEther(totalWei), "ETH");

      // Créer la location
      const tx = await contracts.rentalManager.createRental(
        equipment.id,
        startTimestamp,
        endTimestamp,
        {
          value: totalWei, // Montant total à payer (location + caution)
          gasLimit: 500000,
          maxFeePerGas: ethers.parseUnits("50", "gwei"),
          maxPriorityFeePerGas: ethers.parseUnits("30", "gwei")
        }
      );

      // Attendre la confirmation de la transaction
      await tx.wait();
      
      // Rediriger vers la page des locations
      router.push("/rentals");
    } catch (err: any) {
      console.error("Erreur lors de la création de la location:", err);
      
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
        setError(err.message || "Une erreur est survenue lors de la création de la location. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!equipmentId) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Nouvelle location</h1>
          <Card>
            <CardContent className="text-center py-16">
              <p className="text-lg text-red-600 mb-8">
                Aucun équipement sélectionné. Veuillez choisir un équipement à louer.
              </p>
              <div className="flex justify-center">
                <Button size="lg" onClick={() => router.push("/equipments")}>
                  Voir les équipements
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="animate-fade-in">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Nouvelle location</h1>
          <Card>
            <CardContent className="text-center py-16">
              <p className="text-lg text-gray-600 mb-8">
                Connectez votre portefeuille pour louer cet équipement.
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
        <h1 className="text-3xl font-bold mb-6">Nouvelle location</h1>

        {isLoadingEquipment ? (
          <Card>
            <CardContent className="flex justify-center items-center py-20">
              <Loader size="lg" />
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
              <Button onClick={() => router.push("/equipments")}>
                Retour aux équipements
              </Button>
            </CardContent>
          </Card>
        ) : equipment ? (
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative h-48 md:w-1/3 bg-gray-100 rounded-lg overflow-hidden">
                    {equipment.imageURI ? (
                      <img 
                        src={equipment.imageURI} 
                        alt={equipment.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-gray-400">Image non disponible</span>
                      </div>
                    )}
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold mb-2">{equipment.name}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{equipment.description}</p>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Tarif journalier:</span>
                        <span className="ml-2 font-semibold">{equipment.dailyRate} ETH</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Caution:</span>
                        <span className="ml-2 font-semibold">{parseFloat(equipment.dailyRate) * 2} ETH</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Date de début
                    </label>
                    <Input
                      id="startDate"
                      type="date"
                      min={getMinDate()}
                      {...register("startDate")}
                      aria-invalid={errors.startDate ? "true" : "false"}
                    />
                    {errors.startDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Date de fin
                    </label>
                    <Input
                      id="endDate"
                      type="date"
                      min={startDate}
                      {...register("endDate")}
                      aria-invalid={errors.endDate ? "true" : "false"}
                    />
                    {errors.endDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Résumé de la location</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span>{totalAmount} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Caution (remboursable):</span>
                      <span>{parseFloat(equipment.dailyRate) * 2} ETH</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total à payer:</span>
                      <span>{(parseFloat(totalAmount) + parseFloat(equipment.dailyRate) * 2).toFixed(5)} ETH</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/equipments/${equipment.id}`)}
                  >
                    Annuler
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <Loader size="sm" />
                        <span className="ml-2">Création en cours...</span>
                      </div>
                    ) : (
                      "Réserver maintenant"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
} 