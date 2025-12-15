import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Medication } from '../../../models/medication.model';
import { MedicationService } from '../../../services/medication.service';


type DoseEvent = {
  medicationId: string;
  name: string;
  dosageText: string;
  time: string;      // "HH:MM"
  minutes: number;   // for sorting
  status: 'upcoming' | 'past';
};

@Component({
  selector: 'app-today-timeline-component',
   standalone: true,
  imports: [CommonModule],
  templateUrl: './today-timeline-component.html',
  styleUrl: './today-timeline-component.css',
})
export class TodayTimelineComponent implements OnInit {
  events: DoseEvent[] = [];
  loading = false;
  error: string | null = null;

  nowMinutes = this.getNowMinutes();

  constructor(private medicationService: MedicationService) {}

  ngOnInit(): void {
    this.loadToday();
    // option: refresh every minute
    setInterval(() => (this.nowMinutes = this.getNowMinutes()), 60_000);
  }

  loadToday(): void {
    this.loading = true;
    this.error = null;

    this.medicationService.getMedications().subscribe({
      next: (meds) => {
        const active = meds.filter(m => this.isActiveToday(m));
        this.events = this.buildEvents(active).sort((a, b) => a.minutes - b.minutes);
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.error = 'Failed to load today timeline.';
        this.loading = false;
      },
    });
  }

  private buildEvents(meds: Medication[]): DoseEvent[] {
    const now = this.nowMinutes;
    const out: DoseEvent[] = [];

    for (const m of meds) {
      const times = (m.times && m.times.length)
        ? m.times
        : this.generateTimesFromFrequency(m.frequencyPerDay);

      for (const t of times) {
        const minutes = this.toMinutes(t);
        out.push({
          medicationId: m.id,
          name: m.name,
          dosageText: `${m.dosage} ${m.unit}`,
          time: t,
          minutes,
          status: minutes < now ? 'past' : 'upcoming',
        });
      }
    }

    return out;
  }

  private generateTimesFromFrequency(freq: number): string[] {
    const slots = Math.max(freq || 1, 1);
    const start = 8 * 60;
    const end = 20 * 60;
    const step = slots === 1 ? 0 : Math.floor((end - start) / (slots - 1));

    const times: string[] = [];
    for (let i = 0; i < slots; i++) {
      times.push(this.toHHMM(start + i * step));
    }
    return times;
  }

  private isActiveToday(m: Medication): boolean {
    // date format "YYYY-MM-DD"
    const today = new Date().toISOString().slice(0, 10);

    if (m.startDate && m.startDate > today) return false;
    if (m.endDate && m.endDate < today) return false;
    return true;
  }

  private getNowMinutes(): number {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
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


  refresh(): void {
    this.loadToday();
  }
}
