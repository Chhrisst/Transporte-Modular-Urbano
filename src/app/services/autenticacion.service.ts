import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AutenticacionService {

  private usuariosDb: Usuario[] = this.cargarUsuariosDesdeLocalStorage();
  private usuarioActualSubject = new BehaviorSubject<Usuario | null>(this.cargarUsuarioActual());
  usuarioActual$ = this.usuarioActualSubject.asObservable();

  constructor() {
    // Usuario de prueba para facilitar el testeo
    if (this.usuariosDb.length === 0) {
        this.usuariosDb.push({ id: 1, nombre: 'Jugador', apellido: 'Pro', correo: 'test@powerup.com', clave: '123456', direccion: 'Calle Gamer 101' });
        this.guardarUsuariosEnLocalStorage();
    }
  }

  registrar(nuevoUsuario: Usuario): boolean {
    if (this.usuariosDb.find(u => u.correo === nuevoUsuario.correo)) { return false; }
    nuevoUsuario.id = this.usuariosDb.length > 0 ? Math.max(...this.usuariosDb.map(u => u.id)) + 1 : 1;
    this.usuariosDb.push(nuevoUsuario);
    this.guardarUsuariosEnLocalStorage();
    return true;
  }

  iniciarSesion(correo: string, clave: string): Usuario | null {
    const usuario = this.usuariosDb.find(u => u.correo === correo && u.clave === clave);
    if (usuario) {
      this.establecerUsuarioActual(usuario);
      return usuario;
    }
    return null;
  }

  cerrarSesion(): void { this.establecerUsuarioActual(null); }
  estaLogueado(): boolean { return !!this.usuarioActualSubject.value; }
  obtenerUsuarioLogueado(): Usuario | null { return this.usuarioActualSubject.value; }

  private cargarUsuariosDesdeLocalStorage(): Usuario[] {
    const data = localStorage.getItem('powerup_usuarios');
    return data ? JSON.parse(data) : [];
  }

  private guardarUsuariosEnLocalStorage(): void {
    localStorage.setItem('powerup_usuarios', JSON.stringify(this.usuariosDb));
  }

  private cargarUsuarioActual(): Usuario | null {
    const data = localStorage.getItem('powerup_sesion');
    return data ? JSON.parse(data) : null;
  }

  private establecerUsuarioActual(usuario: Usuario | null): void {
    this.usuarioActualSubject.next(usuario);
    if (usuario) {
      const usuarioSesion = { ...usuario };
      delete usuarioSesion.clave;
      localStorage.setItem('powerup_sesion', JSON.stringify(usuarioSesion));
    } else {
      localStorage.removeItem('powerup_sesion');
    }
  }
}
