import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css'
})
export class LoginPage {
  private readonly authService = inject(AuthService);

  protected email = '';
  protected password = '';
  protected feedback = signal<string | null>(null);
  protected session = this.authService.currentSession;
  protected readonly demoAccounts = [
    {
      label: 'Usuario demo',
      email: 'test@urbanride.com',
      password: 'test123'
    },
    {
      label: 'Pasajero urbano',
      email: 'viajero@urbanride.com',
      password: 'ride2025'
    }
  ];

  login(): void {
    const session = this.authService.login(this.email, this.password);
    if (!session) {
      this.feedback.set('No pudimos validar tus credenciales o tu cuenta está inactiva.');
      return;
    }

    this.feedback.set(`Bienvenido/a ${session.user.fullName}. Gestiona tus viajes o compra boletos.`);
    this.email = '';
    this.password = '';
  }

  logout(): void {
    this.authService.logout();
    this.feedback.set('Sesión finalizada correctamente.');
  }
}
