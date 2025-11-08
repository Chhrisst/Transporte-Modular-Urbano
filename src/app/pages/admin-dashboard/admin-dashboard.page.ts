import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FleetService } from '../../services/fleet.service';
import { RouteService } from '../../services/route.service';
import { TicketService } from '../../services/ticket.service';
import { UserService } from '../../services/user.service';
import { Vehicle } from '../../models/vehicle.model';
import { RouteSchedule } from '../../models/route.model';
import { TicketPurchase } from '../../models/ticket.model';

type TicketStatusFilter = 'todos' | TicketPurchase['paymentStatus'];

interface MetricCard {
  id: string;
  value: string;
  label: string;
}

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './admin-dashboard.page.html',
  styleUrl: './admin-dashboard.page.css'
})
export class AdminDashboardPage {
  private readonly userService = inject(UserService);
  private readonly fleetService = inject(FleetService);
  private readonly routeService = inject(RouteService);
  private readonly ticketService = inject(TicketService);

  protected users = this.userService.users;
  protected fleet = this.fleetService.fleet;
  protected routes = this.routeService.routes;
  protected tickets = this.ticketService.tickets;

  protected metrics = computed<MetricCard[]>(() => [
    {
      id: 'usuarios',
      value: `${this.userService.activeUsers()} / ${this.userService.totalUsers()}`,
      label: 'Usuarios activos'
    },
    {
      id: 'flota',
      value: `${this.fleetService.operationalVehicles()}`,
      label: 'Unidades operativas'
    },
    {
      id: 'rutas',
      value: `${this.routeService.totalRoutes()}`,
      label: 'Rutas disponibles'
    },
    {
      id: 'boletos-totales',
      value: `${this.ticketService.totalTickets()}`,
      label: 'Boletos totales hoy'
    },
    {
      id: 'boletos-confirmados',
      value: `${this.ticketService.confirmedTickets()}`,
      label: 'Boletos confirmados'
    },
    {
      id: 'boletos-pendientes',
      value: `${this.ticketService.pendingTickets()}`,
      label: 'Boletos pendientes'
    }
  ]);

  protected statusSummary = this.ticketService.statusBreakdown;
  protected ticketStatusFilter = signal<TicketStatusFilter>('todos');
  protected ticketSearch = signal('');

  protected newVehicle: Omit<Vehicle, 'id'> = {
    code: '',
    type: 'modulo ligero',
    capacity: 30,
    modules: 2,
    status: 'operativo',
    autonomyKm: 150
  };

  protected newRoute: Omit<RouteSchedule, 'id' | 'occupancy'> = {
    name: '',
    origin: '',
    destination: '',
    estimatedDuration: '30 min',
    moduleType: 'modulo ligero',
    departures: [],
    stops: []
  };

  protected departuresInput = '';
  protected stopsInput = '';
  protected creationFeedback = signal<string | null>(null);
  protected filteredTickets = computed(() => {
    const statusFilter = this.ticketStatusFilter();
    const search = this.ticketSearch().trim().toLowerCase();
    const routeMap = new Map(this.routes().map((route) => [route.id, route]));

    return this.tickets()
      .filter((ticket) => statusFilter === 'todos' || ticket.paymentStatus === statusFilter)
      .filter((ticket) => {
        if (!search) {
          return true;
        }

        const route = routeMap.get(ticket.routeId);
        return (
          ticket.passengerName.toLowerCase().includes(search) ||
          ticket.passengerEmail.toLowerCase().includes(search) ||
          route?.name.toLowerCase().includes(search)
        );
      });
  });

  get ticketStatusFilterModel(): TicketStatusFilter {
    return this.ticketStatusFilter();
  }

  set ticketStatusFilterModel(value: TicketStatusFilter) {
    this.ticketStatusFilter.set(value);
  }

  get ticketSearchModel(): string {
    return this.ticketSearch();
  }

  set ticketSearchModel(value: string) {
    this.ticketSearch.set(value);
  }

  updateUserStatus(id: number, status: 'activo' | 'suspendido'): void {
    this.userService.updateStatus(id, status);
  }

  promoteUser(id: number): void {
    this.userService.promoteToOperator(id);
  }

  updateVehicleStatus(id: number, status: Vehicle['status']): void {
    this.fleetService.updateVehicleStatus(id, status);
  }

  updateTicketStatus(id: number, status: TicketPurchase['paymentStatus']): void {
    this.ticketService.updateStatus(id, status);
  }

  registerVehicle(): void {
    if (!this.newVehicle.code.trim()) {
      this.creationFeedback.set('Agrega el código de la unidad para registrarla.');
      return;
    }

    this.fleetService.addVehicle(this.newVehicle);
    this.creationFeedback.set('Unidad agregada a la flota.');
    this.newVehicle = {
      code: '',
      type: 'modulo ligero',
      capacity: 30,
      modules: 2,
      status: 'operativo',
      autonomyKm: 150
    };
  }

  registerRoute(): void {
    if (!this.newRoute.name.trim() || !this.newRoute.origin.trim() || !this.newRoute.destination.trim()) {
      this.creationFeedback.set('Completa los datos básicos de la ruta.');
      return;
    }

    const departures = this.departuresInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const stops = this.stopsInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    this.routeService.addRoute({ ...this.newRoute, departures, stops });
    this.creationFeedback.set('Ruta creada correctamente.');
    this.newRoute = {
      name: '',
      origin: '',
      destination: '',
      estimatedDuration: '30 min',
      moduleType: 'modulo ligero',
      departures: [],
      stops: []
    };
    this.departuresInput = '';
    this.stopsInput = '';
  }

  protected resolveRouteName(routeId: number): string {
    return this.routes().find((route) => route.id === routeId)?.name ?? `Ruta ${routeId}`;
  }

  protected resolveRouteDetails(routeId: number): string {
    const route = this.routes().find((item) => item.id === routeId);
    if (!route) {
      return 'Sin datos de ruta asignada';
    }

    return `${route.origin} → ${route.destination} · ${route.moduleType}`;
  }
}
