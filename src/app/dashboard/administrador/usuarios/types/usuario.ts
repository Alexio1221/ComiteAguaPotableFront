export interface Usuario {
  idUsuario: number
  usuario: string
  nombre: string
  apellidos: string
  telefono?: string
  ci: string
  fechaRegistro: string
  activo: boolean
  roles: Rol[]
}

export interface Rol {
  idRol: number
  nombreRol: string
  descripcion: string
  estado: boolean
}

export interface FiltrosUsuario {
  busqueda: string
  rol: string
  estado: 'todos' | 'activo' | 'inactivo'
  fechaDesde?: Date
  fechaHasta?: Date
}

export interface UsuarioFormData {
  usuario: string
  nombre: string
  apellidos: string
  telefono?: string
  contraseña: string
  ci: string
  rolesIds: number[]
  estadosRoles: { [idRol: number]: boolean }
}