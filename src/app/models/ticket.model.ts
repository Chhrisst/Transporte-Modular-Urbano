export interface TicketPurchase {
  id: number;
  passengerName: string;
  passengerEmail: string;
  routeId: number;
  travelDate: string;
  departure: string;
  seats: number;
  modulesRequested: number;
  paymentStatus: 'pendiente' | 'confirmado' | 'cancelado';
}
