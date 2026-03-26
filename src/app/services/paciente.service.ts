import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente.model';

const API_URL = 'http://localhost:8081/api/pacientes';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  constructor(private http: HttpClient) { }

  getAll(filters?: any): Observable<Paciente[]> {
    return this.http.post<Paciente[]>(`${API_URL}/obtenerListaPacientes`, filters || {});
  }

  getById(id: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${API_URL}/${id}`);
  }

  create(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(`${API_URL}/createPacient`, paciente);
  }

  update(id: string, paciente: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${API_URL}/${id}`, paciente);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }
}
