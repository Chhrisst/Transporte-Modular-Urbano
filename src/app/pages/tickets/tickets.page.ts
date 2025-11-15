import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouteService } from '../../services/route.service';
import { TicketService } from '../../services/ticket.service';
import { RouteSchedule } from '../../models/route.model';
import { TicketPurchase } from '../../models/ticket.model';

@Component({
  selector: 'app-tickets-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tickets.page.html',
  styleUrl: './tickets.page.css'
})
export class TicketsPage {
  private readonly routeService = inject(RouteService);
  private readonly ticketService = inject(TicketService);

  protected routes = this.routeService.routes;
  protected tickets = this.ticketService.tickets;

  protected selectedRouteId: number | null = null;
  protected passengerName = '';
  protected passengerEmail = '';
  protected travelDate = new Date().toISOString().slice(0, 10);
  protected departure = '';
  protected seats = 1;
  protected modulesRequested = 1;
  protected feedback = signal<string | null>(null);

  protected selectedRoute = computed<RouteSchedule | undefined>(() =>
    this.routes().find((route) => route.id === this.selectedRouteId)
  );

  protected availableDepartures = computed(() => this.selectedRoute()?.departures ?? []);

  purchase(): void {
    if (!this.selectedRouteId || !this.passengerName || !this.passengerEmail || !this.departure) {
      this.feedback.set('Completa todos los campos para confirmar la compra.');
      return;
    }

    const ticket: Omit<TicketPurchase, 'id' | 'paymentStatus'> = {
      passengerName: this.passengerName,
      passengerEmail: this.passengerEmail,
      routeId: this.selectedRouteId,
      travelDate: this.travelDate,
      departure: this.departure,
      seats: this.seats,
      modulesRequested: this.modulesRequested
    };

    this.ticketService.registerPurchase(ticket);
    this.feedback.set('Solicitud enviada. Recibirás la confirmación y QR en tu correo.');

    this.passengerName = '';
    this.passengerEmail = '';
    this.departure = '';
    this.seats = 1;
    this.modulesRequested = 1;
  }
}
