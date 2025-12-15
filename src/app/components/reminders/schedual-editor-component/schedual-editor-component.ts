import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Medication } from '../../../models/medication.model';
import { MedicationService } from '../../../services/medication.service';


const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

@Component({
  selector: 'app-schedual-editor-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedual-editor-component.html',
  styleUrl: './schedual-editor-component.css',
})
export class ScheduleEditorComponent implements OnInit {
  medications: Medication[] = [];
  selectedMedication: Medication | null = null;

  loading = false;
  saving = false;
  message: string | null = null;
  error: string | null = null;

  form = new FormGroup({
    medicationId: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    frequencyPerDay: new FormControl<number>(1, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    startDate: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    endDate: new FormControl<string>(''),
    times: new FormArray<FormControl<string>>([]),
  });

  ngOnInit(): void {
    this.loadMedications();
  }

  get timesArray(): FormArray<FormControl<string>> {
    return this.form.controls.times;
  }

  loadMedications(): void {
    this.loading = true;
    this.error = null;

    this.medicationService.getMedications().subscribe({
      next: (meds) => {
        this.medications = meds;
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.error = 'Failed to load medications.';
        this.loading = false;
      },
    });
  }

  constructor(private medicationService: MedicationService) {}

  onSelectMedication(id: string): void {
    const med = this.medications.find(m => m.id === id) || null;
    this.selectedMedication = med;
    this.message = null;
    this.error = null;

    this.timesArray.clear();

    if (!med) return;

    this.form.patchValue({
      medicationId: med.id,
      frequencyPerDay: med.frequencyPerDay ?? 1,
      startDate: med.startDate ?? '',
      endDate: med.endDate ?? '',
    });

    const times = (med.times ?? []).slice().sort();
    if (times.length > 0) {
      times.forEach(t => this.timesArray.push(this.createTimeControl(t)));
    } else {
      // si pas d'horaires définis, on génère une base à partir de frequency
      this.generateTimesFromFrequency();
    }
  }

  createTimeControl(value: string = ''): FormControl<string> {
    return new FormControl<string>(value, {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(TIME_REGEX)],
    });
  }

  addTime(): void {
    this.timesArray.push(this.createTimeControl('08:00'));
  }

  removeTime(index: number): void {
    this.timesArray.removeAt(index);
  }

  generateTimesFromFrequency(): void {
    const freq = this.form.controls.frequencyPerDay.value ?? 1;

    // règle simple: répartir entre 08:00 et 20:00
    const start = 8 * 60;
    const end = 20 * 60;
    const slots = Math.max(freq, 1);

    const step = slots === 1 ? 0 : Math.floor((end - start) / (slots - 1));
    const times: string[] = [];

    for (let i = 0; i < slots; i++) {
      const minutes = start + i * step;
      times.push(this.toHHMM(minutes));
    }

    this.timesArray.clear();
    times.forEach(t => this.timesArray.push(this.createTimeControl(t)));
  }

  private toHHMM(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  save(): void {
    if (!this.selectedMedication) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.saving) return;

    this.saving = true;
    this.message = null;
    this.error = null;

    const times = this.timesArray.controls
      .map(c => c.value.trim())
      .filter(Boolean)
      .sort();

    // On construit un objet COMPLET pour ton service (qui prend Medication)
    const updated: Medication = {
      ...this.selectedMedication,
      frequencyPerDay: this.form.controls.frequencyPerDay.value,
      times: times.length ? times : undefined,
      startDate: this.form.controls.startDate.value,
      endDate: this.form.controls.endDate.value || undefined,
    };

    this.medicationService.updateMedication(updated.id, updated).subscribe({
      next: (saved) => {
        // update local list
        this.medications = this.medications.map(m => (m.id === saved.id ? saved : m));
        this.selectedMedication = saved;
        this.message = 'Schedule updated successfully ✅';
        this.saving = false;
      },
      error: (e) => {
        console.error(e);
        this.error = 'Failed to save schedule.';
        this.saving = false;
      },
    });
  }
}
