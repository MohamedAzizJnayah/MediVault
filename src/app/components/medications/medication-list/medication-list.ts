import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicationService } from '../../../services/medication.service';
import { Medication } from '../../../models/medication.model';

import { EditMedication } from "../edit-medication/edit-medication";
import { AddMedication } from "../add-medication/add-medication";

@Component({
  selector: 'app-medication-list',
  standalone: true,
  imports: [CommonModule, EditMedication, AddMedication],
  templateUrl: './medication-list.html',
  styleUrl: './medication-list.css',
})
export class MedicationList implements OnInit {

  medications: Medication[] = [];

  loading = false;
  errorMessage: string | null = null;

  // Delete
  deleteModalOpen = false;
  selectedDeleteId: string | null = null;
  isDeleting = false;

  // Add/Edit modals
  addModalOpen = false;
  editModalOpen = false;
  selectedToEdit: Medication | null = null;

  constructor(private medicationService: MedicationService) {}

  ngOnInit(): void {
    this.loadMedications();
  }

  loadMedications(): void {
    this.loading = true;
    this.errorMessage = null;

    this.medicationService.getMedications().subscribe({
      next: (medications) => {
        this.medications = medications;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading medications:', error);
        this.errorMessage = 'Failed to load medications. Please try again.';
        this.loading = false;
      }
    });
  }

  // ===== Add modal =====
  openAdd(): void { this.addModalOpen = true; }
  closeAdd(): void { this.addModalOpen = false; }

  // reçoit payload depuis <app-add-medication>
  handleCreated(payload: Partial<Medication>): void {
    this.medicationService.addMedication(payload).subscribe({
      next: (created) => {
        this.medications = [created, ...this.medications];
        this.closeAdd();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to add medication.';
      }
    });
  }

  // ===== Edit modal =====
  openEdit(m: Medication): void {
    this.selectedToEdit = m;
    this.editModalOpen = true;
  }

  closeEdit(): void {
    this.editModalOpen = false;
    this.selectedToEdit = null;
  }

  // reçoit event depuis <app-edit-medication>
  handleUpdated(event: { id: string; payload: Partial<Medication> }): void {
    this.medicationService.updateMedication(event.id, event.payload).subscribe({
      next: (updated) => {
        this.medications = this.medications.map(m => m.id === updated.id ? updated : m);
        this.closeEdit();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to update medication.';
      }
    });
  }

  // ===== Delete modal =====
  openDeleteModal(id: string): void {
    this.selectedDeleteId = id;
    this.deleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.deleteModalOpen = false;
    this.selectedDeleteId = null;
  }

  confirmDelete(): void {
    if (!this.selectedDeleteId || this.isDeleting) return;

    this.isDeleting = true;
    this.medicationService.deleteMedication(this.selectedDeleteId).subscribe({
      next: () => {
        this.medications = this.medications.filter(m => m.id !== this.selectedDeleteId);
        this.isDeleting = false;
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('Error deleting medication:', error);
        this.errorMessage = 'Delete failed. Please try again.';
        this.isDeleting = false;
      }
    });
  }

  // Helpers UI
  isLowStock(m: Medication): boolean {
    return m.stock <= m.lowStockThreshold;
  }

  stockLabel(m: Medication): string {
    if (m.stock <= 0) return 'Out of stock';
    if (this.isLowStock(m)) return 'Low stock';
    return 'In stock';
  }
}
