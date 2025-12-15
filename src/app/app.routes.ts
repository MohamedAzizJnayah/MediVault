import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { MedicalRecordPage } from './pages/medical-record.page/medical-record.page';
import { MedicationPage } from './pages/medication-page/medication-page';
import { RemindersPage } from './pages/reminders.page/reminders.page';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'medical', component: MedicalRecordPage },
  {path:"medications", component: MedicationPage},
  {path: 'reminders', component: RemindersPage},
  {path: '**', redirectTo: '' }


];


