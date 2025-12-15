import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MedicalRecordService } from '../../../services/medical-record.service';
import { CommonModule } from '@angular/common';
import { MedicalRecord } from '../../../models/medical-record.model';

@Component({
  selector: 'app-upload-card',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './upload-card.html',
  styleUrl: './upload-card.css',
})
export class UploadCard {
  @Output() uploaded = new EventEmitter<MedicalRecord>(); // ✅ notify parent

  selectedFile: File | null = null;

  uploadForm = new FormGroup({
    filename: new FormControl('', Validators.required),
    tags: new FormControl(''),
    file: new FormControl<File | null>(null, Validators.required),
  });

  constructor(private medicalService: MedicalRecordService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadForm.patchValue({ file: this.selectedFile });
    }
  }

  onSubmit() {
    if (this.uploadForm.invalid || !this.selectedFile) return;

    const formData = new FormData();
    formData.append('filename', this.uploadForm.value.filename!);
    formData.append('tags', this.uploadForm.value.tags || '');
    formData.append('date', new Date().toISOString().split('T')[0]);
    formData.append('file', this.selectedFile);

    this.medicalService.createMedicalRecord(formData).subscribe({
      next: (createdRecord) => {
        console.log('Upload réussi');
        this.uploaded.emit(createdRecord); // ✅ send to parent

        // optional reset
        this.uploadForm.reset();
        this.selectedFile = null;
      },
      error: err => console.error(err),
    });
  }
}
