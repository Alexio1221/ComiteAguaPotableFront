export enum EstadoPago {
  PENDIENTE = "PENDIENTE",
  PAGADO = "PAGADO",
  CANCELADO = "CANCELADO",
}

export interface Medidor {
  codigoMedidor: string;
  direccion: string;
}

export interface Lectura {
  medidor?: Medidor;
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

// Datos estáticos de ejemplo
export const comprobantes: Comprobante[] = [
  {
    idComprobante: 1,
    idLectura: 101,
    idOperador: 1,
    fechaEmision: new Date('2024-10-01'),
    montoBasico: 45.5,
    montoAdicional: 12,
    moraAcumulada: 5.25,
    totalPagar: 62.75,
    estadoPago: EstadoPago.PENDIENTE,
    fechaLimite: new Date('2024-10-25'),
    lectura: { medidor: { codigoMedidor: "MED-001-2024", direccion: "Av. Siempre Viva 123" } },
  },
  {
    idComprobante: 2,
    idLectura: 102,
    idOperador: 1,
    fechaEmision: new Date('2024-10-01'),
    montoBasico: 38,
    montoAdicional: 8.5,
    moraAcumulada: 0,
    totalPagar: 46.5,
    estadoPago: EstadoPago.PENDIENTE,
    fechaLimite: new Date('2024-10-22'),
    lectura: { medidor: { codigoMedidor: "MED-002-2024", direccion: "Calle Falsa 456" } },
  },
  {
    idComprobante: 3,
    idLectura: 103,
    idOperador: 1,
    fechaEmision: new Date('2024-10-01'),
    montoBasico: 52.75,
    montoAdicional: 15.25,
    moraAcumulada: 12.8,
    totalPagar: 80.8,
    estadoPago: EstadoPago.PENDIENTE,
    fechaLimite: new Date('2024-09-15'),
    lectura: { medidor: { codigoMedidor: "MED-003-2024", direccion: "Av. Las Palmas 789" } },
  },
  {
    idComprobante: 4,
    idLectura: 104,
    idOperador: 1,
    fechaEmision: new Date('2024-10-01'),
    montoBasico: 41.25,
    montoAdicional: 9.75,
    moraAcumulada: 0,
    totalPagar: 51,
    estadoPago: EstadoPago.PENDIENTE,
    fechaLimite: new Date('2024-11-05'),
    lectura: { medidor: { codigoMedidor: "MED-004-2024", direccion: "Jr. Los Pinos 321" } },
  },
];
