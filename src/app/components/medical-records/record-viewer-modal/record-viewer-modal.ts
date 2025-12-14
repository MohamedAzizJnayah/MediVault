import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MedicalRecord } from '../../../models/medical-record.model';

@Component({
  selector: 'app-record-viewer-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './record-viewer-modal.html',
  styleUrl: './record-viewer-modal.css',
})
export class RecordViewerModal {

   
  @Input() record!: MedicalRecord;

  
  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }

}
