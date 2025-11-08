export interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: 'pasajero' | 'administrador' | 'operador';
  status: 'activo' | 'suspendido';
  registeredAt: string;
}
