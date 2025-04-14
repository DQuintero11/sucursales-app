import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Moneda } from '../models/moneda.model';


@Injectable({
  providedIn: 'root'
})
export class MonedaService {
  private apiUrl = 'https://localhost:7247/api/Moneda'; 

  constructor(private http: HttpClient) {}

  getMonedas(): Observable<Moneda[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  
    });
    return this.http.get<Moneda[]>(this.apiUrl , { headers });
  }
}
