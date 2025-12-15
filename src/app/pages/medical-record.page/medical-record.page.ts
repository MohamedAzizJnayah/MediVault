import { Component, ViewChild } from '@angular/core';
import { UploadCard } from "../../components/medical-records/upload-card/upload-card";
import { RecordListComponent } from "../../components/medical-records/record-list/record-list";
import { MedicalRecord } from '../../models/medical-record.model';


@Component({
  selector: 'app-medical-record-page',
  standalone: true,
  imports: [UploadCard, RecordListComponent],
  templateUrl: './medical-record.page.html',
  styleUrl: './medical-record.page.css',
})
export class MedicalRecordPage {
 @ViewChild(RecordListComponent) recordList!: RecordListComponent;

  onUploaded(record: MedicalRecord) {
    this.recordList.addRecord(record); // ✅ update list instantly
  }

}
