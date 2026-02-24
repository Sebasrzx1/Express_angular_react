import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private claveToken = 'token';
  private claveUsuario = 'usuario'

  constructor(private http: HttpClient){}

  /**
   * Iniciar Sesion
   * Backend espera: {email: string, clave: string}
   * Backend responde: {status: 'success', token: string, data: {...}}
   */


  iniciarSesion(correo: string, clave: string): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/login`, {email: correo, clave: clave}).pipe(
      tap(respuesta => {
        if(respuesta.token && respuesta.data){
          localStorage.setItem(this.claveToken, respuesta.token);
          localStorage.setItem(this.claveUsuario, JSON.stringify(respuesta.data))
        }
      })
    )
  }

  /**
   * Registrar nuevo usuario
   * Backend espera: {nombre: string, email: string, clave: string, id_rol: number}
   * Backend responde: {status: 'success', data: {...}}
   */

  registrarUsuario(nombre: string, email: string, clave: string, id_rol: number = 3): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/register`, {
      nombre,
      email,
      clave,
      id_rol
    })
  }

  cerrarSesion(){
    localStorage.removeItem(this.claveToken);
    localStorage.removeItem(this.claveUsuario);

  }


  obtenerUsuario(){
    return JSON.parse(localStorage.getItem(this.claveUsuario)||'null')
  }

  estaAutenticado(): boolean {
    return !! localStorage.getItem(this.claveToken)
  }

  obtenerRol(): string {
    const usuario = this.obtenerUsuario();
    return usuario?.rol_nombre || ''
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.claveToken)
  }

}