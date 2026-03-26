import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../../services/cita.service';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="header-section">
        <h1>Agenda de Citas</h1>
      </div>

      <!-- Filtros de Citas -->
      <div class="card filter-card">
        <form (ngSubmit)="onSearch()" class="filter-form">
          <div class="filter-grid">
            <div class="form-group">
              <label>No. Documento</label>
              <input type="text" [(ngModel)]="filters.documento" name="documento" placeholder="Documento paciente">
            </div>
            <div class="form-group">
              <label>Fecha Desde</label>
              <input type="date" [(ngModel)]="filters.fechaDesde" name="fechaDesde">
            </div>
            <div class="form-group">
              <label>Fecha Hasta</label>
              <input type="date" [(ngModel)]="filters.fechaHasta" name="fechaHasta">
            </div>
          </div>
          <div class="filter-actions">
            <button type="button" class="btn btn-outline" (click)="clearFilters()">Limpiar</button>
            <button type="submit" class="btn btn-primary">🔍 Buscar</button>
          </div>
        </form>
      </div>

      <div class="card table-container">
        <table>
          <thead>
            <tr>
              <th>Documento</th>
              <th>Paciente</th>
              <th>Fecha y Hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of citas">
              <td class="bold">{{ c.paciente.persona.documento }}</td>
              <td>{{ c.paciente.persona.primerNombre }} {{ c.paciente.persona.primerApellido }}</td>
              <td>{{ c.fechaHora | date:'medium' }}</td>
              <td>
                <span class="badge" [ngClass]="'badge-' + c.estado?.toLowerCase()">
                  {{ c.estado }}
                </span>
              </td>
              <td class="actions">
                <button *ngIf="c.estado === 'PENDIENTE'" (click)="onCancel(c.id!)" class="btn-icon text-danger" title="Cancelar">🚫</button>
                <button *ngIf="c.estado === 'PENDIENTE'" (click)="onReschedule(c.id!)" class="btn-icon text-primary" title="Reagendar">📅</button>
              </td>
            </tr>
            <tr *ngIf="citas.length === 0">
              <td colspan="5" class="empty-state">No se encontraron citas agendadas</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container { padding-top: 1rem; }
    .header-section { margin-bottom: 1.5rem; }
    h1 { font-size: 1.75rem; color: #1e293b; }
    
    .filter-card { padding: 1.5rem; margin-bottom: 2rem; }
    .filter-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    .filter-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }

    .table-container { padding: 0; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; background: #f8fafc; padding: 1.25rem 1rem; color: #64748b; font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
    td { padding: 1rem; border-top: 1px solid #f1f5f9; }
    .bold { font-weight: 700; color: #1e293b; }
    
    .badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
    .badge-pendiente { background: #fef9c3; color: #854d0e; }
    .badge-completada { background: #dcfce7; color: #166534; }
    .badge-cancelada { background: #fee2e2; color: #991b1b; }

    .actions { display: flex; gap: 0.5rem; }
    .btn-icon { background: none; border: none; font-size: 1.2rem; cursor: pointer; padding: 0.4rem; border-radius: 0.5rem; transition: 0.2s; }
    .btn-icon:hover { background: #f1f5f9; transform: scale(1.1); }
    .empty-state { text-align: center; padding: 4rem; color: #94a3b8; }
  `]
})
export class CitaListComponent implements OnInit {
  citas: Cita[] = [];
  filters = {
    documento: '',
    fechaDesde: '',
    fechaHasta: ''
  };

  constructor(private citaService: CitaService) { }

  ngOnInit() {
    this.loadCitas();
  }

  onSearch() {
    this.loadCitas();
  }

  clearFilters() {
    this.filters = { documento: '', fechaDesde: '', fechaHasta: '' };
    this.loadCitas();
  }

  loadCitas() {
    // Convert date strings to ISO for backend if present
    const queryFilters: any = { ...this.filters };
    if (queryFilters.fechaDesde) queryFilters.fechaDesde = new Date(queryFilters.fechaDesde).toISOString();
    if (queryFilters.fechaHasta) queryFilters.fechaHasta = new Date(queryFilters.fechaHasta).toISOString();
    
    this.citaService.getAll(queryFilters).subscribe(res => this.citas = res);
  }

  onCancel(id: string) {
    if (confirm('¿Está seguro de cancelar esta cita?')) {
      this.citaService.cancel(id).subscribe(() => this.loadCitas());
    }
  }

  onReschedule(id: string) {
    const newDateStr = prompt('Ingrese la nueva fecha y hora (Formato: YYYY-MM-DDTHH:mm)');
    if (newDateStr) {
      const newDate = new Date(newDateStr);
      if (newDate < new Date()) {
        alert('No se puede seleccionar una fecha anterior al día actual');
        return;
      }
      this.citaService.reschedule(id, newDate.toISOString()).subscribe({
        next: () => this.loadCitas(),
        error: (err) => alert(err.error.message || 'Error al reagendar cita')
      });
    }
  }
}
