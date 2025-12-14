import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { MedicalRecordPage } from './pages/medical-record.page/medical-record.page';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'medical', component: MedicalRecordPage },
  {path: '**', redirectTo: '' }


];


