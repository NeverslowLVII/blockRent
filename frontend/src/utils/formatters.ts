/**
 * Formatte un prix en ETH avec l'unité
 * @param price Le prix à formater (chaîne ou nombre)
 * @returns La chaîne formatée
 */
export const formatPrice = (price: string): string => {
  return `${price} ETH`;
};

/**
 * Formatte une date timestamp en date locale
 * @param timestamp Le timestamp à formater
 * @returns La date formatée en chaîne localisée
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString();
};

/**
 * Tronque une adresse Ethereum pour l'affichage
 * @param address L'adresse à tronquer
 * @returns L'adresse tronquée (6 premiers et 4 derniers caractères)
 */
export const formatAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Calcule le nombre de jours entre deux dates
 * @param startDate Date de début
 * @param endDate Date de fin
 * @returns Le nombre de jours (arrondi au supérieur)
 */
export const calculateDaysBetween = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
};

/**
 * Génère la date minimale (aujourd'hui) au format YYYY-MM-DD
 * @returns La date minimale formatée
 */
export const getMinDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}; 