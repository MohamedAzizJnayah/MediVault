import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Medication } from '../models/medication.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MedicationService {
  private readonly baseUrl = `${environment.apiUrl}/medications`;

  constructor(private http: HttpClient) {}

  getMedications(): Observable<Medication[]> {
    return this.http.get<Medication[]>(this.baseUrl);
  }

  addMedication(payload: Partial<Medication>): Observable<Medication> {
    return this.http.post<Medication>(this.baseUrl, payload);
  }

  updateMedication(id: string, payload: Partial<Medication>): Observable<Medication> {
    return this.http.put<Medication>(`${this.baseUrl}/${id}`, payload);
  }

  deleteMedication(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
