export interface MedicalRecord {
  id: string;
  filename: string;
  type?: string;
  date?: string;          // ISO: "2025-12-13"
  tags?: string[];
  url?: string;           // lien preview/download
  file?:File;     // "application/pdf" ou "image/png"
}
