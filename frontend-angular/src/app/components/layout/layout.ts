import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {RouterModule, Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth'; 
import {NegocioService} from '../../services/negocio/negocio';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout implements OnInit {
  usuario: any = null;
  logoNegocio: string | null = null;


  constructor(
    private auth: AuthService,
    private router: Router,
    private negocioService: NegocioService

  ){}

  ngOnInit(): void {
    //Cargar el usuario al iniciar el componente
    this.usuario = this.auth.obtenerUsuario();
    console.log('Usuario cargado: ', this.usuario)

    //Cargar el logo del negocio
    this.cargarLogoNegocio();
  }

 cargarLogoNegocio(): void {
  this.negocioService.obtenerNegocios().subscribe({
    next: (negocios) => {
      if (negocios && negocios.length > 0) {
        const negocio = negocios[0];
        if (negocio.logo_url) {
          this.logoNegocio = `http://localhost:3000${negocio.logo_url}`;
        }
      }
    },
    error: (err) => {
      console.error('Error al cargar logo del negocio:', err);
    }
  });
}

cerrarSesion(): void {
  this.auth.cerrarSesion();
  this.router.navigate(['/login']);
}












}
