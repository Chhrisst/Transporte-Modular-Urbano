import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { take } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;
  private readonly useMockData = environment.useMockData;
  private readonly _users = signal<User[]>([
    {
      id: 1,
      fullName: 'Mariana Torres',
      email: 'test@urbanride.com',
      password: 'test123',
      phone: '+51 999 123 456',
      role: 'pasajero',
      status: 'activo',
      registeredAt: '2025-01-08'
    },
    {
      id: 2,
      fullName: 'Luis Andrade',
      email: 'viajero@urbanride.com',
      password: 'ride2025',
      phone: '+51 988 222 333',
      role: 'pasajero',
      status: 'activo',
      registeredAt: '2025-01-11'
    },
    {
      id: 3,
      fullName: 'Andrea Córdova',
      email: 'operaciones@urbanride.com',
      password: 'operador360',
      phone: '+51 955 654 321',
      role: 'operador',
      status: 'activo',
      registeredAt: '2024-12-18'
    },
    {
      id: 4,
      fullName: 'Gabriel Ríos',
      email: 'admin@urbanride.com',
      password: 'adminUrbanRide',
      phone: '+51 944 555 222',
      role: 'administrador',
      status: 'activo',
      registeredAt: '2024-11-03'
    }
  ]);

  readonly users = this._users.asReadonly();
  readonly totalUsers = computed(() => this._users().length);
  readonly activeUsers = computed(() => this._users().filter((user) => user.status === 'activo').length);

  constructor(private readonly http: HttpClient) {
    if (!this.useMockData) {
      this.refreshFromApi();
    }
  }

  registerUser(user: Omit<User, 'id' | 'status' | 'registeredAt' | 'role'> & { role?: User['role'] }): User {
    const newUser: User = {
      id: this._users().length + 1,
      status: 'activo',
      registeredAt: new Date().toISOString().slice(0, 10),
      role: user.role ?? 'pasajero',
      ...user
    };

    this._users.update((users) => [...users, newUser]);

    if (!this.useMockData) {
      void this.http
        .post<User>(this.apiUrl, newUser)
        .pipe(take(1))
        .subscribe({
          next: (created) => this.mergeUser(created),
          error: (error) => console.error('No se pudo sincronizar el registro de usuario', error)
        });
    }

    return newUser;
  }

  updateStatus(id: number, status: User['status']): void {
    this._users.update((users) => users.map((user) => (user.id === id ? { ...user, status } : user)));

    if (!this.useMockData) {
      void this.http
        .patch<User>(`${this.apiUrl}/${id}`, { status })
        .pipe(take(1))
        .subscribe({
          next: (updated) => this.mergeUser(updated),
          error: (error) => console.error('No se pudo actualizar el estado del usuario', error)
        });
    }
  }

  promoteToOperator(id: number): void {
    this._users.update((users) =>
      users.map((user) => (user.id === id ? { ...user, role: 'operador', status: 'activo' } : user))
    );

    if (!this.useMockData) {
      void this.http
        .patch<User>(`${this.apiUrl}/${id}`, { role: 'operador', status: 'activo' })
        .pipe(take(1))
        .subscribe({
          next: (updated) => this.mergeUser(updated),
          error: (error) => console.error('No se pudo promover al usuario', error)
        });
    }
  }

  findByEmail(email: string): User | undefined {
    return this._users().find((user) => user.email.toLowerCase() === email.toLowerCase());
  }

  private refreshFromApi(): void {
    void this.http
      .get<User[]>(this.apiUrl)
      .pipe(take(1))
      .subscribe({
        next: (users) => this._users.set(users),
        error: (error) => console.error('No se pudo obtener la lista de usuarios', error)
      });
  }

  private mergeUser(updated: User): void {
    this._users.update((users) =>
      users.map((user) => (user.email === updated.email || user.id === updated.id ? { ...user, ...updated } : user))
    );
  }
}
