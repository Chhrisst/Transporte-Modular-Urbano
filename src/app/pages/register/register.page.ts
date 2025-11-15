import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.page.html',
  styleUrl: './register.page.css'
})
export class RegisterPage {
  private readonly userService = inject(UserService);

  protected fullName = '';
  protected email = '';
  protected phone = '';
  protected password = '';
  protected confirmation = '';
  protected successMessage = signal<string | null>(null);

  register(): void {
    if (!this.fullName || !this.email || !this.password || this.password !== this.confirmation) {
      this.successMessage.set('Verifica tus datos, la contraseña debe coincidir.');
      return;
    }

    this.userService.registerUser({
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      phone: this.phone
    });

    this.successMessage.set('Registro completado. Ahora puedes iniciar sesión y comprar boletos.');
    this.fullName = '';
    this.email = '';
    this.phone = '';
    this.password = '';
    this.confirmation = '';
  }
}
