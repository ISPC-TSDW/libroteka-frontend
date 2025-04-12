import { Component } from '@angular/core';
import { RouterModule, RouterOutlet} from '@angular/router';
import { SocialnetComponent } from './components/shared/socialnet/socialnet.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { SobreNosotrosComponent } from './components/sobre-nosotros/sobre-nosotros.component';
import { LoginComponent } from './components/login/login.component';
import { BusquedaPersonalizadaComponent } from './components/busqueda-personalizada/busqueda-personalizada.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    SocialnetComponent, 
    NavbarComponent, 
    FooterComponent, 
    HeaderComponent, 
    ContactoComponent, 
    SobreNosotrosComponent,
    LoginComponent,
    BusquedaPersonalizadaComponent,
    BookDetailsComponent,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Libroteka';
}
