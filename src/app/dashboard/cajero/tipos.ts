//Tipos para cobros
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
  { from: 'from-green-400', to: 'to-emerald-700' },
  { from: 'from-emerald-400', to: 'to-teal-700' },
  { from: 'from-purple-500', to: 'to-indigo-800' },
];


// Tipo para el historial
export interface ComprobanteHistorial {
  idComprobante: number;
  fechaEmision: string;
  montoBasico: string;
  montoAdicional: string;
  moraAcumulada: string;
  totalPagar: string;
  estadoPago: string;
  fechaLimite: string;
  lectura: {
    idLectura: number;
    lecturaActual: string;
    lecturaAnterior: string;
    consumo: string;
    fechaLectura: string;
    observaciones?: string | null;
    medidor: {
      idMedidor: number;
      socio: {
        idUsuario: number;
        nombre: string;
        apellidos: string;
      }
    }
  }
}

export interface PagoHistorial {
  idPago: number;
  montoPagado: string;
  fechaPago: string;
  comprobanteArchivo?: string | null;
  cajero: {
    idUsuario: number;
    nombre: string;
    apellidos: string;
  };
  comprobantes: ComprobanteHistorial[];
}
