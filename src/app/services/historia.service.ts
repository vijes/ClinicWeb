import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consulta } from '../models/consulta.model';

const API_URL = 'http://localhost:8081/api/historias';

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
