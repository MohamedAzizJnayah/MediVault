export interface Medication {

  id: string;

  name: string;              // Nom du médicament (ex: Doliprane)
  dosage: number;            // Quantité (ex: 500)
  unit: string;              // mg, ml, comprimé…

  frequencyPerDay: number;   // Nombre de prises par jour
  times?: string[];          // Heures de prise (ex: ["08:00", "20:00"])

  stock: number;             // Stock actuel
  lowStockThreshold: number; // Seuil d’alerte (ex: 1)

  startDate: string;         // Date de début
  endDate?: string;          // Date de fin (optionnelle)

  notes?: string;            // Notes optionnelles
}
