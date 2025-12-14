import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MedicationList } from '../../components/medications/medication-list/medication-list';

@Component({
  selector: 'app-medication-page',
  imports: [CommonModule, MedicationList],
  templateUrl: './medication-page.html',
  styleUrl: './medication-page.css',
})
export class MedicationPage {

}
