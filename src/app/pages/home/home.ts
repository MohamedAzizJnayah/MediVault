import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MedicationService } from '../../services/medication.service';
import { Medication } from '../../models/medication.model';

type NextDose = { time: string; name: string };
type LowStock = { count: number; quantityText: string; medicationText: string };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  todayLoading = true;
  todayError: string | null = null;

  nextDose: NextDose = { time: '--:--', name: '—' };
  lowStock: LowStock = { count: 0, quantityText: 'Aucun', medicationText: 'Tout est OK' };

  constructor(private medicationService: MedicationService) {}

  ngOnInit(): void {
    this.loadTodayPreview();
  }

  private loadTodayPreview(): void {
    this.todayLoading = true;
    this.todayError = null;

    this.medicationService.getMedications().subscribe({
      next: (meds) => {
        const activeToday = meds.filter(m => this.isActiveToday(m));

        this.nextDose = this.computeNextDose(activeToday);
        this.lowStock = this.computeLowStock(activeToday);

        this.todayLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.todayError = "Impossible de charger l’aperçu.";
        this.todayLoading = false;
      }
    });
  }

  private isActiveToday(m: Medication): boolean {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    if (m.startDate && m.startDate > today) return false;
    if (m.endDate && m.endDate < today) return false;
    return true;
  }

  private computeNextDose(meds: Medication[]): NextDose {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    let bestMinutes = Number.POSITIVE_INFINITY;
    let bestTime = '--:--';
    let bestName = 'Aucune prise prévue';

    for (const m of meds) {
      const times = (m.times && m.times.length)
        ? m.times
        : this.generateTimesFromFrequency(m.frequencyPerDay);

      for (const t of times) {
        const minutes = this.toMinutes(t);
        if (minutes >= nowMinutes && minutes < bestMinutes) {
          bestMinutes = minutes;
          bestTime = t;
          bestName = m.name;
        }
      }
    }

    return { time: bestTime, name: bestName };
  }

  private computeLowStock(meds: Medication[]): LowStock {
    const low = meds.filter(m => m.stock <= m.lowStockThreshold);

    if (low.length === 0) {
      return { count: 0, quantityText: 'Aucun', medicationText: 'Stock OK' };
    }

    // le plus critique = stock le plus bas
    const worst = low.reduce((a, b) => (a.stock <= b.stock ? a : b));

    const qty = worst.stock <= 1 ? `${worst.stock} comprimé` : `${worst.stock} comprimés`;
    const label = `${worst.name} ${worst.dosage}${worst.unit}`;

    return {
      count: low.length,
      quantityText: qty,
      medicationText: label,
    };
  }

  private generateTimesFromFrequency(freq: number): string[] {
    const slots = Math.max(freq || 1, 1);
    const start = 8 * 60;
    const end = 20 * 60;
    const step = slots === 1 ? 0 : Math.floor((end - start) / (slots - 1));

    const out: string[] = [];
    for (let i = 0; i < slots; i++) out.push(this.toHHMM(start + i * step));
    return out;
  }

  private toMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  private toHHMM(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
}
