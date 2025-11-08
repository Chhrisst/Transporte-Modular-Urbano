import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-login.page.html',
  styleUrl: './admin-login.page.css'
})
export class AdminLoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected email = 'roberto.inche@example.com';
  protected password = 'movilidad2025';
  protected feedback = signal<string | null>(null);

  login(): void {
    const session = this.authService.loginAsAdmin(this.email, this.password);
    if (!session) {
      this.feedback.set('Credenciales inválidas o sin permisos administrativos.');
      return;
    }

    this.feedback.set(`Hola ${session.user.fullName}, redirigiendo al panel...`);
    void this.router.navigate(['/panel']);
  }
}
