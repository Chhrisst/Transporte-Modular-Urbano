import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { RegisterPage } from './pages/register/register.page';
import { LoginPage } from './pages/login/login.page';
import { TicketsPage } from './pages/tickets/tickets.page';
import { AdminLoginPage } from './pages/admin-login/admin-login.page';
import { AdminDashboardPage } from './pages/admin-dashboard/admin-dashboard.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'inicio', redirectTo: '', pathMatch: 'full' },
  { path: 'registro', component: RegisterPage },
  { path: 'ingreso', component: LoginPage },
  { path: 'boletos', component: TicketsPage },
  { path: 'admin/acceso', component: AdminLoginPage },
  { path: 'panel', component: AdminDashboardPage },
  { path: '**', redirectTo: '' }
];
