import { Injectable, computed, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly _users = signal<User[]>([
    {
      id: 1,
      fullName: 'Laura Méndez',
      email: 'laura.mendez@example.com',
      password: 'segura123',
      phone: '+51 999 123 456',
      role: 'pasajero',
      status: 'activo',
      registeredAt: '2024-10-12'
    },
    {
      id: 2,
      fullName: 'Roberto Inche',
      email: 'roberto.inche@example.com',
      password: 'movilidad2025',
      phone: '+51 988 222 333',
      role: 'administrador',
      status: 'activo',
      registeredAt: '2024-11-03'
    },
    {
      id: 3,
      fullName: 'Sofía Paredes',
      email: 'sofia.paredes@example.com',
      password: 'electrico',
      phone: '+51 955 654 321',
      role: 'operador',
      status: 'activo',
      registeredAt: '2024-09-21'
    }
  ]);

  readonly users = this._users.asReadonly();
  readonly totalUsers = computed(() => this._users().length);
  readonly activeUsers = computed(() => this._users().filter((user) => user.status === 'activo').length);

  registerUser(user: Omit<User, 'id' | 'status' | 'registeredAt' | 'role'> & { role?: User['role'] }): User {
    const newUser: User = {
      id: this._users().length + 1,
      status: 'activo',
      registeredAt: new Date().toISOString().slice(0, 10),
      role: user.role ?? 'pasajero',
      ...user
    };

    this._users.update((users) => [...users, newUser]);
    return newUser;
  }

  updateStatus(id: number, status: User['status']): void {
    this._users.update((users) => users.map((user) => (user.id === id ? { ...user, status } : user)));
  }

  promoteToOperator(id: number): void {
    this._users.update((users) =>
      users.map((user) => (user.id === id ? { ...user, role: 'operador', status: 'activo' } : user))
    );
  }

  findByEmail(email: string): User | undefined {
    return this._users().find((user) => user.email.toLowerCase() === email.toLowerCase());
  }
}
