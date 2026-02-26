import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RolesPermisoService {
  private apiUrl = 'http://localhost:3000/api/rol-permiso';

  constructor(private http: HttpClient) {}

  obtenerRolPermiso(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl)
  }

  obtenerRolPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
  }

  asignarPermiso(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data)
  }

  actualizarRolPermiso(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data)
  }

  eliminarRolPermiso(id: number, data: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`,data)
  }
}
