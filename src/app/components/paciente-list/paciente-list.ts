import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../models/paciente.model';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container">
      <div class="header-section">
        <div class="title-group">
          <h1>Gestión de Pacientes</h1>
          <p class="subtitle">Búsqueda avanzada y administración de pacientes</p>
        </div>
      </div>

      <!-- Filtros Avanzados -->
      <div class="card filter-card">
        <h3>Filtros de Búsqueda</h3>
        <form (ngSubmit)="onSearch()" class="filter-form">
          <div class="filter-grid">
            <div class="form-group">
              <label>No. Documento</label>
              <input type="text" [(ngModel)]="filters.documento" name="documento" placeholder="ID del paciente">
            </div>
            <div class="form-group">
              <label>Primer Nombre</label>
              <input type="text" [(ngModel)]="filters.primerNombre" name="primerNombre">
            </div>
            <div class="form-group">
              <label>Segundo Nombre</label>
              <input type="text" [(ngModel)]="filters.segundoNombre" name="segundoNombre">
            </div>
            <div class="form-group">
              <label>Primer Apellido</label>
              <input type="text" [(ngModel)]="filters.primerApellido" name="primerApellido">
            </div>
            <div class="form-group">
              <label>Segundo Apellido</label>
              <input type="text" [(ngModel)]="filters.segundoApellido" name="segundoApellido">
            </div>
          </div>
          <div class="filter-actions">
            <button type="button" class="btn btn-outline" (click)="clearFilters()">Limpiar</button>
            <button type="submit" class="btn btn-primary" [disabled]="!hasFilters()">
              <span class="icon">🔍</span> Buscar
            </button>
          </div>
        </form>
        <small class="hint" *ngIf="!hasFilters()">* Ingrese al menos un filtro para buscar</small>
      </div>

      <div class="card table-container">
        <table>
          <thead>
            <tr>
              <th>Documento</th>
              <th>Nombres Completos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of pacientes">
              <td class="bold">{{ p.persona.documento }}</td>
              <td>
                {{ p.persona.primerNombre }} {{ p.persona.segundoNombre || '' }} 
                {{ p.persona.primerApellido }} {{ p.persona.segundoApellido || '' }}
              </td>
              <td class="actions">
                <a [routerLink]="['/historias', p.id]" class="btn-icon" title="Ver Historia">📑</a>
                <a [routerLink]="['/pacientes/editar', p.id]" class="btn-icon" title="Editar">✏️</a>
                <button (click)="deletePaciente(p.id!)" class="btn-icon text-danger" title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr *ngIf="pacientes.length === 0">
              <td colspan="3" class="empty-state">
                <div class="empty-content">
                  <span class="empty-icon">👥</span>
                  <p>No se encontraron pacientes registrados con los filtros ingresados.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container { padding-top: 1rem; }
    .header-section { margin-bottom: 1.5rem; }
    h1 { font-size: 1.75rem; color: #1e293b; margin: 0; }
    .subtitle { color: #64748b; margin-top: 0.25rem; }
    
    .filter-card { padding: 1.5rem; margin-bottom: 2rem; border-left: 4px solid #3b82f6; }
    .filter-card h3 { font-size: 1rem; margin-bottom: 1.25rem; color: #475569; }
    .filter-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    .filter-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
    .hint { color: #94a3b8; font-style: italic; }

    .table-container { padding: 0; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; background: #f8fafc; padding: 1.25rem 1rem; color: #64748b; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #e2e8f0; }
    td { padding: 1rem; border-top: 1px solid #f1f5f9; color: #334155; }
    .bold { font-weight: 700; color: #1e293b; }
    .actions { display: flex; gap: 0.75rem; }
    .btn-icon { text-decoration: none; border: none; background: none; font-size: 1.2rem; cursor: pointer; padding: 0.4rem; border-radius: 0.5rem; transition: 0.2s; }
    .btn-icon:hover { background: #f1f5f9; transform: scale(1.1); }
    .empty-state { text-align: center; padding: 4rem 2rem; color: #94a3b8; }
    .empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
  `]
})
export class PacienteListComponent implements OnInit {
  pacientes: Paciente[] = [];
  filters = {
    documento: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: ''
  };

  constructor(private pacienteService: PacienteService) { }

  ngOnInit() {
    this.loadPacientes();
  }

  hasFilters(): boolean {
    return Object.values(this.filters).some(v => v && v.trim() !== '');
  }

  onSearch() {
    this.loadPacientes();
  }

  clearFilters() {
    this.filters = {
      documento: '',
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: ''
    };
    this.loadPacientes();
  }

  loadPacientes() {
    this.pacienteService.getAll(this.filters).subscribe(res => this.pacientes = res);
  }

  deletePaciente(id: string) {
    if (confirm('¿Está seguro de eliminar este paciente?')) {
      this.pacienteService.delete(id).subscribe(() => this.loadPacientes());
    }
  }
}
