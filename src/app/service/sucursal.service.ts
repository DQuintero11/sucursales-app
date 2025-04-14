import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sucursal } from '../models/sucursal.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  private apiUrl = 'https://localhost:7247/api/sucursales'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sucursal[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  
    });
    return this.http.get<Sucursal[]>(this.apiUrl , { headers });
  }

  getById(id: number): Observable<Sucursal> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  
    });
    return this.http.get<Sucursal>(`${this.apiUrl}/${id}`,  { headers });
  }

  create(sucursal: Sucursal): Observable<void> {
    debugger;
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  
    });
    return this.http.post<void>(this.apiUrl, sucursal ,  { headers });
  }

  update(sucursal: Sucursal): Observable<void> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  
    });
    return this.http.put<void>(`${this.apiUrl}/${sucursal.id}`, sucursal,   { headers });
  }

  delete(codigo: number): Observable<void> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  
    });
    return this.http.delete<void>(`${this.apiUrl}/${codigo}`,    { headers });
  }
}
