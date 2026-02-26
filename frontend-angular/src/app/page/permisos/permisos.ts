import { Component } from '@angular/core';
import { CommonModule} from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PermisosService } from '../../services/permisos/permisos'

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './permisos.html',
  styleUrl: './permisos.css',
})
export class PermisosComponent {
  permisos: any [] = [];
  mostrarModal = false;
  esEdicion = false;

  permisoSeleccionado: any = {
    id_permiso: null,
    nombre: '',
    descripcion: ''
  }

  constructor (private permisosService: PermisosService){}

  ngOnInit(){
    this.cargarPermisos()
  }

  cargarPermisos(){
    this.permisosService.obtenerPermisos().subscribe({
      next: (data) => this.permisos = data,
      error: (err) => console.error('Error al obtener permisos', err)
    });
  }

  abrirModalCrear(permiso: any){
    this.esEdicion = true;
    this.permisoSeleccionado = {...permiso };
    this.mostrarModal = true;
  }

  cerrarModal(){
    this.mostrarModal = false;
  }

  guardarCambios(){
    //Validar nombre
    if(!this.permisoSeleccionado.nombre || this.permisoSeleccionado.nombre.trim()===''){
      alert('El nombre del permiso es obligatario')
      return;
    }

    if(this.esEdicion){
      this.permisosService.actualizarPermiso(this.permisoSeleccionado.id_permiso, this.permisoSeleccionado).subscribe({
        next: () => {
          alert('Permiso actualizado correctamente');
          this.cargarPermisos();
          this.cerrarModal();
        },
        error: (err)=> {
          console.error('Error al actualizar permiso', err);
          alert('Error al actualizar permiso: '+(err.error?.message) || 'Error desconocido')
        }
      })
    }else{
      this.permisosService.agregarPermiso(this.permisoSeleccionado).subscribe({
        next: () => {
          alert('Permiso creado correctamente');
          this.cargarPermisos();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al crear permiso', err);
          alert('Error al crear permiso: '+ (err.error?.message || 'Error desconocido'))
        }
      });
    }
  }

  eliminarPermiso(id:number){
    if(confirm('¿Seguro que deseas eliminar este permiso? Esto puede afecrar a roles que lo usen.')){
      this.permisosService.eliminarPermiso(id).subscribe({
        next: () => {
          alert('Permiso eliminado correctamente');
          this.cargarPermisos();
        },
        error:(err) => {
          console.error('Error al eliminar permiso', err);
          alert('Error al eliminar permiso: ' + (err.error?.message) || 'Este permiso está asignado a roles')
        }
      })
    }
  }











}
