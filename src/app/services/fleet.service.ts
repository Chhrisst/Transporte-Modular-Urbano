import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { take } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Vehicle } from '../models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class FleetService {
  private readonly apiUrl = `${environment.apiUrl}/fleet`;
  private readonly useMockData = environment.useMockData;
  private readonly _fleet = signal<Vehicle[]>([
    {
      id: 1,
      code: 'UR-101',
      type: 'modulo ligero',
      capacity: 40,
      modules: 2,
      status: 'operativo',
      autonomyKm: 180,
      assignedRouteId: 1
    },
    {
      id: 2,
      code: 'UR-205',
      type: 'modulo articulado',
      capacity: 72,
      modules: 3,
      status: 'operativo',
      autonomyKm: 165,
      assignedRouteId: 2
    },
    {
      id: 3,
      code: 'UR-312',
      type: 'shuttle urbano',
      capacity: 24,
      modules: 1,
      status: 'mantenimiento',
      autonomyKm: 142
    }
  ]);

  readonly fleet = this._fleet.asReadonly();
  readonly operationalVehicles = computed(() => this._fleet().filter((vehicle) => vehicle.status === 'operativo').length);

  constructor(private readonly http: HttpClient) {
    if (!this.useMockData) {
      this.refreshFromApi();
    }
  }

  updateVehicleStatus(id: number, status: Vehicle['status']): void {
    this._fleet.update((fleet) => fleet.map((vehicle) => (vehicle.id === id ? { ...vehicle, status } : vehicle)));

    if (!this.useMockData) {
      void this.http
        .patch<Vehicle>(`${this.apiUrl}/${id}`, { status })
        .pipe(take(1))
        .subscribe({
          next: (updated) => this.mergeVehicle(updated),
          error: (error) => console.error('No se pudo actualizar el estado del vehículo', error)
        });
    }
  }

  assignRoute(id: number, routeId: number): void {
    this._fleet.update((fleet) =>
      fleet.map((vehicle) => (vehicle.id === id ? { ...vehicle, assignedRouteId: routeId } : vehicle))
    );

    if (!this.useMockData) {
      void this.http
        .patch<Vehicle>(`${this.apiUrl}/${id}`, { assignedRouteId: routeId })
        .pipe(take(1))
        .subscribe({
          next: (updated) => this.mergeVehicle(updated),
          error: (error) => console.error('No se pudo asignar la ruta al vehículo', error)
        });
    }
  }

  addVehicle(vehicle: Omit<Vehicle, 'id'>): void {
    const newVehicle: Vehicle = { ...vehicle, id: this._fleet().length + 1 };
    this._fleet.update((fleet) => [...fleet, newVehicle]);

    if (!this.useMockData) {
      void this.http
        .post<Vehicle>(this.apiUrl, newVehicle)
        .pipe(take(1))
        .subscribe({
          next: (created) => this.mergeVehicle(created),
          error: (error) => console.error('No se pudo registrar el vehículo', error)
        });
    }
  }

  private refreshFromApi(): void {
    void this.http
      .get<Vehicle[]>(this.apiUrl)
      .pipe(take(1))
      .subscribe({
        next: (fleet) => this._fleet.set(fleet),
        error: (error) => console.error('No se pudo obtener la flota desde la API', error)
      });
  }

  private mergeVehicle(updated: Vehicle): void {
    this._fleet.update((fleet) =>
      fleet.map((vehicle) =>
        vehicle.id === updated.id || vehicle.code === updated.code ? { ...vehicle, ...updated } : vehicle
      )
    );
  }
}
