import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ClinicaService } from '../../services/clinica.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card card">
        <!-- LOGIN MODE -->
        <div *ngIf="mode === 'login'">
          <h1>Iniciar Sesión</h1>
          <p class="subtitle">Bienvenido al sistema de gestión clínica</p>
          
          <form (ngSubmit)="onLogin()">
            <div class="form-group">
              <label>Usuario</label>
              <input type="text" [(ngModel)]="loginData.username" name="username" required placeholder="Ingrese su usuario">
            </div>
            
            <div class="form-group">
              <label>Contraseña</label>
              <input type="password" [(ngModel)]="loginData.password" name="password" required placeholder="••••••••">
            </div>

            <div *ngIf="errorMessage" class="error-msg">{{ errorMessage }}</div>
            
            <button type="submit" class="btn btn-primary btn-block">Entrar</button>
            <div class="auth-footer">
              <a (click)="startRegistration()">Registrar nuevo médico</a>
              <a (click)="mode = 'recover'">¿Olvidó su contraseña?</a>
            </div>
          </form>
        </div>

        <!-- REGISTER MODE (WIZARD) -->
        <div *ngIf="mode === 'register'">
          <h1>Registro de Médico</h1>
          <div class="stepper">
            <div class="step" [class.active]="step >= 1">1</div>
            <div class="line"></div>
            <div class="step" [class.active]="step >= 2">2</div>
            <div class="line"></div>
            <div class="step" [class.active]="step >= 3">3</div>
          </div>

          <!-- STEP 1: CLINICA SELECTION -->
          <div *ngIf="step === 1">
            <p class="subtitle">Paso 1: Seleccione su clínica</p>
            <div class="form-group">
              <label>Clínica *</label>
              <select [(ngModel)]="selectedClinicaId" (change)="errorMessage=''">
                <option value="">Seleccione una clínica...</option>
                <option *ngFor="let c of publicClinicas" [value]="c.id">{{ c.nombre }}</option>
              </select>
            </div>
            <div *ngIf="errorMessage" class="error-msg">{{ errorMessage }}</div>
            <button class="btn btn-primary btn-block" (click)="goToStep2()" [disabled]="!selectedClinicaId">Continuar</button>
          </div>

          <!-- STEP 2: ACCESS CODE -->
          <div *ngIf="step === 2">
            <p class="subtitle">Paso 2: Ingrese el código de acceso</p>
            <div class="form-group">
              <label>Código de Acceso *</label>
              <input type="text" [(ngModel)]="accessCode" placeholder="Ingrese el código de la clínica" style="text-transform: uppercase;" (input)="errorMessage=''">
              <small class="text-muted">Este código es proporcionado por la clínica seleccionada.</small>
            </div>
            <div *ngIf="errorMessage" class="error-msg">{{ errorMessage }}</div>
            <div class="row">
              <button class="btn col" (click)="step = 1">Volver</button>
              <button class="btn btn-primary col" (click)="validateAndGoToStep3()" [disabled]="!accessCode">Validar</button>
            </div>
          </div>

          <!-- STEP 3: PERSONAL DATA -->
          <div *ngIf="step === 3">
            <p class="subtitle">Paso 3: Complete sus datos personales</p>
            <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
              <div class="row">
                <div class="form-group col">
                  <label>Tipo Documento</label>
                  <select formControlName="tipoDocumento">
                    <option value="CEDULA">Cédula</option>
                    <option value="PASAPORTE">Pasaporte</option>
                  </select>
                </div>
                <div class="form-group col">
                  <label>Documento</label>
                  <input type="text" formControlName="documento" placeholder="ID">
                  <small class="error-msg" *ngIf="fReg['documento'].touched && fReg['documento'].errors">Doc. inválido</small>
                </div>
              </div>

              <div class="row">
                <div class="form-group col">
                  <label>Primer Nombre *</label>
                  <input type="text" formControlName="primerNombre">
                </div>
                <div class="form-group col">
                  <label>Segundo Nombre</label>
                  <input type="text" formControlName="segundoNombre">
                </div>
              </div>

              <div class="row">
                <div class="form-group col">
                  <label>Primer Apellido *</label>
                  <input type="text" formControlName="primerApellido">
                </div>
                <div class="form-group col">
                  <label>Segundo Apellido</label>
                  <input type="text" formControlName="segundoApellido">
                </div>
              </div>

              <div class="form-group">
                <label>Email</label>
                <input type="email" formControlName="email">
              </div>

              <div class="form-group">
                <label>Fecha Nacimiento</label>
                <input type="date" formControlName="fechaNacimiento">
              </div>

              <div class="form-group">
                <label>Contraseña <span class="help-icon" title="Mín. 8 caracteres, Mayús, Minús, Núm, Signo.">?</span></label>
                <input type="password" formControlName="password">
              </div>

              <div class="form-group">
                <label>Confirmar Contraseña</label>
                <input type="password" formControlName="confirmPassword">
                <small class="error-msg" *ngIf="fReg['confirmPassword'].touched && registerForm.errors?.['mismatch']">No coinciden</small>
              </div>

              <div *ngIf="errorMessage" class="error-msg">{{ errorMessage }}</div>
              <div *ngIf="successMessage" class="success-msg">{{ successMessage }}</div>
              
              <div class="row">
                 <button type="button" class="btn col" (click)="step = 2">Volver</button>
                 <button type="submit" class="btn btn-primary col" >Finalizar</button>
              </div>
            </form>
          </div>

          <div class="auth-footer" *ngIf="step < 3">
            <a (click)="mode = 'login'">Cancelar registro</a>
          </div>
        </div>

        <!-- RECOVER MODE -->
        <div *ngIf="mode === 'recover'">
          <h1>Recuperar Contraseña</h1>
          <form [formGroup]="recoverForm" (ngSubmit)="onRecover()">
            <div class="form-group">
              <label>Email</label>
              <input type="email" formControlName="email" placeholder="email@ejemplo.com">
            </div>
            <div class="form-group">
              <label>Nombre de Usuario</label>
              <input type="text" formControlName="username" placeholder="usuario">
            </div>
            <div *ngIf="errorMessage" class="error-msg">{{ errorMessage }}</div>
            <button type="submit" class="btn btn-primary btn-block" [disabled]="recoverForm.invalid">Recuperar</button>
            <div class="auth-footer">
              <a (click)="mode = 'login'">Volver al Inicio</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%); padding: 1rem; }
    .login-card { width: 100%; max-width: 500px; padding: 2rem; overflow-y: auto; max-height: 95vh; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; text-align: center; color: #1e293b; }
    .subtitle { color: #64748b; text-align: center; margin-bottom: 1.5rem; font-size: 0.9rem; }
    .row { display: flex; gap: 1rem; }
    .col { flex: 1; }
    .btn-block { width: 100%; justify-content: center; margin-top: 1rem; padding: 0.75rem; }
    .error-msg { color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; display: block; text-align: center; }
    .success-msg { color: #10b981; font-size: 0.875rem; margin-bottom: 1rem; text-align: center; }
    .auth-footer { margin-top: 1.5rem; display: flex; justify-content: center; font-size: 0.85rem; }
    .auth-footer a { color: #3b82f6; cursor: pointer; text-decoration: none; }
    .help-icon { display: inline-block; width: 16px; height: 16px; background: #64748b; color: white; border-radius: 50%; text-align: center; line-height: 16px; font-size: 12px; cursor: help; margin-left: 5px; }
    .text-muted { color: #64748b; font-size: 0.75rem; }
    
    .stepper { display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; gap: 0.5rem; }
    .step { width: 30px; height: 30px; border-radius: 50%; background: #e2e8f0; color: #64748b; display: flex; align-items: center; justify-content: center; font-weight: 700; transition: 0.3s; }
    .step.active { background: #3b82f6; color: white; }
    .line { height: 2px; width: 40px; background: #e2e8f0; }
  `]
})
export class LoginComponent implements OnInit {
  mode: 'login' | 'register' | 'recover' = 'login';
  step = 1;

  loginData = { username: '', password: '' };
  registerForm: FormGroup;
  recoverForm: FormGroup;

  publicClinicas: any[] = [];
  selectedClinicaId = '';
  accessCode = '';

  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private clinicaService: ClinicaService,
    private router: Router
  ) {
    const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    this.registerForm = this.fb.group({
      tipoDocumento: ['CEDULA', Validators.required],
      documento: ['', [Validators.required, this.documentValidator.bind(this)]],
      primerNombre: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(namePattern)]],
      segundoNombre: ['', [Validators.maxLength(50), Validators.pattern(namePattern)]],
      primerApellido: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(namePattern)]],
      segundoApellido: ['', [Validators.maxLength(50), Validators.pattern(namePattern)]],
      email: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', Validators.required],
      codigoAccesoPortal: ['', Validators.required],
      clinicaId: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.registerForm.get('tipoDocumento')?.valueChanges.subscribe(() => {
      this.registerForm.get('documento')?.updateValueAndValidity();
    });

    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.fetchPublicClinicas();
  }

  fetchPublicClinicas() {
    this.clinicaService.getPublicList().subscribe({
      next: (data) => this.publicClinicas = data,
      error: () => this.errorMessage = 'Error al cargar clínicas disponibles'
    });
  }

  startRegistration() {
    this.mode = 'register';
    this.step = 1;
    this.errorMessage = '';
    this.selectedClinicaId = '';
    this.accessCode = '';
  }

  goToStep2() {
    if (this.selectedClinicaId) {
      this.step = 2;
    }
  }

  validateAndGoToStep3() {
    this.errorMessage = '';
    const code = this.accessCode.toUpperCase();
    this.clinicaService.validateAccessCode(this.selectedClinicaId, code).subscribe({
      next: (isValid) => {
        if (isValid) {
          this.registerForm.patchValue({
            codigoAccesoPortal: code,
            clinicaId: this.selectedClinicaId
          });
          this.step = 3;
        } else {
          this.errorMessage = 'Código de acceso inválido para esta clínica';
        }
      },
      error: () => this.errorMessage = 'Error al validar el código'
    });
  }

  onLogin() {
    this.errorMessage = '';
    this.authService.login(this.loginData).subscribe({
      next: () => this.router.navigate(['/pacientes']),
      error: () => this.errorMessage = 'Credenciales inválidas'
    });
  }

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    const val = { ...this.registerForm.value };
    val.primerNombre = val.primerNombre.toUpperCase();
    if (val.segundoNombre) val.segundoNombre = val.segundoNombre.toUpperCase();
    val.primerApellido = val.primerApellido.toUpperCase();
    if (val.segundoApellido) val.segundoApellido = val.segundoApellido.toUpperCase();
    val.codigoAccesoPortal = val.codigoAccesoPortal.toUpperCase();

    this.authService.register(val).subscribe({
      next: (res) => {
        alert('Registro exitoso. Ahora puede iniciar sesión.');
        this.mode = 'login';
      },
      error: (err) => this.errorMessage = err.error?.message || err.error || 'Error al registrar usuario'
    });
  }

  onRecover() {
    this.errorMessage = '';
    this.authService.recoverPassword(this.recoverForm.value).subscribe({
      next: (res) => alert(res.message),
      error: (err) => this.errorMessage = err.error.message || 'Error al procesar solicitud'
    });
  }

  get fReg() { return this.registerForm.controls; }

  private documentValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const type = this.registerForm?.get('tipoDocumento')?.value;
    if (!value) return null;
    if (type === 'CEDULA') {
      if (!/^\d{10}$/.test(value)) return { invalidCedula: true };
    } else {
      if (!/^[a-zA-Z0-9]{5,20}$/.test(value)) return { invalidPasaporte: true };
    }
    return null;
  }

  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSign = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    return (hasUpper && hasLower && hasNumber && hasSign) ? null : { weakPassword: true };
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }
}
