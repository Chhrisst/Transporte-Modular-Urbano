import { Injectable, computed, signal } from '@angular/core';
import { Vehicle } from '../models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class FleetService {
  private readonly _fleet = signal<Vehicle[]>([
    {
      id: 1,
      code: 'MU-101',
      type: 'modulo ligero',
      capacity: 40,
      modules: 2,
      status: 'operativo',
      autonomyKm: 180,
      assignedRouteId: 1
    },
    {
      id: 2,
      code: 'MU-205',
      type: 'modulo articulado',
      capacity: 72,
      modules: 3,
      status: 'operativo',
      autonomyKm: 160,
      assignedRouteId: 2
    },
    {
      id: 3,
      code: 'MU-312',
      type: 'shuttle urbano',
      capacity: 24,
      modules: 1,
      status: 'mantenimiento',
      autonomyKm: 140
    }
  ]);

  readonly fleet = this._fleet.asReadonly();
  readonly operationalVehicles = computed(() => this._fleet().filter((vehicle) => vehicle.status === 'operativo').length);

  updateVehicleStatus(id: number, status: Vehicle['status']): void {
    this._fleet.update((fleet) => fleet.map((vehicle) => (vehicle.id === id ? { ...vehicle, status } : vehicle)));
  }

  assignRoute(id: number, routeId: number): void {
    this._fleet.update((fleet) => fleet.map((vehicle) => (vehicle.id === id ? { ...vehicle, assignedRouteId: routeId } : vehicle)));
  }

  addVehicle(vehicle: Omit<Vehicle, 'id'>): void {
    this._fleet.update((fleet) => [...fleet, { ...vehicle, id: this._fleet().length + 1 }]);
  }
}
