import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NegocioService } from '../../services/negocio/negocio';
import {FormsModule} from '@angular/forms'

@Component({
  selector: 'app-negocio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './negocio.html',
  styleUrl: './negocio.css'
})
export class NegocioComponent{
  negocio: any[] = [];
  mostrarModal = false;
  modoEdicion = false;
  subiendoImagen = false;
  previewUrl: string | null = null;

  negocioForm: any = {
    id_negocio: null,
    razon_social: '',
    logo_url: '',
    descripcion: '',
    telefono: '',
    email: '',
    redes_social: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    }
  };

  constructor(private negocioService: NegocioService){}

  ngOnInit(){
    this.cargarNegocios();
  }

  cargarNegocios(){
    this.negocioService.obtenerNegocios().subscribe({
      next: (data) => this.negocio = data,
      error: (err) => console.error ('Error al obtener negocios', err)
    });
  }

  abrirModalCrear(){
    this.modoEdicion = false;
    this.negocioForm = {
      id_negocio: null,
      razon_social: '',
      logo_url: '',
      descripcion: '',
      telefono: '',
      email: '',
      direccion: '',
      redes_sociales: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: ''
      }
    };
    this.previewUrl = null;
    this.mostrarModal = true;
  }

  abrirModalEditar(negocio: any){
    this.modoEdicion = true,
    this.negocioForm = {
      ...negocio,
      redes_social: negocio.redes_sociales || {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: ''
      }
    };
    
    this.previewUrl = negocio.logo_url ? `http://localhost:3000${negocio.logo_url}` : null;
    this.mostrarModal = true;
  }

  cerrarModal(){
    this.mostrarModal = false;
    this.previewUrl = null;
  }

  onFileSelected(event: any){
    const file = event.target.files[0];
    if(file){
      //validar tamaño (5mb)
      if(file.size > 5 * 1024 * 1024){
        alert('El archivo es demasiado grande. Maximo 5MB');
        return;
      }

      //validar tipo
      if(!file.type.startsWith('image/')){ alert 
        ('Solo se permiten archivos de imagen')
        return;
      }

      //Preview local
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      }
      reader.readAsDataURL(file);
      
      //Subir al servidor
      this.subiendoImagen= true;
      this.negocioService.subirImagen(file).subscribe({
        next:(data) => {
          this.negocioForm.logo_url = data.url;
          this.subiendoImagen = false;
          console.log('Imagen subida:', data.url);
        },
        error:(err)=>{
          console.error('Error al subir imagen', err);
          alert('Error al subir la imagen: '+ (err.error?.message || 'Error desconocido'))
          this.subiendoImagen = false;
          this.previewUrl = null;
        }
      });
    }
  }

  guardarNegocio(){
    //Validaciones 
    if(!this.negocioForm.razon_social || this.negocioForm.razon_social.trim() === ''){
      alert('La razon social es obligatoria');
      return;
    }

    if(this.modoEdicion){
      this.negocioService.actualizarNegocio(this.negocioForm.id_negocio, this.negocioForm).subscribe({
        next: () => {
          alert('Negocio actualizado correctamente');
          this.cargarNegocios()
          this.cerrarModal()
        },
        error:(err) => {
          console.error('Error al actualizar negocio', err);
          alert('Error al actualizar: '+ (err.error?.message || 'Error desconocido'))
        }
      })
    }else{
      this.negocioService.agregarNegocio(this.negocioForm).subscribe({
        next: () => {
          alert('Negocio creado correctamente');
          this.cargarNegocios();
          this.cerrarModal();
        },
        error: (err) =>{
          console.error('Erro al crear negocio', err);
          alert('Error al crear: '+ (err.error?.message) || 'Error desconocido')
        }
      })
    }
  }

  getLogoUrl(logoUrl: string): string {
    if(!logoUrl) return '';
    return logoUrl.startsWith('http') ? logoUrl : `http://localhost:3000${logoUrl}`
  }

}