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

