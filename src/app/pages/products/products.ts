import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class Products implements OnInit {

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: string[] = [];
  categoriaSeleccionada = 'Todos';

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los productos para reflejar cambios de stock
    this.productoService.productos$.subscribe(productosActualizados => {
      this.productos = productosActualizados;
      this.actualizarProductosFiltrados();
    });
    this.categorias = ['Todos', ...this.productoService.obtenerCategorias()];
    this.actualizarProductosFiltrados();
  }

  actualizarProductosFiltrados(): void {
    this.productosFiltrados = this.categoriaSeleccionada === 'Todos'
      ? [...this.productos]
      : this.productos.filter(producto => producto.categoria === this.categoriaSeleccionada);
  }

  agregarAlCarrito(producto: Producto): void {
    if (producto.stock > 0) {
      this.carritoService.agregarArticulo(producto);
      alert(`${producto.nombre} añadido al carrito!`);
    } else {
      alert('Producto agotado!');
    }
  }

  verDetalles(productoId: number): void {
    const producto = this.productoService.obtenerProductoPorId(productoId);
    if (producto) {
      alert(`Detalles de ${producto.nombre}:\n\n${producto.descripcion}\nPrecio: $${producto.precio}\nStock: ${producto.stock}`);
    }
  }
}
