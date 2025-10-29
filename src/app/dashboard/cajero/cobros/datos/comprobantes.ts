export enum EstadoPago {
  PENDIENTE = "PENDIENTE",
  PAGADO = "PAGADO",
  CANCELADO = "CANCELADO",
}

export interface UbicacionSocio {
  direccion: string;
}

export interface Medidor {
  idMedidor: number;
  ubicacionSocio: UbicacionSocio;
}

export interface Lectura {
  medidor: Medidor;
}

export interface Comprobante {
  idComprobante: number;
  idLectura: number;
  idOperador: number;
  fechaEmision: Date;
  montoBasico: number;
  montoAdicional: number;
  moraAcumulada: number;
  totalPagar: number;
  estadoPago: EstadoPago;
  fechaLimite: Date;
  fechaPago?: Date;
  lectura?: Lectura;
}

export interface Socio {
  idUsuario: number;
  nombre: string;
  apellidos: string
}

export const colorPalettes = [
  { from: 'from-blue-500', to: 'to-blue-700' },
  { from: 'from-sky-500', to: 'to-cyan-600' },
  { from: 'from-cyan-500', to: 'to-teal-700' },
  { from: 'from-blue-400', to: 'to-sky-700' },
  { from: 'from-indigo-500', to: 'to-blue-800' },
  { from: 'from-sky-400', to: 'to-cyan-700' },
];


