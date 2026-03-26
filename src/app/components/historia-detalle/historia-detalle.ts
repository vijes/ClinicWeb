import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../models/paciente.model';
import { HistoriaClinicaService, HistoriaClinicaDTO, HistoriaFilterDTO } from '../../services/historia-clinica.service';

@Component({
  selector: 'app-historia-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container relative">
      <div class="header card-summary" *ngIf="paciente">
        <a (click)="goBack()" class="btn-back">← Volver</a>
        <div class="summary-info">
          <h1>{{ paciente.persona.nombreCompleto || (paciente.persona.primerNombre + ' ' + paciente.persona.primerApellido) }}</h1>
          <div class="badges">
            <span class="badge">Doc: {{ paciente.persona.documento }}</span>
            <span class="badge">Edad: {{ getEdad(paciente.persona.fechaNacimiento) }} años</span>
            <span class="badge" *ngIf="paciente.tipoSangre">Sangre: {{ paciente.tipoSangre }}</span>
          </div>
        </div>
      </div>

      <div class="layout">
        <div class="main-content">
          <div class="card mb-4 mt-2">
            <h2>Nueva Atención Médica</h2>
            <form (ngSubmit)="onAddHistoria()" #cForm="ngForm">
              <div class="form-group">
                <label>Diagnóstico (Máx 1500 caracteres) *</label>
                <textarea name="diag" [(ngModel)]="nuevaHistoria.diagnostico" required rows="3" maxlength="1500" placeholder="Descripción del diagnóstico..."></textarea>
              </div>
              <div class="grid">
                <div class="form-group">
                  <label>Tratamiento (Máx 1500 caracteres)</label>
                  <textarea name="trata" [(ngModel)]="nuevaHistoria.tratamiento" rows="3" maxlength="1500"></textarea>
                </div>
                <div class="form-group">
                  <label>Receta (Máx 1500 caracteres)</label>
                  <textarea name="rece" [(ngModel)]="nuevaHistoria.receta" rows="3" maxlength="1500"></textarea>
                </div>
              </div>
              <button type="submit" class="btn btn-primary" [disabled]="cForm.invalid">Guardar Atención</button>
            </form>
          </div>

          <div class="card filter-section">
            <div class="filter-header">
              <h2>Historial de Atenciones</h2>
              <div class="filters">
                 <div class="date-group">
                   <label>Desde:</label>
                   <input type="date" [(ngModel)]="filter.fechaDesde" (change)="loadHistorias()">
                 </div>
                 <div class="date-group">
                   <label>Hasta:</label>
                   <input type="date" [(ngModel)]="filter.fechaHasta" (change)="loadHistorias()">
                 </div>
                 <button class="btn btn-outline btn-sm" (click)="resetFilters()">Últimos 30 días</button>
              </div>
            </div>

            <div *ngIf="historias.length === 0" class="empty">No se encontraron atenciones en este rango de fechas.</div>
            
            <div class="table-container" *ngIf="historias.length > 0">
               <table>
                 <thead>
                   <tr>
                     <th>Fecha</th>
                     <th>Médico Evaluador</th>
                     <th>Diagnóstico Resumen</th>
                     <th>Acción</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr *ngFor="let h of historias">
                     <td>{{ h.fechaRegistro | date:'short' }}</td>
                     <td>{{ h.medicoEvaluador || 'Sistema' }}</td>
                     <td>{{ (h.diagnostico.length > 50) ? (h.diagnostico | slice:0:50) + '...' : h.diagnostico }}</td>
                     <td><button class="btn btn-sm btn-primary" (click)="openModal(h)">Ver Detalle</button></td>
                   </tr>
                 </tbody>
               </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Overlay -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Detalle de Atención Médica</h2>
            <button class="close-btn" (click)="closeModal()">×</button>
          </div>
          <div class="modal-body" *ngIf="selectedHistoria">
            <div class="meta-info">
               <span><strong>Fecha:</strong> {{ selectedHistoria.fechaRegistro | date:'medium' }}</span>
               <span><strong>Médico:</strong> {{ selectedHistoria.medicoEvaluador || 'Sistema' }}</span>
            </div>
            <div class="detail-section">
               <h3>Diagnóstico</h3>
               <p>{{ selectedHistoria.diagnostico }}</p>
            </div>
            <div class="detail-section" *ngIf="selectedHistoria.tratamiento">
               <h3>Tratamiento</h3>
               <p>{{ selectedHistoria.tratamiento }}</p>
            </div>
            <div class="detail-section" *ngIf="selectedHistoria.receta">
               <h3>Receta</h3>
               <p>{{ selectedHistoria.receta }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .relative { position: relative; }
    .card-summary { padding: 1.5rem; background: #fff; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 2rem; border-top: 4px solid #3b82f6; }
    .btn-back { display: inline-block; margin-bottom: 1rem; text-decoration: none; color: #64748b; font-size: 0.875rem; cursor: pointer; }
    .btn-back:hover { color: #3b82f6; }
    h1 { margin: 0 0 0.5rem; color: #1e293b; font-size: 1.5rem; }
    .badges { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .badge { background: #f1f5f9; color: #475569; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.85rem; font-weight: 500; }
    
    .layout { display: flex; flex-direction: column; gap: 2rem; }
    h2 { font-size: 1.25rem; margin-bottom: 1.5rem; color: #0f172a; }
    .mb-4 { margin-bottom: 2rem; }
    .mt-2 { margin-top: 1rem; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    
    .filter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .filter-header h2 { margin: 0; }
    .filters { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
    .date-group { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }
    .date-group input { padding: 0.25rem 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.25rem; }
    .btn-sm { padding: 0.25rem 0.75rem; font-size: 0.85rem; }
    
    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; background: #f8fafc; padding: 1rem; color: #64748b; font-size: 0.85rem; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
    td { padding: 1rem; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 0.9rem; }
    
    .empty { padding: 2rem; text-align: center; color: #64748b; background: #f8fafc; border-radius: 0.5rem; }
    
    /* Modal Styles */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-content { background: #fff; width: 90%; max-width: 700px; border-radius: 0.5rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); display: flex; flex-direction: column; max-height: 90vh; }
    .modal-header { padding: 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
    .modal-header h2 { margin: 0; font-size: 1.25rem; }
    .close-btn { background: none; border: none; font-size: 1.5rem; color: #64748b; cursor: pointer; transition: color 0.2s; }
    .close-btn:hover { color: #ef4444; }
    .modal-body { padding: 1.5rem; overflow-y: auto; }
    .meta-info { display: flex; gap: 2rem; background: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; font-size: 0.9rem; color: #475569; }
    .detail-section { margin-bottom: 1.5rem; }
    .detail-section h3 { font-size: 1rem; color: #3b82f6; margin-bottom: 0.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.25rem; }
    .detail-section p { color: #334155; line-height: 1.6; white-space: pre-wrap; margin: 0; }
  `]
})
export class HistoriaDetalleComponent implements OnInit {
  pacienteId: string = '';
  paciente?: Paciente;
  
  historias: HistoriaClinicaDTO[] = [];
  nuevaHistoria: Partial<HistoriaClinicaDTO> = { diagnostico: '', tratamiento: '', receta: '' };
  
  filter: HistoriaFilterDTO = { pacienteId: '' };
  
  showModal = false;
  selectedHistoria?: HistoriaClinicaDTO;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private historiaService: HistoriaClinicaService,
    private pacienteService: PacienteService
  ) { }

  ngOnInit() {
    this.pacienteId = this.route.snapshot.paramMap.get('pacienteId')!;
    this.filter.pacienteId = this.pacienteId;
    this.loadPaciente();
    this.resetFilters();
  }

  goBack() {
    this.location.back();
  }

  getEdad(fechaNacimiento?: string): number {
    if (!fechaNacimiento) return 0;
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  loadPaciente() {
    this.pacienteService.getById(this.pacienteId).subscribe(res => this.paciente = res);
  }

  loadHistorias() {
    // Si los inputs tipo date envian string vacio, los mapeamos a undefined
    const f: HistoriaFilterDTO = { pacienteId: this.pacienteId };
    if (this.filter.fechaDesde) f.fechaDesde = this.filter.fechaDesde + 'T00:00:00';
    if (this.filter.fechaHasta) f.fechaHasta = this.filter.fechaHasta + 'T23:59:59';

    this.historiaService.filtrarHistorias(f).subscribe(res => this.historias = res);
  }

  resetFilters() {
    this.filter.fechaDesde = undefined;
    this.filter.fechaHasta = undefined;
    this.loadHistorias(); // Service in backend handles default 30 days logic gracefully
  }

  onAddHistoria() {
    this.nuevaHistoria.pacienteId = this.pacienteId;
    this.historiaService.crearHistoria(this.nuevaHistoria as HistoriaClinicaDTO).subscribe(() => {
      this.nuevaHistoria = { diagnostico: '', tratamiento: '', receta: '' };
      this.loadHistorias();
    });
  }

  openModal(historia: HistoriaClinicaDTO) {
    this.selectedHistoria = historia;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedHistoria = undefined;
  }
}
