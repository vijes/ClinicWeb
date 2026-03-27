import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consulta } from '../models/consulta.model';

const API_URL = environment.apiUrl + '/historias';

@Injectable({
  providedIn: 'root'
})
export class HistoriaService {
  constructor(private http: HttpClient) { }

  getConsultasByPaciente(pacienteId: string): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${API_URL}/paciente/${pacienteId}`);
  }

  addConsulta(pacienteId: string, consulta: Consulta): Observable<Consulta> {
    return this.http.post<Consulta>(`${API_URL}/paciente/${pacienteId}/consultas`, consulta);
  }
}
