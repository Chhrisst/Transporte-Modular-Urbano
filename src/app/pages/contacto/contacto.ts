import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ArticuloCarrito } from '../../models/articulo-carrito.model';
import { Usuario } from '../../models/usuario.model';
import { AutenticacionService } from '../../services/autenticacion.service';
import { CarritoService } from '../../services/carrito.service';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css',
})
export class Contacto implements OnInit {

  datosPago = {
    nombreTarjeta: '',
    numeroTarjeta: '',
    fechaVencimiento: '',
    cvv: ''
  };

  totalCompra = 0;
  mensaje: string | null = null;
  esError = false;
  usuarioLogueado: Usuario | null = null;
  articulosCarrito: ArticuloCarrito[] = [];

  constructor(
    private router: Router,
    private authService: AutenticacionService,
    private carritoService: CarritoService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    if (this.carritoService.obtenerTotal() === 0) {
      alert('Tu carrito est\u00E1 vac\u00EDo. Redirigiendo al cat\u00E1logo.');
      this.router.navigate(['/productos']);
      return;
    }

    if (!this.authService.estaLogueado()) {
      alert('Debes iniciar sesi\u00F3n para completar la compra. Redirigiendo...');
      this.router.navigate(['/login']);
      return;
    }

    this.totalCompra = this.carritoService.obtenerTotal();
    this.usuarioLogueado = this.authService.obtenerUsuarioLogueado();
    this.carritoService.articulosCarrito$.subscribe(articulos => {
      this.articulosCarrito = articulos;
    });
  }

  procesarPago(): void {
    this.mensaje = null;
    this.esError = false;

    // 1. Validaciones b\u00E1sicas (Simulaci\u00F3n)
    if (!/^\d{16}$/.test(this.datosPago.numeroTarjeta) || !/^\d{3,4}$/.test(this.datosPago.cvv)) {
      this.mensaje = 'Datos de tarjeta inv\u00E1lidos.';
      this.esError = true;
      return;
    }

    // 2. Simulaci\u00F3n de procesamiento de pago
    this.mensaje = 'Procesando pago... \u00A1Y listo!';
    this.esError = false;

    setTimeout(() => {
      let stockActualizadoExitoso = true;

      // 3. Actualizaci\u00F3n de Stock (Simulaci\u00F3n de Orden de Compra)
      for (const item of this.articulosCarrito) {
        if (!this.productoService.actualizarStock(item.producto.id, item.cantidad)) {
          stockActualizadoExitoso = false;
          this.mensaje = `Error de stock al comprar ${item.producto.nombre}.`;
          this.esError = true;
          break;
        }
      }

      if (stockActualizadoExitoso) {
        this.carritoService.vaciarCarrito();
        this.mensaje = '\u00A1Pago aprobado y orden creada! Gracias por tu compra.';
        this.esError = false;

        setTimeout(() => {
          this.router.navigate(['/productos']);
        }, 3000);
      }

    }, 2000);
  }
}
