import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios/usuarios';
import { RolesService } from '../../services/roles/roles';
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class UsuariosComponent {
  usuarios: any[] = [];
  roles: any[] = [];
  mostrarModal = false;
  modoEdicion = false;
  permisosRolesSeleccionado: any[] = [];

  usuarioForm: any = {
    id_usuario: null,
    nombre: '',
    email: '',
    clave: '',
    id_rol: null,
  };

  constructor(
    private usuariosService: UsuariosService,
    private rolesSerivce: RolesService,
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  cargarUsuarios() {
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (data) => (this.usuarios = data),
      error: (err) => console.error('Error al obtener usuarios'),
    });
  }

  cargarRoles() {
    this.rolesSerivce.obtenerRoles().subscribe({
      next: (data) => (this.roles = data),
      error: (err) => console.error(''),
    });
  }

  abrirModal(usuario: any = null) {
    if (usuario) {
      this.modoEdicion = true;

      this.usuarioForm = {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        clave: '',
        id_rol: usuario.id_rol,
      };
      this.cargarPermisos();
    } else {
      this.modoEdicion = false;
      this.usuarioForm = { id_usuario: null, nombre: '', email: '', clave: '', id_rol: null };
      this.permisosRolesSeleccionado = [];
    }
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.usuarioForm = { id_usuario: null, nombre: '', email: '', clave: '', id_rol: null };
    this.permisosRolesSeleccionado = [];
  }

  cargarPermisos() {
    if (!this.usuarioForm.id_rol) return;
    //Convertir a número por si viene como string del select
    const idRol = Number(this.usuarioForm.id_rol);

    this.rolesSerivce.obtenerRolPorId(idRol).subscribe({
      next: (rol) => {
        this.permisosRolesSeleccionado = rol.permisosDisponibles
          ? rol.permisos.map((p: any) => p.nombre)
          : [];
      },
      error: (err) => console.error('Error al cargar permisos del rol', err),
    });
  }

  registrarUsuario() {
    // Validar nombre
    if (!this.usuarioForm.nombre || this.usuarioForm.nombre.trim().length < 3) {
      alert('El nombre debe tener al menos 3 caracteres');
      return;
    }
    // Validar Email
    if (!this.usuarioForm.email || this.usuarioForm.email.includes('@')) {
      alert('Ingresa un email válido');
      return;
    }
    // Validar contraseña
    if (!this.usuarioForm.clave || this.usuarioForm.clave.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    // Validar rol
    if (!this.usuarioForm.id_rol) {
      alert('Debes seleccionar un rol');
      return;
    }

    //Asegurar que id_rol sea número
    const usuario = {
      ...this.usuarioForm,
      id_rol: Number(this.usuarioForm.id_rol),
    };

    this.usuariosService.agregarUsuario(usuario).subscribe({
      next: () => {
        alert('Usuario creado correctamente');
        this.cargarUsuarios;
        this.cerrarModal;
      },
      error: (err) => {
        console.error('Error al resgitrar usuario', err);
        const errorMsg = err.error?.message || 'Error al crear el usuario';
        alert(errorMsg);
      },
    });
  }

  actualizarUsuario() {
    // Validar nombre
    if (!this.usuarioForm.nombre || this.usuarioForm.nombre.trim().length < 3) {
      alert('El nombre debe tener al menos 3 caracteres');
      return;
    }
    // Validar Email
    if (!this.usuarioForm.email || this.usuarioForm.email.includes('@')) {
      alert('Ingresa un email válido');
      return;
    }
    // Validar rol
    if (!this.usuarioForm.id_rol) {
      alert('Debes seleccionar un rol');
      return;
    }

    //Prepara datos para actualizacion (Solo campos necesarios)
    const usuario: any = {
      nombre: this.usuarioForm.nombre,
      email: this.usuarioForm.email,
      id_rol: Number(this.usuarioForm.id_rol)
    };

    //Solo incluir clave si se ha modificado
    if(this.usuarioForm.clave && this.usuarioForm.clave.trim()!==''){
      //validar longitud minima
      if(this.usuarioForm.clave.length < 6){
        alert('La contraseña debe tener al menos 6 caracteres')
        return;
      }
      usuario.clave = this.usuarioForm.clave;
    }
  }
  this.usuariosService
}
