import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class NegocioService {
  private apiUrl = 'http://localhost:3000/api/negocios';
  private uploadUrl = 'http://localhost:3000/api/upload';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer${token}`,
    });
  }

  obtenerNegocios(): Observable<any[]> {
    return this.http
      .get<{
        status: String;
        results: number;
        data: any[];
      }>(this.apiUrl, { Headers: this.getHeaders() })
      .pipe(map((response) => response.data));
  }

  obtenerNeocioPorId(id: number): Observable<any> {
    return this.http.get<{ status: string; data: any }>(
      `${this.apiUrl}/${id}`,
      { Headers: this.getHeaders() }
    ).pipe(
      map((response) => response.data)
    );
  }

  agregarNegocio(negocio: any): Observable<any> {
    return this.http.post<{ status: string; data: any }>(
      this.apiUrl,
      negocio,
      { headers: this.getHeaders() }
    );
  }









  
}
