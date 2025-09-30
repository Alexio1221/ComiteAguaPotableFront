"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Edit2, Eye, Shield, Phone } from "lucide-react"
import { Medidor } from "../types/medidor"

interface TablaMedidoresProps {
  medidores: Medidor[]
  onEditarMedidor: (medidor: Medidor) => void
  onVerDetalles: (medidor: Medidor) => void
  loading: boolean
}

export default function TablaMedidor({
  medidores,
  onEditarMedidor,
  onVerDetalles,
  loading
}: TablaMedidoresProps) {
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
            <div className="col-span-1">Código Medidor</div>
            <div className="col-span-2">Nombre</div>
            <div className="col-span-2">Categoria</div>
            <div className="col-span-2">Direccion</div>
            <div className="col-span-2">Fecha De Registro</div>
            <div className="col-span-1">Estado</div>
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
          {medidores.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="p-12 text-center text-gray-500"
            >
              <Shield className="mx-auto mb-4 w-12 h-12 text-gray-300" />
              <p className="text-lg font-medium">No hay medidores registrados</p>
              <p className="text-sm">Comienza agregando el primer medidor</p>
            </motion.div>
          ) : (
            medidores.map((medidor) => (
              <motion.div
                key={medidor.idMedidor}
                variants={itemVariants}
                whileHover={{
                  backgroundColor: "rgba(59, 130, 246, 0.03)",
                  transition: { duration: 0.2 }
                }}
                className="px-6 py-4 hover:shadow-sm transition-all duration-200"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Numero de medidor */}
                  <div className="col-span-1">
                    <p className="font-semibold text-gray-900">
                      {medidor.idMedidor}
                    </p>
                  </div>

                  {/* Nombre Completo de Socio */}
                  <div className="col-span-2">
                    <p className="font-semibold text-gray-900">
                      {medidor.nombre} {medidor.apellido}
                    </p>
                  </div>

                  {/* Categoria */}
                  <div className="col-span-2">
                    <p className="font-semibold text-gray-900">
                      {medidor.categoria}
                    </p>
                  </div>

                  {/* Direccion */}
                  <div className="col-span-2">
                    <p className="font-semibold text-gray-900">
                      {medidor.direccion}
                    </p>
                  </div>

                  {/* Fecha Registro */}
                  <div className="col-span-2">
                    <p className="font-semibold text-gray-900">
                      {medidor.fechaRegistro}
                    </p>
                  </div>

                  {/* Estado */}
                  <div className="col-span-1">
                    {(() => {
                      // Definimos estilos por cada estado
                      const estados = {
                        ACTIVO: { bg: "bg-green-100 text-green-800", dot: "bg-green-400", label: "Activo",
                        },
                        INACTIVO: { bg: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-400", label: "Inactivo",
                        },
                        SUSPENDIDO: { bg: "bg-red-100 text-red-800", dot: "bg-red-400", label: "Suspendido",
                        },
                      };

                      // Seleccionamos el estilo correspondiente, fallback a INACTIVO
                      const estilo = estados[medidor.estado] || estados.INACTIVO;

                      return (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${estilo.bg}`}
                        >
                          <span className={`w-2 h-2 rounded-full mr-2 ${estilo.dot}`} />
                          {estilo.label}
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
                        onClick={() => onVerDetalles(medidor)}
                        className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-6 h-6" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEditarMedidor(medidor)}
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