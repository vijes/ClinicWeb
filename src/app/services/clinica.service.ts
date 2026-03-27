import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clinica } from '../models/clinica.model';

const API_URL = environment.apiUrl + '/clinicas';
const PUBLIC_API_URL = environment.apiUrl + '/public/clinicas';

@Injectable({
  providedIn: 'root'
})
export class ClinicaService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Clinica[]> {
    return this.http.get<Clinica[]>(API_URL);
  }

  getPublicList(): Observable<any[]> {
    return this.http.get<any[]>(`${PUBLIC_API_URL}/list`);
  }

  getById(id: string): Observable<Clinica> {
    return this.http.get<Clinica>(`${API_URL}/${id}`);
  }

  create(clinica: Clinica): Observable<Clinica> {
    return this.http.post<Clinica>(API_URL, clinica);
  }

  update(id: string, clinica: Clinica): Observable<Clinica> {
    return this.http.put<Clinica>(`${API_URL}/${id}`, clinica);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }

  validateAccessCode(id: string, code: string): Observable<boolean> {
    return this.http.get<boolean>(`${PUBLIC_API_URL}/validate-code/${id}/${code}`);
  }
}
