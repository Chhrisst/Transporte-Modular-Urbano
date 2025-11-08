import { Producto } from './producto.model';

export interface ArticuloCarrito {
    producto: Producto;
    cantidad: number;
}
