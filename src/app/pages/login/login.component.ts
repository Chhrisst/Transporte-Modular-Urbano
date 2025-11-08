import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class Login {

  credenciales = {
    correo: '',
    clave: ''
  };

  mensaje: string | null = null;
  esError = false;
  cargando = false;

  constructor(
    private authService: AutenticacionService,
    private router: Router
  ) {}

  iniciarSesion(form: NgForm): void {
    if (form.invalid || this.cargando) {
      return;
    }

    this.mensaje = null;
    this.esError = false;
    this.cargando = true;

    const usuario = this.authService.iniciarSesion(this.credenciales.correo.trim(), this.credenciales.clave);

    if (!usuario) {
      this.esError = true;
      this.mensaje = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
      this.cargando = false;
      return;
    }

    this.mensaje = `Bienvenido, ${usuario.nombre}. Redirigiendo...`;
    this.esError = false;
    form.resetForm();

    setTimeout(() => {
      this.cargando = false;
      this.router.navigate(['/productos']);
    }, 800);
  }
}
