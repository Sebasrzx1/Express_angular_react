import { Component } from '@angular/core';
import { CommonModle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NegocioService } from '../../services/negocio/negocio';

@Component({
  selector: 'app-negocio',
  standalone: true,
  imports: [CommonModle, FormsModule],
  templateUrl: './negocio.html',
  styleUrl: './negocio.css'
})
export class NegocioComponet{

}

