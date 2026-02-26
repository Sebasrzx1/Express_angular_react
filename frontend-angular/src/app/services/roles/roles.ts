import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private apiUrl = 'http://localhost:3000/api/roles';

  constructor(private http: HttpClient) {}

  private getHeaders():HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerRoles(): Observable<any[]> {
    return this.http.get<{ status: string; results: number; data: any[] }>(
      this.apiUrl, 
      { headers: this.getHeaders() }
    ).pipe(
      map((response) => response.data)
    );
  }

  obtenerRolPorId(id: number): Observable<any> {
    return this.http.get<{ status: string; data: any }>(
      `${this.apiUrl}/${id}`, 
      { headers: this.getHeaders()}
    ).pipe(
      map(response => response.data)
    );
  }

  agregarRol(rol: any): Observable<any> {
    return this.http.post<{ status: string; data: any }>(
      this.apiUrl,
       rol, 
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.data)
    );
  }

  actualizarRol(id: number, rol: any): Observable<any> {
    return this.http.put<{ status: string; message: string }>(
      `${this.apiUrl}/${id}`, 
      rol, 
      {headers: this.getHeaders()}
    );
  }

  eliminarRol(id: number): Observable<any> {
    return this.http.delete<{ status: string; message: any }>(
      `${this.apiUrl}/${id}`, 
      {headers: this.getHeaders()}
    );
  }

  asignarPermisos(idRol: number, permissionIds: number[]): Observable<any> {
    return this.http.put<{ status: string; message: string}>(
      `${this.apiUrl}/${idRol}/permisos`,
      {permissionIds},
      {headers: this.getHeaders()}
    )
  }
}
