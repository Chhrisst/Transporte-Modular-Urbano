import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { take } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { TicketPurchase } from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly apiUrl = `${environment.apiUrl}/tickets`;
  private readonly useMockData = environment.useMockData;
  private readonly _tickets = signal<TicketPurchase[]>([
    {
      id: 1,
      passengerName: 'Mariana Torres',
      passengerEmail: 'test@urbanride.com',
      routeId: 1,
      travelDate: new Date().toISOString().slice(0, 10),
      departure: '08:00',
      seats: 1,
      modulesRequested: 1,
      paymentStatus: 'confirmado'
    },
    {
      id: 2,
      passengerName: 'Luis Andrade',
      passengerEmail: 'viajero@urbanride.com',
      routeId: 2,
      travelDate: new Date().toISOString().slice(0, 10),
      departure: '09:00',
      seats: 2,
      modulesRequested: 1,
      paymentStatus: 'pendiente'
    },
    {
      id: 3,
      passengerName: 'Andrea Córdova',
      passengerEmail: 'operaciones@urbanride.com',
      routeId: 3,
      travelDate: new Date().toISOString().slice(0, 10),
      departure: '07:15',
      seats: 1,
      modulesRequested: 1,
      paymentStatus: 'cancelado'
    }
  ]);

  readonly tickets = this._tickets.asReadonly();
  readonly confirmedTickets = computed(() =>
    this._tickets().filter((ticket) => ticket.paymentStatus === 'confirmado').length
  );
  readonly pendingTickets = computed(() =>
    this._tickets().filter((ticket) => ticket.paymentStatus === 'pendiente').length
  );
  readonly totalTickets = computed(() => this._tickets().length);
  readonly statusBreakdown = computed(() => {
    const initial: Record<TicketPurchase['paymentStatus'], number> = {
      pendiente: 0,
      confirmado: 0,
      cancelado: 0
    };

    return this._tickets().reduce((acc, ticket) => {
      acc[ticket.paymentStatus] += 1;
      return acc;
    }, { ...initial });
  });

  constructor(private readonly http: HttpClient) {
    if (!this.useMockData) {
      this.refreshFromApi();
    }
  }

  registerPurchase(ticket: Omit<TicketPurchase, 'id' | 'paymentStatus'> & { paymentStatus?: TicketPurchase['paymentStatus'] }): void {
    const newTicket: TicketPurchase = {
      ...ticket,
      id: this._tickets().length + 1,
      paymentStatus: ticket.paymentStatus ?? 'pendiente'
    };

    this._tickets.update((tickets) => [...tickets, newTicket]);

    if (!this.useMockData) {
      void this.http
        .post<TicketPurchase>(this.apiUrl, newTicket)
        .pipe(take(1))
        .subscribe({
          next: (created) => this.mergeTicket(created),
          error: (error) => console.error('No se pudo registrar la compra de boleto', error)
        });
    }
  }

  updateStatus(id: number, status: TicketPurchase['paymentStatus']): void {
    this._tickets.update((tickets) =>
      tickets.map((ticket) => (ticket.id === id ? { ...ticket, paymentStatus: status } : ticket))
    );

    if (!this.useMockData) {
      void this.http
        .patch<TicketPurchase>(`${this.apiUrl}/${id}`, { paymentStatus: status })
        .pipe(take(1))
        .subscribe({
          next: (updated) => this.mergeTicket(updated),
          error: (error) => console.error('No se pudo actualizar el estado del boleto', error)
        });
    }
  }

  private refreshFromApi(): void {
    void this.http
      .get<TicketPurchase[]>(this.apiUrl)
      .pipe(take(1))
      .subscribe({
        next: (tickets) => this._tickets.set(tickets),
        error: (error) => console.error('No se pudieron obtener los boletos desde la API', error)
      });
  }

  private mergeTicket(updated: TicketPurchase): void {
    this._tickets.update((tickets) =>
      tickets.map((ticket) =>
        ticket.id === updated.id || ticket.passengerEmail === updated.passengerEmail ? { ...ticket, ...updated } : ticket
      )
    );
  }
}
