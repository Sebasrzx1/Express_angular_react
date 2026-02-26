import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  private getHeaders():HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<{ status: string; results: number; data: any[] }>(
      this.apiUrl, 
      { headers: this.getHeaders() }
    ).pipe(
      map((response) => response.data)
    );
  }

  obtenerUsuarioPorId(id: number): Observable<any> {
    return this.http.get<{ status: string; data: any }>(
      `${this.apiUrl}/${id}`, 
      { headers: this.getHeaders()}
    ).pipe(
      map(response => response.data)
    );
  }

  agregarUsuario(usuario: any): Observable<any> {
    return this.http.post<{ status: string; data: any }>(
      this.apiUrl,
       usuario, 
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.data)
    );
  }

  actualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put<{ status: string; message: string }>(
      `${this.apiUrl}/${id}`, 
      usuario, 
      {headers: this.getHeaders()}
    );
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<{ status: string; message: any }>(
      `${this.apiUrl}/${id}`, 
      {headers: this.getHeaders()}
    );
  }
}
