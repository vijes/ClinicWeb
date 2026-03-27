import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita } from '../models/cita.model';

const API_URL = environment.apiUrl + '/citas';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  constructor(private http: HttpClient) { }

  getAll(filters?: any): Observable<Cita[]> {
    let params = {};
    if (filters) {
      params = Object.keys(filters)
        .filter(key => filters[key])
        .reduce((obj, key) => ({ ...obj, [key]: filters[key] }), {});
    }
    return this.http.get<Cita[]>(API_URL, { params });
  }

  create(cita: any): Observable<Cita> {
    return this.http.post<Cita>(API_URL, cita);
  }

  cancel(id: string): Observable<Cita> {
    return this.http.put<Cita>(`${API_URL}/${id}/cancel`, {});
  }

  reschedule(id: string, nuevaFecha: string): Observable<Cita> {
    return this.http.put<Cita>(`${API_URL}/${id}/reschedule?nuevaFecha=${nuevaFecha}`, {});
  }

  updateStatus(id: string, status: string): Observable<Cita> {
    return this.http.patch<Cita>(`${API_URL}/${id}/status?status=${status}`, {});
  }
}
