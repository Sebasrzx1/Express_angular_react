import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolesService } from '../../services/roles/roles';
import { PermisosService } from '../../services/permisos/permisos';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class RolesComponent {
  roles: any[] = [];
  permisosDisponibles: any[] = [];

  mostrarModal = false;
  esEdicion = false;

  rolSeleccionado: any = {
    id_rol: null,
    nombre: '',
    permisos: [],
  };

  constructor(
    private rolesService: RolesService,
    private permisosService: PermisosService,
  ) {}

  ngOnInit() {
    this.cargarRoles();
    this.cargarPermisos();
  }

  cargarRoles() {
    this.rolesService.obtenerRoles().subscribe({
      next: (data) => (this.roles = data),
      error: (err) => console.error('Error al obtener roles', err),
    });
  }

  cargarPermisos() {
    this.permisosService.obtenerPermisos().subscribe({
      next: (data) => (this.permisosDisponibles = data),
      error: (err) => console.error('Error al obtener roles', err),
    });
  }

  abrirModalCrear() {
    ((this.esEdicion = false), (this.rolSeleccionado = { id_rol: null, nombre: '', permisos: [] }));
    this.mostrarModal = true;
  }

  abrirModalEditar(rol: any) {
    this.rolesService.obtenerRolPorId(rol.id_rol).subscribe({
      next: (data) => {
        this.esEdicion = true;
        this.rolSeleccionado = {
          id_rol: data.id_rol,
          nombre: data.nombre,
          permisos: data.permisos.map((p: any) => Number(p.id)),
        };
        this.mostrarModal = true;
      },
      error: (err) => {
        console.error('Error al cargar el rol', err);
      },
    });
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  togglePermiso(idPermiso: number) {
    const index = this.rolSeleccionado.permisos.indexOf(idPermiso);

    if (index > -1) {
      this.rolSeleccionado.permisos.splice(index, 1);
    } else {
      this.rolSeleccionado.permisos.push(idPermiso);
    }
  }

  seleccionarTodos() {
    this.rolSeleccionado.permisos = this.permisosDisponibles.map((p: any) => p.id_permiso);
  }

  deseleccionarTodos() {
    this.rolSeleccionado.permisos = [];
  }

  get todosSelecionados(): boolean {
    return this.rolSeleccionado.permisos.length === this.permisosDisponibles.length;
  }

  guardarCambios() {
    //validar nombre
    if (!this.rolSeleccionado.nombre || this.rolSeleccionado.nombre.trim() === '') {
      alert('El nombre del rol es obligatorio');
      return;
    }

    //Validar que tenga al menos un permiso
    if (this.rolSeleccionado.permisos.length === 0) {
      if (!confirm('¿Deseas crear/actualizar el rol sin permisos asignados?')) {
        return;
      }
    }

    if (this.esEdicion) {
      //1. Actualizar nombre por rol
      this.rolesService.actualizarRol(this.rolSeleccionado.id_rol, { nombre: this.rolSeleccionado.nombre }).subscribe({
          next: (err) => {
            // 2. Actualizar permisos de rol
            this.rolesService
              .asignarPermisos(this.rolSeleccionado.id_rol, this.rolSeleccionado.permisos).subscribe({
                next: (err) => {
                  alert('Rol y permisos actualizados correctamente');
                  this.cargarRoles();
                  this.cargarPermisos();
                },
                error: (err) => {
                  console.error('Error al asignar permisos', err);
                  alert('Error al actualizar rol: ' + (err.error?.message || 'Error desconocido'));
                },
              });
          },
          error: (err) => {
            console.error('Error al actualizar rol', err);
            alert('Error al actualizar rol: '+ (err.error?.message) || 'Error desconocido')
          }
        });;
    }else{
      //1. Crear rol
      this.rolesService.agregarRol({nombre: this.rolSeleccionado.nombre}).subscribe({
        next: (rolCreado) => {
          // 2. Asignar permisos al nuevo rol
          if(this.rolSeleccionado.permisos.length > 0){
            this.rolesService.asignarPermisos(rolCreado.id_rol, this.rolSeleccionado.permisos).subscribe({
              next: () => {
                alert('Rol creado y permisos asignados correctamente');
                this.cargarRoles;
                this.cargarPermisos;
              },
              error: (err) => {
                console.error('Error al sasignar permisos', err);
                alert('Rol creado pero errro al asignar permisos: '+ (err.error?.message || 'Error desconocido'));
                this.cargarRoles();
                this.cargarPermisos();
              }
            });
          }else{
            alert('Rol creado correctamente (sin permisos)');
            this.cargarPermisos();
            this.cerrarModal();
          }
        },
        error: (err) => {
          console.error('Error al crear rol', err);
          alert('Error al crear rol: ' + (err.error?.message || 'Error desconcido'))
        }
      });
    }
  }

  eliminarRol(id: number){
    if(confirm('¿Seguro que deseas eliminar este rol?'))
      this.rolesService.eliminarRol(id).subscribe({
        next: () => this.cargarRoles(),
        error: (err) => console.error('Error al eliminar rol', err)
      })
    }
}
