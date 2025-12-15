import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Medication } from '../../../models/medication.model';
import { AutoFocusDirective } from '../../../directives/auto-focus-directive';

@Component({
  selector: 'app-edit-medication',
  imports: [CommonModule, ReactiveFormsModule,AutoFocusDirective],
  templateUrl: './edit-medication.html',
  styleUrl: './edit-medication.css',
})
export class EditMedication {

  @Input() medication!: Medication;

  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<{ id: string; payload: Partial<Medication> }>();

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    dosage: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    unit: new FormControl('mg', Validators.required),

    frequencyPerDay: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    timesText: new FormControl(''),

    stock: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    lowStockThreshold: new FormControl<number | null>(1, [Validators.required, Validators.min(0)]),

    startDate: new FormControl('', Validators.required),
    endDate: new FormControl(''),

    notes: new FormControl(''),
  });

  ngOnInit(): void {
    this.form.patchValue({
      name: this.medication.name,
      dosage: this.medication.dosage,
      unit: this.medication.unit,

      frequencyPerDay: this.medication.frequencyPerDay,
      timesText: (this.medication.times || []).join(', '),

      stock: this.medication.stock,
      lowStockThreshold: this.medication.lowStockThreshold,

      startDate: this.medication.startDate,
      endDate: this.medication.endDate || '',

      notes: this.medication.notes || '',
    });
  }

  onClose(): void {
    this.close.emit();
  }

  submit(): void {
    if (this.form.invalid) return;

    const times = (this.form.value.timesText || '')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    this.updated.emit({
      id: this.medication.id,
      payload: {
        name: this.form.value.name!,
        dosage: this.form.value.dosage!,
        unit: this.form.value.unit!,

        frequencyPerDay: this.form.value.frequencyPerDay!,
        times: times.length ? times : undefined,

        stock: this.form.value.stock!,
        lowStockThreshold: this.form.value.lowStockThreshold!,

        startDate: this.form.value.startDate!,
        endDate: this.form.value.endDate || undefined,

        notes: this.form.value.notes || undefined,
      }
    });
  }
}