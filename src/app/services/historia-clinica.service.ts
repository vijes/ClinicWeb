import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = environment.apiUrl + '/historias';

export interface HistoriaClinicaDTO {
  id?: string;
  pacienteId: string;
  diagnostico: string;
  tratamiento: string;
  receta: string;
  fechaRegistro?: string;
  medicoEvaluador?: string;
}

export interface HistoriaFilterDTO {
  pacienteId: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistoriaClinicaService {
  constructor(private http: HttpClient) { }

  crearHistoria(dto: HistoriaClinicaDTO): Observable<HistoriaClinicaDTO> {
    return this.http.post<HistoriaClinicaDTO>(`${API_URL}/crear`, dto);
  }

  filtrarHistorias(filter: HistoriaFilterDTO): Observable<HistoriaClinicaDTO[]> {
    return this.http.post<HistoriaClinicaDTO[]>(`${API_URL}/filtrar`, filter);
  }
}
