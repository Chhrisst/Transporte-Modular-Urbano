import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { Nosotros } from './pages/nosotros/nosotros';
import { Products } from './pages/products/products';
import { Contacto } from './pages/contacto/contacto';
import { Login } from './pages/login/login.component';
import { Carrito } from './pages/carrito/carrito.component';

export const routes: Routes = [
  { path:'', component: About },
  { path:'inicio', redirectTo:'', pathMatch:'full' },
  { path:'nosotros', component: Nosotros },
  { path:'productos', component: Products },
  { path:'carrito', component: Carrito },
  { path:'contacto', component: Contacto },
  { path:'login', component: Login },
  { path:'**', redirectTo:'' }
];
