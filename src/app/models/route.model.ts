export interface RouteSchedule {
  id: number;
  name: string;
  origin: string;
  destination: string;
  estimatedDuration: string;
  moduleType: 'modulo ligero' | 'modulo articulado' | 'shuttle urbano';
  departures: string[];
  stops: string[];
  occupancy: number;
}
