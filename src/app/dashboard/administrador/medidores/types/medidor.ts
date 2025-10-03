export interface Medidor {
  idMedidor: number
  idUsuario?: number
  idCategoria?: number
  nombre: string
  apellido: string
  categoria: string
  direccion: string
  fechaRegistro: string
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  ubicacion?: {
    latitud: number
    longitud: number
    descripcion?: string
  }
}

export interface FiltrosMedidor {
  busqueda: string
  estado: 'todos' | 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  fechaDesde?: Date
  fechaHasta?: Date
}

export interface MedidorFormData {
  idUsuario: number
  idCategoria: number
  direccion: string
  ubicacion: {
    latitud: number
    longitud: number
    descripcion?: string
  }
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO'
}