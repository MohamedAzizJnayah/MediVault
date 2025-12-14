import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MedicalRecordService } from '../../../services/medical-record.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-upload-card',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './upload-card.html',
  styleUrl: './upload-card.css',
})
export class UploadCard {

  selectedFile: File | null = null;

  uploadForm = new FormGroup({
    filename: new FormControl('', Validators.required),
    tags: new FormControl(''),
    file: new FormControl<File|null>(null, Validators.required),
  });

  constructor(private medicalService: MedicalRecordService) {}

  // 1️⃣ Quand l'utilisateur choisit un fichier
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadForm.patchValue({ file: this.selectedFile });
    }
  }

  // 2️⃣ Quand l'utilisateur clique sur Submit
  onSubmit() {
    if (this.uploadForm.invalid || !this.selectedFile) return;

    const formData = new FormData();
    formData.append('filename', this.uploadForm.value.filename!);
    formData.append('tags', this.uploadForm.value.tags || '');
    formData.append('date', new Date().toISOString().split('T')[0]);
    formData.append('file', this.selectedFile);

    this.medicalService.createMedicalRecord(formData).subscribe({
      next: () => console.log('Upload réussi'),
      error: err => console.error(err),
    });
  }
}
