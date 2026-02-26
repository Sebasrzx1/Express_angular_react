import { Component } from '@angular/core';
import {AuthService } from '../../services/auth/auth'
import {Router, RouterModule} from '@angular/router'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pagina.html',
  styleUrl: './pagina.css',
})
export class InicioComponent {
  usuario: any;

  constructor(private authService: AuthService, private router: Router){
    this.usuario = this.authService.obtenerUsuario()
  }
  
} 
