import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClinicaService } from '../../services/clinica.service';
import { Clinica } from '../../models/clinica.model';

@Component({
  selector: 'app-clinica-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Gestión de Clínicas</h1>
        <button class="btn btn-primary" (click)="nuevaClinica()">Nueva Clínica</button>
      </div>

      <div class="card shadow">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>RUC</th>
                <th>Nombre / Razón Social</th>
                <th>Celular</th>
                <th>Email</th>
                <th>Cód. Acceso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let clinica of clinicas">
                <td>{{ clinica.ruc }}</td>
                <td>
                  {{ clinica.esEmpresa ? clinica.razonSocial : (clinica.primerNombre + ' ' + clinica.primerApellido) }}
                </td>
                <td>{{ clinica.telefonoCelular }}</td>
                <td>{{ clinica.email }}</td>
                <td><code class="code-box">{{ clinica.codigoAccesoPortal }}</code></td>
                <td>
                  <button class="btn-icon" (click)="editarClinica(clinica.id!)" title="Editar">✏️</button>
                  <button class="btn-icon delete" (click)="eliminarClinica(clinica.id!)" title="Eliminar">🗑️</button>
                </td>
              </tr>
              <tr *ngIf="clinicas.length === 0">
                <td colspan="6" style="text-align: center; padding: 2rem;">No hay clínicas registradas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .code-box { background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 600; color: #0f172a; }
    .btn-icon { background: none; border: none; cursor: pointer; font-size: 1.2rem; filter: grayscale(1); }
    .btn-icon:hover { filter: none; }
    .btn-icon.delete:hover { filter: hue-rotate(300deg); }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #f1f5f9; }
    th { font-weight: 600; color: #64748b; font-size: 0.875rem; text-transform: uppercase; }
  `]
})
export class ClinicaListComponent implements OnInit {
  clinicas: Clinica[] = [];

  constructor(private clinicaService: ClinicaService, private router: Router) {}

  ngOnInit() {
    this.cargarClinicas();
  }

  cargarClinicas() {
    this.clinicaService.getAll().subscribe(data => this.clinicas = data);
  }

  nuevaClinica() {
    this.router.navigate(['/clinicas/nueva']);
  }

  editarClinica(id: string) {
    this.router.navigate(['/clinicas/editar', id]);
  }

  eliminarClinica(id: string) {
    if (confirm('¿Está seguro de eliminar esta clínica?')) {
      this.clinicaService.delete(id).subscribe(() => this.cargarClinicas());
    }
  }
}
