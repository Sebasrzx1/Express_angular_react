import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios/usuarios';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class PerfilComponent implements OnInit {
  usuario: any = null;
  mostrarModal = false;
  mostrarCambioPassword = false;

  perfilForm: any = {
    id_usuario: null,
    nombre: '',
    email: '',
    clave: '',
    confirmarClave: '',
  };

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit() {
    this.cargarDatosUsuarios();
  }

  cargarDatosUsuarios() {
    //Obtener datos del usuario desde localStorage
    const usuarioLocal = localStorage.getItem('usuario');

    if (usuarioLocal) {
      this.usuario = JSON.parse(usuarioLocal);
    }
  }

  abrirModalEditar() {
    if (!this.usuario) {
      alert('Error: No se pudo cargar los datos del usuario');
      return;
    }

    this.perfilForm = {
      id_usuario: this.usuario.id_usuario,
      nombre: this.usuario.nombre,
      email: this.usuario.email,
      clave: '',
      confirmarClave: '',
    };

    ((this.mostrarCambioPassword = false), (this.mostrarModal = true));
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.mostrarCambioPassword = false;
  }

  toggleCambioPassword() {
    this.mostrarCambioPassword = !this.mostrarCambioPassword;
    if (!this.mostrarCambioPassword) {
      this.perfilForm.clave = '';
      this.perfilForm.confirmarClave = '';
    }
  }

  actualizarPerfil() {
    //Validaciones
    if (!this.perfilForm.nombre || this.perfilForm.nombre.trim() === '') {
      alert('El nombre es obligatorio');
      return;
    }
    if (!this.perfilForm.email || this.perfilForm.email.trim() === '') {
      alert('El email es obligatorio');
      return;
    }
    //Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.perfilForm.email)) {
      alert('Formato de correo invalido');
      return;
    }

    //Si esta cambiando contraseña, validar
    if (this.mostrarCambioPassword) {
      if (!this.perfilForm.clave || this.perfilForm.clave.length < 6) {
        alert('La contrasñea debe tener almenos 6 caracteres');
        return;
      }
      if(this.perfilForm.clave !== this.perfilForm.confirmarClave){
        alert('Las contraseñas no coinciden')
        return;
      }
    }

    //Preparar datos para enviar
    const datosActualizar: any = {
      nombre: this.perfilForm.nombre,
      email: this.perfilForm.email
    }

    //Solo incluir clave si se está cambiando
    if(this.mostrarCambioPassword && this.perfilForm.clave){
      datosActualizar.clave = this.perfilForm.clave;
    }

    //Llamar al servicio
    this.usuariosService.actualizarUsuario(this.perfilForm.id_usuario, datosActualizar).subscribe({
      next: () => {
        alert('Perifl actualizado correctamente')

        //Actualizar datos locales 
        this.usuario.nombre = this.perfilForm.nombre;
        this.usuario.email = this.perfilForm.email;

        //Actualizar localStorage
        localStorage.setItem('usuario', JSON.stringify(this.usuario))

        this.cerrarModal()
      },
      error: (err) => {
        console.error('Error al actualizar perfil', err);
        const mensaje = err.error?.message || err.error?.errors?.[0]?.message || 'Error desconocido';
        alert('Error al actualizar perfil: '+ mensaje)
      }
    })
  }
}
