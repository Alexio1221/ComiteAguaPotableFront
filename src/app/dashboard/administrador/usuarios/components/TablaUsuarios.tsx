"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Edit2, Eye, Shield, Phone } from "lucide-react"
import { Usuario } from "../types/usuario"

interface TablaUsuariosProps {
  usuarios: Usuario[]
  onEditarUsuario: (usuario: Usuario) => void
  onVerDetalles: (usuario: Usuario) => void
  loading: boolean
}

export default function TablaUsuarios({
  usuarios,
  onEditarUsuario,
  onVerDetalles,
  loading
}: TablaUsuariosProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header de la tabla */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b">
          <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
            <div className="col-span-3">Usuario</div>
            <div className="col-span-3">Teléfono</div>
            <div className="col-span-2">Roles</div>
            <div className="col-span-2">Estado</div>
            <div className="col-span-2">Acciones</div>
          </div>
        </div>

        {/* Contenido de la tabla */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="divide-y"
        >
          {usuarios.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="p-12 text-center text-gray-500"
            >
              <Shield className="mx-auto mb-4 w-12 h-12 text-gray-300" />
              <p className="text-lg font-medium">No hay usuarios registrados</p>
              <p className="text-sm">Comienza agregando el primer usuario</p>
            </motion.div>
          ) : (
            usuarios.map((usuario) => (
              <motion.div
                key={usuario.idUsuario}
                variants={itemVariants}
                whileHover={{
                  backgroundColor: "rgba(59, 130, 246, 0.03)",
                  transition: { duration: 0.2 }
                }}
                className="px-6 py-4 hover:shadow-sm transition-all duration-200"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Usuario */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {usuario.nombre} {usuario.apellido}
                        </p>
                        <p className="text-sm text-gray-500">@{usuario.usuario}</p>
                      </div>
                    </div>
                  </div>

                  {/* Información de Contacto */}
                  <div className="col-span-3">
                    <div className="space-y-1">
                      {usuario.telefono && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{usuario.telefono}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Roles */}
                  <div className="col-span-2">
                    <div className="flex flex-wrap gap-1">
                      {usuario.roles.slice(0, 2).map((rol) => (
                        <span
                          key={rol.idRol}
                          className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                        >
                          {rol.nombreRol}
                        </span>
                      ))}
                      {usuario.roles.length > 2 && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          +{usuario.roles.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="col-span-2">
                    {/** Buscamos el rol Socio */}
                    {(() => {
                      const rolSocio = usuario.roles.find((r) => r.idRol === 4);
                      const estaActivo = rolSocio ? rolSocio.estado : false;

                      return (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${estaActivo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-2 ${estaActivo ? "bg-green-400" : "bg-red-400"
                              }`}
                          />
                          {estaActivo ? "Activo" : "Inactivo"}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Acciones */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onVerDetalles(usuario)}
                        className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-6 h-6" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEditarUsuario(usuario)}
                        className="p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar usuario"
                      >
                        <Edit2 className="w-6 h-6" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
}