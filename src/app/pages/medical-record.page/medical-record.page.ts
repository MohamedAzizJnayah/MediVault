import { Component } from '@angular/core';
import { UploadCard } from "../../components/medical-records/upload-card/upload-card";
import { RecordListComponent } from "../../components/medical-records/record-list/record-list";


@Component({
  selector: 'app-medical-record-page',
  standalone: true,
  imports: [UploadCard, RecordListComponent],
  templateUrl: './medical-record.page.html',
  styleUrl: './medical-record.page.css',
})
export class MedicalRecordPage {

}
