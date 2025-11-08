import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ArticuloCarrito } from '../../models/articulo-carrito.model';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class Carrito implements OnInit {

  articulos$: Observable<ArticuloCarrito[]>;
  total = 0;

  constructor(private carritoService: CarritoService, private router: Router) {
    this.articulos$ = this.carritoService.articulosCarrito$;
  }

  ngOnInit(): void {
    this.articulos$.subscribe(() => {
      this.total = this.carritoService.obtenerTotal();
    });
  }

  eliminarArticulo(id: number): void {
    this.carritoService.eliminarArticulo(id);
  }

  actualizarCantidad(id: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const nuevaCantidad = parseInt(input.value, 10);
    this.carritoService.actualizarCantidad(id, nuevaCantidad);
  }

  procederAlPago(): void {
    if (this.total > 0) {
      this.router.navigate(['/contacto']);
    } else {
      alert('El carrito est\u00E1 vac\u00EDo.');
    }
  }
}
