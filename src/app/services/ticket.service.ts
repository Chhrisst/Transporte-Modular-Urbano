import { Injectable, computed, signal } from '@angular/core';
import { TicketPurchase } from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly _tickets = signal<TicketPurchase[]>([
    {
      id: 1,
      passengerName: 'Laura Méndez',
      passengerEmail: 'laura.mendez@example.com',
      routeId: 1,
      travelDate: new Date().toISOString().slice(0, 10),
      departure: '08:00',
      seats: 1,
      modulesRequested: 1,
      paymentStatus: 'confirmado'
    },
    {
      id: 2,
      passengerName: 'Sofía Paredes',
      passengerEmail: 'sofia.paredes@example.com',
      routeId: 2,
      travelDate: new Date().toISOString().slice(0, 10),
      departure: '09:00',
      seats: 2,
      modulesRequested: 1,
      paymentStatus: 'pendiente'
    },
    {
      id: 3,
      passengerName: 'Diego Quintana',
      passengerEmail: 'diego.quintana@example.com',
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

  registerPurchase(ticket: Omit<TicketPurchase, 'id' | 'paymentStatus'> & { paymentStatus?: TicketPurchase['paymentStatus'] }): void {
    this._tickets.update((tickets) => [
      ...tickets,
      {
        ...ticket,
        id: this._tickets().length + 1,
        paymentStatus: ticket.paymentStatus ?? 'pendiente'
      }
    ]);
  }

  updateStatus(id: number, status: TicketPurchase['paymentStatus']): void {
    this._tickets.update((tickets) =>
      tickets.map((ticket) => (ticket.id === id ? { ...ticket, paymentStatus: status } : ticket))
    );
  }
}
