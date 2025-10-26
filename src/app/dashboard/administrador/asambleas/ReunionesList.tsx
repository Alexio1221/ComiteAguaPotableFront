'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, FileText, Trash2, Tag } from 'lucide-react'

interface Reunion {
  idReunion: number
  tipo: string
  fechaReunion: string
  lugar: string
  motivo: string
  descripcion: string
}

interface Props {
  reuniones: Reunion[]
  onDelete: (id: number) => void
}

const ReunionesList: React.FC<Props> = ({ reuniones, onDelete }) => {
  if (!reuniones.length) return <p>No hay reuniones vigentes.</p>

  const getTipoColor = (tipo: string) => {
    const tipoLower = tipo.toLowerCase()
    if (tipoLower.includes('asamblea')) return 'from-purple-500 to-pink-500'
    if (tipoLower.includes('ordinaria')) return 'from-blue-500 to-cyan-500'
    if (tipoLower.includes('extraordinaria')) return 'from-orange-500 to-red-500'
    if (tipoLower.includes('emergencia')) return 'from-red-500 to-rose-600'
    return 'from-teal-500 to-green-500'
  }

  const getTipoBadgeColor = (tipo: string) => {
    const tipoLower = tipo.toLowerCase()
    if (tipoLower.includes('asamblea')) return 'bg-purple-100 text-purple-700 border-purple-200'
    if (tipoLower.includes('ordinaria')) return 'bg-blue-100 text-blue-700 border-blue-200'
    if (tipoLower.includes('extraordinaria')) return 'bg-orange-100 text-orange-700 border-orange-200'
    if (tipoLower.includes('emergencia')) return 'bg-red-100 text-red-700 border-red-200'
    return 'bg-teal-100 text-teal-700 border-teal-200'
  }

  return (
    <div className="space-y-4">
      {reuniones.map((r, index) => (
        <motion.div
          key={r.idReunion}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300"
        >
          {/* Header con gradiente según tipo */}
          <div className={`bg-gradient-to-r ${getTipoColor(r.tipo)} p-4 sm:p-5`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Tag className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-white">
                    {r.tipo}
                  </h4>
                  <p className="text-white/90 text-sm hidden sm:block">
                    Convocatoria oficial
                  </p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(r.idReunion)}
                className="self-end sm:self-auto p-2 sm:p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all text-white flex items-center gap-2"
              >
                <Trash2 size={18} />
                <span className="text-sm font-medium hidden sm:inline">Eliminar</span>
              </motion.button>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-4 sm:p-5 space-y-4">
            {/* Motivo destacado */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
                  <FileText className="text-white" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                    Motivo
                  </p>
                  <p className="text-gray-800 font-semibold text-sm sm:text-base break-words">
                    {r.motivo}
                  </p>
                </div>
              </div>
            </div>

            {/* Información en grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Fecha */}
              <div className="bg-white border border-gray-200 rounded-xl p-3 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Calendar className="text-blue-600" size={16} />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">Fecha</span>
                </div>
                <p className="text-gray-800 font-bold text-sm">
                  {new Date(r.fechaReunion).toLocaleDateString('es-BO', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'UTC'
                  })}
                </p>
              </div>

              {/* Hora */}
              <div className="bg-white border border-gray-200 rounded-xl p-3 hover:border-cyan-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-cyan-100 rounded-lg">
                    <Clock className="text-cyan-600" size={16} />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">Hora</span>
                </div>
                <p className="text-gray-800 font-bold text-sm">
                  {new Date(r.fechaReunion).toLocaleTimeString('es-BO', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </p>
              </div>

              {/* Lugar */}
              <div className="bg-white border border-gray-200 rounded-xl p-3 hover:border-teal-300 transition-colors sm:col-span-1 col-span-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-teal-100 rounded-lg">
                    <MapPin className="text-teal-600" size={16} />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">Lugar</span>
                </div>
                <p className="text-gray-800 font-bold text-sm break-words">{r.lugar}</p>
              </div>
            </div>

            {/* Descripción si existe */}
            {r.descripcion && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Descripción de la reunión
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {r.descripcion}
                </p>
              </div>
            )}

            {/* Badge de tipo */}
            <div className="flex justify-end">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getTipoBadgeColor(r.tipo)}`}>
                <Tag size={14} />
                {r.tipo}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default ReunionesList