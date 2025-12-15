import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Medication } from '../../../models/medication.model';
import { AutoFocusDirective } from '../../../directives/auto-focus-directive';

@Component({
  selector: 'app-add-medication',
   imports: [CommonModule, ReactiveFormsModule,AutoFocusDirective],
  templateUrl: './add-medication.html',
  styleUrl: './add-medication.css',
})
export class AddMedication {

@Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<Partial<Medication>>();

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    dosage: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    unit: new FormControl('mg', Validators.required),

    frequencyPerDay: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    timesText: new FormControl(''), // "08:00, 20:00"

    stock: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    lowStockThreshold: new FormControl<number | null>(1, [Validators.required, Validators.min(0)]),

    startDate: new FormControl('', Validators.required),
    endDate: new FormControl(''),

    notes: new FormControl(''),
  });

  onClose(): void {
    this.close.emit();
  }

  submit(): void {
    if (this.form.invalid) return;

    const times = (this.form.value.timesText || '')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    this.created.emit({
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
    });
  }
}