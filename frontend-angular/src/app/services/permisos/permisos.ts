import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PermisosService {
  private apiUrl = 'http://localhost:3000/api/permisos';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }

  obtenerPermisos(): Observable<any[]> {
    return this.http.get<{ status: string; results: number;data: any[];}>(
      this.apiUrl, 
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.data)
    );
  }

  obtenerPermisosPorId(id: number): Observable<any> {
    return this.http.get<{ status: string; data: any }>(
      `${this.apiUrl}/${id}`, 
      { headers: this.getHeaders()}
    ).pipe(map(response => response.data));
  }

  agregarPermiso(permiso: any): Observable<any> {
    return this.http.post<{ status: string; data: any }>(
      this.apiUrl,
       permiso, 
      { headers: this.getHeaders() }
    ).pipe(map(response => response.data));
  }

  actualizarPermiso(id: number, permiso: any): Observable<any> {
    return this.http.put<{ status: string; message: string }>(
      `${this.apiUrl}/${id}`, 
      permiso, 
      {headers: this.getHeaders()}
    );
  }

  eliminarPermiso(id: number): Observable<any> {
    return this.http.delete<{ status: string; message: any }>(
      `${this.apiUrl}/${id}`, 
      {headers: this.getHeaders()}
    );
  }
}
