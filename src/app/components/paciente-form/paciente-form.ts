import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../models/paciente.model';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <a (click)="goBack()" class="btn-back">← Volver</a>
        <h1>{{ isEdit ? 'Editar' : 'Nuevo' }} Paciente</h1>
      </div>

      <div class="card">
        <form (ngSubmit)="onSubmit()" #pForm="ngForm">
          <div class="section-title">Datos Personales</div>
          <div class="row">
            <div class="form-group col" [class.has-error]="tipoDocumento.invalid && (tipoDocumento.dirty || pForm.submitted)">
              <label>Tipo Documento *</label>
              <select name="tipoDocumento" [(ngModel)]="paciente.persona.tipoDocumento" required #tipoDocumento="ngModel" (change)="onTipoDocumentoChange()">
                <option value="CEDULA">Cédula</option>
                <option value="PASAPORTE">Pasaporte</option>
              </select>
              <div class="error-msg" *ngIf="tipoDocumento.invalid && (tipoDocumento.dirty || pForm.submitted)">Campo requerido</div>
            </div>
            <div class="form-group col" [class.has-error]="documento.invalid && (documento.dirty || pForm.submitted)">
              <label>No. Documento *</label>
              <input type="text" name="documento" [(ngModel)]="paciente.persona.documento" required #documento="ngModel"
                     [maxlength]="maxLongitudDoc"
                     (input)="onDocumentoInput($event)"
                     [pattern]="paciente.persona.tipoDocumento === 'CEDULA' ? '^[0-9]+$' : '^[a-zA-Z0-9]+$'">
              <div class="error-msg" *ngIf="documento.invalid && (documento.dirty || pForm.submitted)">
                <span *ngIf="documento.errors?.['required']">Campo requerido</span>
                <span *ngIf="documento.errors?.['pattern']">Formato inválido</span>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="form-group col" [class.has-error]="primerNombre.invalid && (primerNombre.dirty || pForm.submitted)">
              <label>Primer Nombre *</label>
              <input type="text" name="primerNombre" [(ngModel)]="paciente.persona.primerNombre" required #primerNombre="ngModel">
              <div class="error-msg" *ngIf="primerNombre.invalid && (primerNombre.dirty || pForm.submitted)">Campo requerido</div>
            </div>
            <div class="form-group col">
              <label>Segundo Nombre</label>
              <input type="text" name="segundoNombre" [(ngModel)]="paciente.persona.segundoNombre">
            </div>
          </div>

          <div class="row">
            <div class="form-group col" [class.has-error]="primerApellido.invalid && (primerApellido.dirty || pForm.submitted)">
              <label>Primer Apellido *</label>
              <input type="text" name="primerApellido" [(ngModel)]="paciente.persona.primerApellido" required #primerApellido="ngModel">
              <div class="error-msg" *ngIf="primerApellido.invalid && (primerApellido.dirty || pForm.submitted)">Campo requerido</div>
            </div>
            <div class="form-group col">
              <label>Segundo Apellido</label>
              <input type="text" name="segundoApellido" [(ngModel)]="paciente.persona.segundoApellido">
            </div>
          </div>

          <div class="grid">
            <div class="form-group" [class.has-error]="fechaNacimiento.invalid && (fechaNacimiento.dirty || pForm.submitted)">
              <label>Fecha de Nacimiento *</label>
              <input type="date" name="fechaNacimiento" [(ngModel)]="paciente.persona.fechaNacimiento" required #fechaNacimiento="ngModel" [max]="todayStr">
              <div class="error-msg" *ngIf="fechaNacimiento.invalid && (fechaNacimiento.dirty || pForm.submitted)">Campo requerido</div>
            </div>
            <div class="form-group">
              <label>Sexo</label>
              <select name="sexo" [(ngModel)]="paciente.persona.sexo">
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label>Email</label>
              <input type="email" name="email" [(ngModel)]="paciente.persona.email" style="text-transform: none;">
            </div>
            <div class="form-group col" [class.has-error]="telefono.invalid && (telefono.dirty || pForm.submitted)">
              <label>Teléfono</label>
              <input type="text" name="telefono" [(ngModel)]="paciente.persona.telefono" maxlength="10" pattern="^[0-9]{1,10}$" (input)="onTelefonoInput($event)" #telefono="ngModel">
              <div class="error-msg" *ngIf="telefono.invalid && (telefono.dirty || pForm.submitted)">
                 <span *ngIf="telefono.errors?.['pattern']">Máximo 10 dígitos numéricos</span>
              </div>
            </div>
          </div>

          <div class="section-title">Información Médica</div>
          <div class="grid">
            <div class="form-group">
              <label>Tipo de Sangre</label>
              <input type="text" name="tipoSangre" [(ngModel)]="paciente.tipoSangre" placeholder="A+, O-, etc">
            </div>
            <div class="form-group">
              <label>Seguro Médico</label>
              <input type="text" name="seguroMedico" [(ngModel)]="paciente.seguroMedico">
            </div>
          </div>

          <div class="form-group">
            <label>Contacto de Emergencia</label>
            <input type="text" name="contactoEmergencia" [(ngModel)]="paciente.contactoEmergencia" maxlength="100">
          </div>

          <div class="form-group">
            <label>Observaciones</label>
            <textarea name="observaciones" [(ngModel)]="paciente.observaciones" rows="3"></textarea>
          </div>

          <div class="error-msg" style="text-align: center; font-size: 1rem; margin-top: 1rem;" *ngIf="apiError">{{ apiError }}</div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="pForm.invalid">
              {{ isEdit ? 'Actualizar' : 'Guardar' }} Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .header { margin-bottom: 2rem; }
    .btn-back { display: block; margin-bottom: 0.5rem; text-decoration: none; color: #64748b; font-size: 0.875rem; cursor: pointer; }
    .section-title { font-weight: 700; color: #1e293b; margin: 1.5rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #f1f5f9; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
    .form-actions { margin-top: 2rem; display: flex; justify-content: flex-end; }
    
    input[type="text"], textarea { text-transform: uppercase; }

    .has-error input, .has-error select {
      border: 1px solid red;
    }
    .error-msg {
      color: red;
      font-size: 0.8rem;
      margin-top: 0.2rem;
    }
  `]
})
export class PacienteFormComponent implements OnInit {
  paciente: Paciente = {
    persona: { primerNombre: '', primerApellido: '', documento: '', tipoDocumento: 'CEDULA', fechaNacimiento: '' }
  };
  isEdit = false;
  todayStr: string = '';
  maxLongitudDoc: number = 10;
  apiError: string = '';

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.todayStr = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.pacienteService.getById(id).subscribe(res => {
        this.paciente = res;
        this.onTipoDocumentoChange();
      });
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  onTipoDocumentoChange() {
    if (this.paciente.persona.tipoDocumento === 'CEDULA') {
      this.maxLongitudDoc = 10;
      this.paciente.persona.documento = this.paciente.persona.documento.replace(/[^0-9]/g, '').substring(0, 10);
    } else {
      this.maxLongitudDoc = 20;
      this.paciente.persona.documento = this.paciente.persona.documento.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
    }
  }

  onDocumentoInput(event: any) {
    let val = event.target.value;
    if (this.paciente.persona.tipoDocumento === 'CEDULA') {
      val = val.replace(/[^0-9]/g, '');
    } else {
      val = val.replace(/[^a-zA-Z0-9]/g, '');
    }
    this.paciente.persona.documento = val;
    event.target.value = val;
  }

  onTelefonoInput(event: any) {
    let val = event.target.value;
    val = val.replace(/[^0-9]/g, '').substring(0, 10);
    if (!this.paciente.persona) this.paciente.persona = {} as any;
    this.paciente.persona.telefono = val;
    event.target.value = val;
  }

  enforceUppercase() {
    const p = this.paciente.persona;
    if (p.primerNombre) p.primerNombre = p.primerNombre.toUpperCase();
    if (p.segundoNombre) p.segundoNombre = p.segundoNombre.toUpperCase();
    if (p.primerApellido) p.primerApellido = p.primerApellido.toUpperCase();
    if (p.segundoApellido) p.segundoApellido = p.segundoApellido.toUpperCase();
    if (p.documento && this.paciente.persona.tipoDocumento === 'PASAPORTE') p.documento = p.documento.toUpperCase();
    if (p.direccion) p.direccion = p.direccion.toUpperCase();
    
    if (this.paciente.tipoSangre) this.paciente.tipoSangre = this.paciente.tipoSangre.toUpperCase();
    if (this.paciente.seguroMedico) this.paciente.seguroMedico = this.paciente.seguroMedico.toUpperCase();
    if (this.paciente.contactoEmergencia) this.paciente.contactoEmergencia = this.paciente.contactoEmergencia.toUpperCase();
    if (this.paciente.observaciones) this.paciente.observaciones = this.paciente.observaciones.toUpperCase();
  }

  onSubmit() {
    this.apiError = '';

    // Validacion manual de fecha en caso de bypass HTML
    if (this.paciente.persona.fechaNacimiento) {
      if (new Date(this.paciente.persona.fechaNacimiento) > new Date()) {
        this.apiError = 'La fecha de nacimiento no puede ser mayor a la fecha actual.';
        return;
      }
    } else {
      this.apiError = 'La fecha de nacimiento es obligatoria.';
      return;
    }

    this.enforceUppercase();

    const obs = this.isEdit
      ? this.pacienteService.update(this.paciente.id!, this.paciente)
      : this.pacienteService.create(this.paciente);

    obs.subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        if (err.error && typeof err.error === 'string') {
          this.apiError = err.error;
        } else if (err.error && err.error.message) {
          this.apiError = err.error.message;
        } else {
          this.apiError = 'Ocurrió un error al guardar el paciente.';
        }
      }
    });
  }
}
