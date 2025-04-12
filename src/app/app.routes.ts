import { Routes } from '@angular/router';
import { BusquedaPersonalizadaComponent } from './components/busqueda-personalizada/busqueda-personalizada.component';
import { SocialnetComponent } from './components/shared/socialnet/socialnet.component';
import { CreateComponent } from './components/create/create.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { LandingComponent } from './components/landing/landing.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { SobreNosotrosComponent } from './components/sobre-nosotros/sobre-nosotros.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MasVendidosComponent } from './components/mas-vendidos/mas-vendidos.component';
import { authGuard } from './guards/auth-guard';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { PaymentGatewayComponent } from './components/payment-gateway/payment-gateway.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'busqueda-personalizada', component: BusquedaPersonalizadaComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'socialnet', component: SocialnetComponent },
  { path: 'sobre-nosotros', component: SobreNosotrosComponent },
  { path: 'create', component: CreateComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: 'mas-vendidos', component: MasVendidosComponent },
  { path: 'book/:bookId', component: BookDetailsComponent },
  {
    path: 'pagos',
    component: PaymentGatewayComponent,
    canActivate: [authGuard],
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: '**', redirectTo: '/not-found', pathMatch: 'full' },
];
