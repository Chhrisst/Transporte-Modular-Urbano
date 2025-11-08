export interface Vehicle {
  id: number;
  code: string;
  type: 'modulo ligero' | 'modulo articulado' | 'shuttle urbano';
  capacity: number;
  modules: number;
  status: 'operativo' | 'mantenimiento' | 'reserva';
  autonomyKm: number;
  assignedRouteId?: number;
}
