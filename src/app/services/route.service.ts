import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { take } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { RouteSchedule } from '../models/route.model';

@Injectable({ providedIn: 'root' })
export class RouteService {
  private readonly apiUrl = `${environment.apiUrl}/routes`;
  private readonly useMockData = environment.useMockData;
  private readonly _routes = signal<RouteSchedule[]>([
    {
      id: 1,
      name: 'Línea Verde',
      origin: 'Estación Central',
      destination: 'Parque EcoTec',
      estimatedDuration: '32 min',
      moduleType: 'modulo ligero',
      departures: ['06:30', '07:15', '08:00', '08:45', '09:30', '10:15'],
      stops: ['Estación Central', 'Av. Innovación', 'Campus UPN', 'Parque EcoTec'],
      occupancy: 68
    },
    {
      id: 2,
      name: 'Corredor Azul',
      origin: 'Terminal Norte',
      destination: 'Distrito Creativo',
      estimatedDuration: '48 min',
      moduleType: 'modulo articulado',
      departures: ['06:00', '07:00', '08:00', '09:00', '10:00'],
      stops: ['Terminal Norte', 'Puerta del Río', 'Campus Sur', 'Distrito Creativo'],
      occupancy: 54
    },
    {
      id: 3,
      name: 'Anillo Express',
      origin: 'Campus Oeste',
      destination: 'Campus Este',
      estimatedDuration: '25 min',
      moduleType: 'shuttle urbano',
      departures: ['06:15', '06:45', '07:15', '07:45', '08:15'],
      stops: ['Campus Oeste', 'Hub de Innovación', 'Campus Central', 'Campus Este'],
      occupancy: 61
    }
  ]);

  readonly routes = this._routes.asReadonly();
  readonly totalRoutes = computed(() => this._routes().length);

  constructor(private readonly http: HttpClient) {
    if (!this.useMockData) {
      this.refreshFromApi();
    }
  }

  addRoute(route: Omit<RouteSchedule, 'id' | 'occupancy'>): void {
    const newRoute: RouteSchedule = {
      ...route,
      id: this._routes().length + 1,
      occupancy: 0
    };

    this._routes.update((routes) => [...routes, newRoute]);

    if (!this.useMockData) {
      void this.http
        .post<RouteSchedule>(this.apiUrl, newRoute)
        .pipe(take(1))
        .subscribe({
          next: (created) => this.mergeRoute(created),
          error: (error) => console.error('No se pudo registrar la ruta', error)
        });
    }
  }

  updateOccupancy(routeId: number, occupancy: number): void {
    this._routes.update((routes) =>
      routes.map((route) => (route.id === routeId ? { ...route, occupancy } : route))
    );

    if (!this.useMockData) {
      void this.http
        .patch<RouteSchedule>(`${this.apiUrl}/${routeId}`, { occupancy })
        .pipe(take(1))
        .subscribe({
          next: (updated) => this.mergeRoute(updated),
          error: (error) => console.error('No se pudo actualizar la ocupación de la ruta', error)
        });
    }
  }

  private refreshFromApi(): void {
    void this.http
      .get<RouteSchedule[]>(this.apiUrl)
      .pipe(take(1))
      .subscribe({
        next: (routes) => this._routes.set(routes),
        error: (error) => console.error('No se pudo obtener las rutas desde la API', error)
      });
  }

  private mergeRoute(updated: RouteSchedule): void {
    this._routes.update((routes) =>
      routes.map((route) =>
        route.id === updated.id || route.name === updated.name ? { ...route, ...updated } : route
      )
    );
  }
}
