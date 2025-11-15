import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from './user.service';

export interface SessionInfo {
  user: User;
  mode: 'administrador' | 'pasajero' | 'operador';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentSession = signal<SessionInfo | null>(null);
  readonly currentSession = this._currentSession.asReadonly();

  constructor(private readonly userService: UserService) {}

  login(email: string, password: string): SessionInfo | null {
    const user = this.userService.findByEmail(email);
    if (!user || user.password !== password || user.status !== 'activo') {
      return null;
    }

    const session: SessionInfo = { user, mode: user.role };
    this._currentSession.set(session);
    return session;
  }

  loginAsAdmin(email: string, password: string): SessionInfo | null {
    const session = this.login(email, password);
    if (!session || session.user.role !== 'administrador') {
      return null;
    }
    return session;
  }

  logout(): void {
    this._currentSession.set(null);
  }
}
