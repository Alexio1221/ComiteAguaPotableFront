"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X, Calendar, Users, Activity } from "lucide-react"
import { FiltrosUsuario, Rol } from "../types/usuario"

interface FiltrosUsuariosProps {
  filtros: FiltrosUsuario
  onFiltrosChange: (filtros: FiltrosUsuario) => void
  roles: Rol[]
  totalUsuarios: number
  usuariosActivos: number
}

export default function FiltrosUsuarios({
  filtros,
  onFiltrosChange,
  roles,
  totalUsuarios,
  usuariosActivos
}: FiltrosUsuariosProps) {

  const handleInputChange = (campo: keyof FiltrosUsuario, valor: any) => {
    onFiltrosChange({ ...filtros, [campo]: valor })
  }

  const limpiarFiltros = () => {
    onFiltrosChange({
      busqueda: '',
      rol: '',
      estado: 'todos',
    })
  }

  const hayFiltrosActivos = filtros.busqueda || filtros.rol || filtros.estado !== 'todos'

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mostrar total usuario */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Usuarios</p>
                  <p className="text-2xl font-bold">{totalUsuarios}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Usuarios Activos</p>
                  <p className="text-2xl font-bold">{usuariosActivos}</p>
                </div>
                <Activity className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Roles Disponibles</p>
                  <p className="text-2xl font-bold">{roles.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filtros principales */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Buscador */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, usuario o telefono..."
                  value={filtros.busqueda}
                  onChange={(e) => handleInputChange('busqueda', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Filtro por rol */}
            <div className="lg:w-48">
              <select
                value={filtros.rol}
                onChange={(e) => handleInputChange('rol', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Todos los roles</option>
                {roles.map((rol) => (
                  <option key={rol.idRol} value={rol.nombreRol}>
                    {rol.nombreRol}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por estado */}
            <div className="lg:w-40">
              <select
                value={filtros.estado}
                onChange={(e) => handleInputChange('estado', e.target.value as 'todos' | 'activo' | 'inactivo')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="todos">Todos</option>
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
              </select>
            </div>

            {/* Botón limpiar filtros */}
            {hayFiltrosActivos && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={limpiarFiltros}
                className="px-4 py-3 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Limpiar Filtros
              </motion.button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}