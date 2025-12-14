import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MedicalRecord } from '../models/medical-record.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MedicalRecordService {

  private readonly baseUrl =`${environment.apiUrl}${environment.endpoints.medicalRecords}`;

  constructor(private http: HttpClient) {}

  uploadMedicalRecord(formData: FormData): Observable<MedicalRecord> {
    return this.http.post<MedicalRecord>(
      `${this.baseUrl}/upload`,
      formData
    );
  }

  getMedicalRecords(): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(this.baseUrl);
  }

  deleteMedicalRecord(recordId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${recordId}`);
  }
}
