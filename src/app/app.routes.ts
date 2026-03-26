import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { PacienteListComponent } from './components/paciente-list/paciente-list';
import { PacienteFormComponent } from './components/paciente-form/paciente-form';
import { CitaListComponent } from './components/cita-list/cita-list';
import { CitaFormComponent } from './components/cita-form/cita-form';
import { HistoriaDetalleComponent } from './components/historia-detalle/historia-detalle';
import { ClinicaListComponent } from './components/clinica-list/clinica-list';
import { ClinicaFormComponent } from './components/clinica-form/clinica-form';
import { authGuard } from './guards/auth.guard'; 

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'clinicas', component: ClinicaListComponent, canActivate: [authGuard] },
  { path: 'clinicas/nueva', component: ClinicaFormComponent, canActivate: [authGuard] },
  { path: 'clinicas/editar/:id', component: ClinicaFormComponent, canActivate: [authGuard] },
  { path: 'pacientes', component: PacienteListComponent, canActivate: [authGuard] },
  { path: 'pacientes/nuevo', component: PacienteFormComponent, canActivate: [authGuard] },
  { path: 'pacientes/editar/:id', component: PacienteFormComponent, canActivate: [authGuard] },
  { path: 'citas', component: CitaListComponent, canActivate: [authGuard] },
  { path: 'citas/nuevo', component: CitaFormComponent, canActivate: [authGuard] },
  { path: 'historias/:pacienteId', component: HistoriaDetalleComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/pacientes', pathMatch: 'full' }
];
