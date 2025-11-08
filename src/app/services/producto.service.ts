import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductoService {

  private productosDb: Producto[] = [
    // NOTA: Reemplaza 'assets/img/...' con las rutas correctas de tus imágenes.
    { id: 1, nombre: 'GPU RTX Serie 40', categoria: 'GPU', precio: 999, stock: 15, descripcion: 'Potencia gráfica extrema para 4K, Ray Tracing avanzado y DLSS 3.0.', imagenUrl: '../public/img/imagen2.png', destacado: true },
    { id: 2, nombre: 'Procesador I9 Extreme', categoria: 'CPU', precio: 599, stock: 8, descripcion: 'El núcleo del poder gamer. Multitarea sin esfuerzo y velocidades de reloj que rompen récords.', imagenUrl: 'assets/img/cpu.png', destacado: false },
    { id: 3, nombre: 'RAM DDR5 32GB Kit', categoria: 'RAM', precio: 199, stock: 25, descripcion: 'Velocidad de rayo para la carga de juegos. Baja latencia y disipadores de calor RGB.', imagenUrl: 'assets/img/ram.png', destacado: false },
    { id: 4, nombre: 'Teclado Mecánico RGB', categoria: 'Periféricos', precio: 120, stock: 30, descripcion: 'Switches táctiles rápidos, anti-ghosting y retroiluminación totalmente personalizable.', imagenUrl: 'assets/img/teclado.png', destacado: false },
    { id: 5, nombre: 'Monitor Curvo 144Hz', categoria: 'Periféricos', precio: 350, stock: 12, descripcion: 'Imágenes inmersivas y fluidez total con 144Hz y 1ms de respuesta. Zero-lag.', imagenUrl: 'assets/img/monitor.png', destacado: true },
    { id: 6, nombre: 'Fuente de Poder 850W', categoria: 'Otros', precio: 90, stock: 20, descripcion: 'Certificación 80+ Gold para máxima eficiencia y estabilidad en tu sistema.', imagenUrl: 'assets/img/psu.png', destacado: false },
  ];

  private productosSubject = new BehaviorSubject<Producto[]>(this.productosDb);
  productos$ = this.productosSubject.asObservable();

  obtenerProductos(): Producto[] { return this.productosDb; }

  obtenerCategorias(): string[] {
    const categorias = this.productosDb.map(p => p.categoria);
    return [...new Set(categorias)];
  }

  obtenerProductoPorId(id: number): Producto | undefined {
    return this.productosDb.find(p => p.id === id);
  }

  // Actualiza el stock en la simulación
  actualizarStock(id: number, cantidadVendida: number): boolean {
    const producto = this.obtenerProductoPorId(id);
    if (producto && producto.stock >= cantidadVendida) {
        producto.stock -= cantidadVendida;
        this.productosSubject.next(this.productosDb);
        return true;
    }
    return false;
  }
}
