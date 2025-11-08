export interface Producto {
    id: number;
    nombre: string;
    categoria: 'GPU' | 'CPU' | 'RAM' | 'Periféricos' | 'Otros';
    precio: number;
    stock: number;
    descripcion: string;
    imagenUrl: string; // Ejemplo: 'assets/img/gpu.png'
    destacado: boolean;
}
