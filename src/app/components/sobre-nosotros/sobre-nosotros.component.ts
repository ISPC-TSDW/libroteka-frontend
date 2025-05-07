// import { Component } from '@angular/core';
// import { RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-sobre-nosotros',
//   standalone: true,
//   imports: [RouterLink],
//   templateUrl: './sobre-nosotros.component.html',
//   styleUrl: './sobre-nosotros.component.css',
  
// })
// export class SobreNosotrosComponent {
//   /* equipo = [
//     { nombre: 'German Cano', foto: 'assets/images/Integrantes/german_cano.jpeg' },
//     { nombre: 'Romina Haag', foto: 'assets/images/Integrantes/romina_haag.jpeg' },
//     { nombre: 'Daiana Zabala', foto: 'assets/images/Integrantes/daiana_zabala.jpeg' },
//     { nombre: 'Giuliana Gesto', foto: 'assets/images/Integrantes/giuliana_gesto.jpeg' },
//     { nombre: 'Juan Suarez', foto: 'assets/images/Integrantes/jota_suarez.jpeg' },
//     { nombre: 'Augusto Dizanzo', foto: 'assets/images/Integrantes/augusto_dizanzo.jpeg' },
//     { nombre: 'Walter Salvatierra', foto: 'assets/images/Integrantes/facku_salvatierra.jpeg' }
//   ];
//    */
// };

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sobrenosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sobre-nosotros.component.html',
  styleUrls: ['./sobre-nosotros.component.css']
})
export class SobrenosotrosComponent {
  equipo = [
    { nombre: 'German Cano', foto: 'assets/images/Integrantes/german_cano.jpeg' },
    { nombre: 'Romina Haag', foto: 'assets/images/Integrantes/romina_haag.jpeg' },
    { nombre: 'Daiana Zabala', foto: 'assets/images/Integrantes/daiana_zabala.jpeg' },
    { nombre: 'Giuliana Gesto', foto: 'assets/images/Integrantes/giuliana_gesto.jpeg' },
    { nombre: 'Juan Suarez', foto: 'assets/images/Integrantes/jota_suarez.jpeg' },
    { nombre: 'Augusto Dizanzo', foto: 'assets/images/Integrantes/augusto_dizanzo.jpeg' },
    { nombre: 'Walter Salvatierra', foto: 'assets/images/Integrantes/facku_salvatierra.jpeg' }
  ];
}

