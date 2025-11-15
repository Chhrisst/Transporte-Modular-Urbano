import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected session = this.authService.currentSession;

  cerrarSesion(): void {
    this.authService.logout();
    void this.router.navigate(['/']);
  }
}
