import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CitaService } from '../../services/cita.service';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../models/paciente.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cita-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="header">
        <a routerLink="/citas" class="btn-back">← Volver</a>
        <h1>Agendar Nueva Cita</h1>
      </div>

      <div class="card">
        <form (ngSubmit)="onSubmit()" #cForm="ngForm">
          <div class="form-group">
            <label>Paciente</label>
            <div class="patient-selector">
              <select name="pacienteId" [(ngModel)]="selectedPacienteId" (change)="onPacienteSelect()" required>
                <option [ngValue]="null">-- Seleccione un paciente existente --</option>
                <option *ngFor="let p of pacientes" [ngValue]="p.id">
                  {{ p.persona.primerNombre }} {{ p.persona.primerApellido }} ({{ p.persona.documento }})
                </option>
                <option value="new">+ Crear nuevo paciente durante el agendamiento</option>
              </select>
            </div>
          </div>

          <!-- Campos para nuevo paciente si se selecciona '+ Nuevo' -->
          <div *ngIf="selectedPacienteId === 'new'" class="new-patient-fields card">
             <div class="section-title">Datos del Nuevo Paciente</div>
             <div class="row">
                <div class="form-group col">
                  <label>Tipo Documento *</label>
                  <select name="td" [(ngModel)]="newPaciente.persona.tipoDocumento" required>
                    <option value="CEDULA">Cédula</option>
                    <option value="PASAPORTE">Pasaporte</option>
                  </select>
                </div>
                <div class="form-group col">
                  <label>No. Documento *</label>
                  <input type="text" name="doc" [(ngModel)]="newPaciente.persona.documento" required>
                </div>
             </div>
             <div class="row">
                <div class="form-group col">
                  <label>Primer Nombre *</label>
                  <input type="text" name="pnom" [(ngModel)]="newPaciente.persona.primerNombre" required>
                </div>
                <div class="form-group col">
                  <label>Primer Apellido *</label>
                  <input type="text" name="pape" [(ngModel)]="newPaciente.persona.primerApellido" required>
                </div>
             </div>
             <div class="grid">
                <div class="form-group">
                  <label>Fecha de Nacimiento *</label>
                  <input type="date" name="fn" [(ngModel)]="newPaciente.persona.fechaNacimiento" required>
                </div>
             </div>
          </div>

          <div class="grid">
            <div class="form-group">
              <label>Fecha y Hora *</label>
              <input type="datetime-local" name="fechaHora" [(ngModel)]="cita.fechaHora" required>
            </div>
            <div class="form-group">
              <label>Motivo *</label>
              <input type="text" name="motivo" [(ngModel)]="cita.motivo" required placeholder="Ej: Consulta general">
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="cForm.invalid">
              Agendar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .header { margin-bottom: 2rem; }
    .btn-back { display: block; margin-bottom: 0.5rem; text-decoration: none; color: #64748b; font-size: 0.875rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
    .form-actions { margin-top: 2rem; display: flex; justify-content: flex-end; }
    .new-patient-fields { border-color: #2563eb; background: #f0f9ff; margin-bottom: 1.5rem; }
    .section-title { font-weight: 700; margin-bottom: 1rem; }
  `]
})
export class CitaFormComponent implements OnInit {
  pacientes: Paciente[] = [];
  selectedPacienteId: any = null;
  newPaciente: any = { persona: {} };
  cita: any = { fechaHora: '', motivo: '' };
  currentUserId: string = '';

  constructor(
    private citaService: CitaService,
    private pacienteService: PacienteService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.pacienteService.getAll().subscribe(res => this.pacientes = res);
    this.authService.user$.subscribe(user => this.currentUserId = user?.id);
  }

  onPacienteSelect() {
    if (this.selectedPacienteId !== 'new' && this.selectedPacienteId !== null) {
      this.newPaciente = { id: this.selectedPacienteId };
    } else {
      this.newPaciente = { persona: { tipoDocumento: 'CEDULA', primerNombre: '', primerApellido: '', documento: '', fechaNacimiento: '' } };
    }
  }

  onSubmit() {
    const payload = {
      paciente: this.selectedPacienteId === 'new' ? this.newPaciente : { id: this.selectedPacienteId },
      profesionalId: this.currentUserId,
      fechaHora: this.cita.fechaHora,
      motivo: this.cita.motivo
    };

    this.citaService.create(payload).subscribe(() => this.router.navigate(['/citas']));
  }
}
