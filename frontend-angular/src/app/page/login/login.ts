import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent{
  correo = '';
  clave = '';

  constructor(private authService: AuthService, private router: Router){}

  iniciarSesion(){
    this.authService.iniciarSesion(this.correo, this.clave).subscribe({
      next:(respuesta) => {
        console.log('Login exitoso:', respuesta)
        const usuario = this.authService.obtenerUsuario();

        //El backend devuelve rol nombre 
        if(usuario?.rol_nombre === 'Administrador'){
          this.router.navigate(['/usuarios'])
        }else{
          this.router.navigate(['/inicio'])
        }
      },
      error: err => {
        console.error('Error en login:', err)
        const mensaje = err.error?.message || 'Credenciales incorrectas';
        alert(mensaje)
      }
    })
  }









}
