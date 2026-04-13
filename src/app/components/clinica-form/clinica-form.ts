import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicaService } from '../../services/clinica.service';
import { Clinica } from '../../models/clinica.model';

@Component({
  selector: 'app-clinica-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <a (click)="goBack()" class="btn-back">← Volver</a>
        <h1>{{ isEdit ? 'Editar' : 'Nueva' }} Clínica</h1>
      </div>

      <div class="card">
        <form (ngSubmit)="onSubmit()" #cForm="ngForm">
          <div class="section-title">Información Principal</div>
          
          <div class="row">
            <div class="form-group col">
              <label>RUC (13 dígitos) *</label>
              <input type="text" name="ruc" [(ngModel)]="clinica.ruc" required maxlength="13" pattern="^[0-9]{13}$" #ruc="ngModel">
              <div class="error-msg" *ngIf="ruc.invalid && (ruc.dirty || cForm.submitted)">RUC debe tener 13 dígitos numéricos</div>
            </div>
            
            <div class="form-group col">
              <label>Tipo de Registro *</label>
              <select name="esEmpresa" [(ngModel)]="clinica.esEmpresa" required #esEmp="ngModel">
                <option [ngValue]="true">Persona Jurídica (Empresa)</option>
                <option [ngValue]="false">Persona Natural</option>
              </select>
            </div>
          </div>

          <!-- Campos para Empresa -->
          <div *ngIf="clinica.esEmpresa">
            <div class="form-group">
              <label>Razón Social *</label>
              <input type="text" name="razonSocial" [(ngModel)]="clinica.razonSocial" [required]="clinica.esEmpresa" #razon="ngModel">
              <div class="error-msg" *ngIf="razon.invalid && (razon.dirty || cForm.submitted)">Requerido para empresas</div>
            </div>
          </div>

          <!-- Campos para Persona Natural -->
          <div *ngIf="!clinica.esEmpresa">
            <div class="row">
              <div class="form-group col">
                <label>Primer Nombre *</label>
                <input type="text" name="primerNombre" [(ngModel)]="clinica.primerNombre" [required]="!clinica.esEmpresa" #pNom="ngModel">
              </div>
              <div class="form-group col">
                <label>Segundo Nombre</label>
                <input type="text" name="segundoNombre" [(ngModel)]="clinica.segundoNombre">
              </div>
            </div>
            <div class="row">
              <div class="form-group col">
                <label>Primer Apellido *</label>
                <input type="text" name="primerApellido" [(ngModel)]="clinica.primerApellido" [required]="!clinica.esEmpresa" #pApe="ngModel">
              </div>
              <div class="form-group col">
                <label>Segundo Apellido</label>
                <input type="text" name="segundoApellido" [(ngModel)]="clinica.segundoApellido">
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Nombre Comercial</label>
            <input type="text" name="nombreComercial" [(ngModel)]="clinica.nombreComercial">
          </div>

          <div class="section-title">Contacto y Representante</div>
          <div class="row">
            <div class="form-group col">
              <label>Email Contacto *</label>
              <input type="email" name="email" [(ngModel)]="clinica.email" required email #emailCtrl="ngModel" style="text-transform: none;">
              <div class="error-msg" *ngIf="emailCtrl.invalid && (emailCtrl.dirty || cForm.submitted)">Email inválido</div>
            </div>
            <div class="form-group col">
              <label>Cédula Representante Legal *</label>
              <input type="text" name="cedulaRepresentante" [(ngModel)]="clinica.cedulaRepresentante" required maxlength="10" pattern="^[0-9]{10}$" #cedRep="ngModel">
              <div class="error-msg" *ngIf="cedRep.invalid && (cedRep.dirty || cForm.submitted)">Debe ser 10 dígitos</div>
            </div>
          </div>

          <div class="row">
            <div class="form-group col">
              <label>Primer Nombre *</label>
              <input type="text" name="rep_primerNombre" [(ngModel)]="clinica.repPrimerNombre" required minlength="5" maxlength="50" pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$" #repPNom="ngModel">
              <div class="error-msg" *ngIf="repPNom.invalid && (repPNom.dirty || cForm.submitted)">Mínimo 5 caracteres alpabéticos</div>
            </div>
            <div class="form-group col">
              <label>Segundo Nombre</label>
              <input type="text" name="rep_segundoNombre" [(ngModel)]="clinica.repSegundoNombre" minlength="5" maxlength="50" pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$" #repSNom="ngModel">
            </div>
          </div>

          <div class="row">
            <div class="form-group col">
              <label>Primer Apellido *</label>
              <input type="text" name="rep_primerApellido" [(ngModel)]="clinica.repPrimerApellido" required minlength="5" maxlength="50" pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$" #repPApe="ngModel">
              <div class="error-msg" *ngIf="repPApe.invalid && (repPApe.dirty || cForm.submitted)">Mínimo 5 caracteres alpabéticos</div>
            </div>
            <div class="form-group col">
              <label>Segundo Apellido</label>
              <input type="text" name="rep_segundoApellido" [(ngModel)]="clinica.repSegundoApellido" minlength="5" maxlength="50" pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$" #repSApe="ngModel">
            </div>
          </div>

          <div class="row">
            <div class="form-group col">
              <label>Fecha Nacimiento *</label>
              <input type="date" name="rep_fechaNacimiento" [(ngModel)]="clinica.repFechaNacimiento" required [max]="today" #fNac="ngModel">
              <div class="error-msg" *ngIf="fNac.invalid && (fNac.dirty || cForm.submitted)">Requerido y no puede ser futura</div>
            </div>
            <div class="form-group col">
              <label>Email Representante</label>
              <input type="email" name="rep_email" [(ngModel)]="clinica.repEmail" email #repEmailCtrl="ngModel" style="text-transform: none;">
            </div>
          </div>

          <div class="row">
            <div class="form-group col">
              <label>Teléfono Representante</label>
              <input type="text" name="rep_telefono" [(ngModel)]="clinica.repTelefono" maxlength="10">
            </div>
            <div class="form-group col">
            </div>
          </div>

          <div class="row">
            <div class="form-group col">
              <label>Teléfono Celular *</label>
              <input type="text" name="telefonoCelular" [(ngModel)]="clinica.telefonoCelular" required maxlength="10" pattern="^[0-9]{10}$" #telCel="ngModel">
            </div>
            <div class="form-group col">
              <label>Teléfono Convencional</label>
              <input type="text" name="telefonoConvencional" [(ngModel)]="clinica.telefonoConvencional" maxlength="9">
            </div>
          </div>

          <div class="error-msg api-error" *ngIf="apiError">{{ apiError }}</div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              {{ isEdit ? 'Actualizar' : 'Registrar' }} Clínica
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
    .form-actions { margin-top: 2rem; display: flex; justify-content: flex-end; }
    input[type="text"], input[type="email"], select { width: 100%; }
    input:not([type="email"]) { text-transform: uppercase; }
    .api-error { text-align: center; margin-top: 1rem; font-size: 1rem; }
  `]
})
export class ClinicaFormComponent implements OnInit {
  clinica: Clinica = {
    ruc: '',
    esEmpresa: true,
    email: '',
    telefonoCelular: '',
    cedulaRepresentante: '',
    repPrimerNombre: '',
    repSegundoNombre: '',
    repPrimerApellido: '',
    repSegundoApellido: '',
    repFechaNacimiento: '',
    repEmail: '',
    repTelefono: ''
  };
  isEdit = false;
  apiError = '';
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private clinicaService: ClinicaService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.clinicaService.getById(id).subscribe({
        next: (data) => this.clinica = data,
        error: () => this.apiError = 'Error al cargar los datos de la clínica'
      });
    }
  }

  goBack() {
    this.router.navigate(['/clinicas']);
  }

  onSubmit() {
    this.apiError = '';
    this.enforceUppercase();

    const obs = this.isEdit
      ? this.clinicaService.update(this.clinica.id!, this.clinica)
      : this.clinicaService.create(this.clinica);

    obs.subscribe({
      next: () => this.router.navigate(['/clinicas']),
      error: (err) => {
        this.apiError = err.error?.message || err.error || 'Error al procesar la solicitud';
        alert(this.apiError);
      }
    });
  }

  enforceUppercase() {
    if (this.clinica.ruc) this.clinica.ruc = this.clinica.ruc.toUpperCase();
    // Clinic Names
    if (this.clinica.esEmpresa) {
      if (this.clinica.razonSocial) this.clinica.razonSocial = this.clinica.razonSocial.toUpperCase();
      if (this.clinica.nombreComercial) this.clinica.nombreComercial = this.clinica.nombreComercial.toUpperCase();

    } else {
      if (this.clinica.primerNombre) this.clinica.primerNombre = this.clinica.primerNombre.toUpperCase();
      if (this.clinica.segundoNombre) this.clinica.segundoNombre = this.clinica.segundoNombre.toUpperCase();
      if (this.clinica.primerApellido) this.clinica.primerApellido = this.clinica.primerApellido.toUpperCase();
      if (this.clinica.segundoApellido) this.clinica.segundoApellido = this.clinica.segundoApellido.toUpperCase();

      if (this.clinica.primerNombre
        || this.clinica.segundoNombre
        || this.clinica.primerApellido
        || this.clinica.segundoApellido) {
        var comercialName = `${this.clinica.primerNombre} ${this.clinica.segundoNombre} ${this.clinica.primerApellido} ${this.clinica.segundoApellido}`
        this.clinica.nombreComercial = comercialName.toUpperCase();
      }
    }

    // Representative Names
    if (this.clinica.repPrimerNombre) this.clinica.repPrimerNombre = this.clinica.repPrimerNombre.toUpperCase();
    if (this.clinica.repSegundoNombre) this.clinica.repSegundoNombre = this.clinica.repSegundoNombre.toUpperCase();
    if (this.clinica.repPrimerApellido) this.clinica.repPrimerApellido = this.clinica.repPrimerApellido.toUpperCase();
    if (this.clinica.repSegundoApellido) this.clinica.repSegundoApellido = this.clinica.repSegundoApellido.toUpperCase();
    if (this.clinica.cedulaRepresentante) this.clinica.cedulaRepresentante = this.clinica.cedulaRepresentante.toUpperCase();
  }
}
