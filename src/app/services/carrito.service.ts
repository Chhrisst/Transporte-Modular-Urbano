import { Injectable } from '@angular/core';
import { ArticuloCarrito } from '../models/articulo-carrito.model';
import { Producto } from '../models/producto.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CarritoService {

  private articulosCarritoSubject = new BehaviorSubject<ArticuloCarrito[]>(this.cargarCarritoDesdeLocalStorage());
  articulosCarrito$: Observable<ArticuloCarrito[]> = this.articulosCarritoSubject.asObservable();

  private cargarCarritoDesdeLocalStorage(): ArticuloCarrito[] {
    const data = localStorage.getItem('powerup_carrito');
    return data ? JSON.parse(data) : [];
  }

  private guardarCarritoEnLocalStorage(articulos: ArticuloCarrito[]): void {
    localStorage.setItem('powerup_carrito', JSON.stringify(articulos));
    this.articulosCarritoSubject.next(articulos);
  }

  agregarArticulo(producto: Producto, cantidad: number = 1): void {
    const carritoActual = this.articulosCarritoSubject.value;
    const articuloExistente = carritoActual.find(item => item.producto.id === producto.id);

    if (articuloExistente) {
      articuloExistente.cantidad += cantidad;
    } else {
      carritoActual.push({ producto, cantidad });
    }

    this.guardarCarritoEnLocalStorage(carritoActual);
  }

  eliminarArticulo(productoId: number): void {
    const carritoActual = this.articulosCarritoSubject.value.filter(item => item.producto.id !== productoId);
    this.guardarCarritoEnLocalStorage(carritoActual);
  }

  actualizarCantidad(productoId: number, nuevaCantidad: number): void {
    const carritoActual = this.articulosCarritoSubject.value;
    const articulo = carritoActual.find(item => item.producto.id === productoId);

    if (articulo) {
        if (nuevaCantidad > 0) {
            articulo.cantidad = nuevaCantidad;
        } else {
            this.eliminarArticulo(productoId);
            return;
        }
    }
    this.guardarCarritoEnLocalStorage(carritoActual);
  }

  obtenerTotal(): number {
    return this.articulosCarritoSubject.value.reduce(
      (total, item) => total + (item.producto.precio * item.cantidad), 0
    );
  }

  vaciarCarrito(): void {
    this.guardarCarritoEnLocalStorage([]);
  }
}
