import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalRecordService } from '../../../services/medical-record.service';
import { MedicalRecord } from '../../../models/medical-record.model';


@Component({
  selector: 'app-record-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './record-list.html',
  styleUrl: './record-list.css',
})
export class RecordListComponent implements OnInit {

  medicalRecords: MedicalRecord[] = [];
  selectedRecord: MedicalRecord | null = null;
  confirmationPending = false;
  recordToDeleteId: string | null = null;

  constructor(
    private medicalRecordService: MedicalRecordService,

  ) {}

  // ======================
  // Lifecycle
  // ======================
  ngOnInit(): void {
    this.loadRecords();
  }

  // ======================
  // Data loading
  // ======================
  loadRecords(): void {
    this.medicalRecordService.getMedicalRecords().subscribe({
      next: (records) => {
        this.medicalRecords = records;
      },
      error: (error) => {
        console.error('Error fetching records', error);
      }
    });
  }

  // ======================
  // Delete logic
  // ======================
  initiateDelete(recordId: string): void {
    this.recordToDeleteId = recordId;
    this.confirmationPending = true;
  }

  closeDelete(): void {
    this.confirmationPending = false;
    this.recordToDeleteId = null;
  }

  confirmeDelete(): void {
    
    
    if( this.confirmationPending && this.recordToDeleteId) {
      this.deleteRecord(this.recordToDeleteId!);
    }
  }

  deleteRecord(recordId: string): void {
    this.medicalRecordService.deleteMedicalRecord(recordId).subscribe({
      next: () => {
        this.medicalRecords = this.medicalRecords.filter(
          record => record.id !== recordId
        );
        this.closeDelete();
      },
      error: (error) => {
        console.error('Error deleting record', error);
      }
    });
  }


  openViewer(record: MedicalRecord): void {
  this.selectedRecord = record;
}

closeViewer(): void {
  this.selectedRecord = null;
}


}
