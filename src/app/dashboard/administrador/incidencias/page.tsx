'use client'

import React, { useState, useEffect } from 'react'
import { Info, CheckCircle, XCircle, AlertCircle, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'

interface Reclamo {
  id: number
  socio: string
  asunto: string
  descripcion: string
  estado: 'Pendiente' | 'En Proceso' | 'Resuelto'
  respuesta?: string
  fecha: string
}

// Datos estáticos de ejemplo
const reclamosIniciales: Reclamo[] = [
  {
    id: 1,
    socio: 'Juan Perez',
    asunto: 'Fuga en la red principal',
    descripcion: 'Se ha detectado una fuga de agua en la calle principal.',
    estado: 'Pendiente',
    fecha: '2025-10-01',
  },
  {
    id: 2,
    socio: 'Alex Garcia',
    asunto: 'El agua esta sucio',
    descripcion: 'El agua en mi domicilio sale sucio.',
    estado: 'Pendiente',
    fecha: '2025-10-01',
  },
  {
    id: 3,
    socio: 'Maria Lopez',
    asunto: 'Corte de agua sin aviso',
    descripcion: 'No recibimos notificación del corte de agua ayer.',
    estado: 'En Proceso',
    fecha: '2025-09-30',
  },
  {
    id: 4,
    socio: 'Carlos Gomez',
    asunto: 'Comprobante de pago incorrecta',
    descripcion: 'El monto del comprobante de pago no corresponde al consumo real.',
    estado: 'Resuelto',
    fecha: '2025-09-28',
    respuesta: 'Se corrigió el monto de la factura y se envió el comprobante actualizado.',
  },
]

const IncidenciasAdmin: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const [selectedReclamo, setSelectedReclamo] = useState<Reclamo | null>(null)
  const [reclamos, setReclamos] = useState<Reclamo[]>(reclamosIniciales)
  const [respuesta, setRespuesta] = useState('')

  useEffect(() => setMounted(true), [])

  const actualizarEstado = (id: number, estado: Reclamo['estado']) => {
    setReclamos(reclamos.map(r => r.id === id ? { ...r, estado } : r))
    if (selectedReclamo && selectedReclamo.id === id) {
      setSelectedReclamo({ ...selectedReclamo, estado })
    }
  }

  const enviarRespuesta = (id: number) => {
    if (!respuesta) return
    setReclamos(reclamos.map(r => r.id === id ? { ...r, respuesta, estado: 'Resuelto' } : r))
    if (selectedReclamo && selectedReclamo.id === id) {
      setSelectedReclamo({ ...selectedReclamo, respuesta, estado: 'Resuelto' })
    }
    setRespuesta('')
    setSelectedReclamo(null)
  }

  if (!mounted) return null

  const getGradient = (estado: Reclamo['estado']) => {
    switch (estado) {
      case 'Pendiente':
        return 'from-red-400 to-red-600'
      case 'En Proceso':
        return 'from-yellow-400 to-yellow-600'
      case 'Resuelto':
        return 'from-green-400 to-green-600'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Gestión de Reclamos</h2>
                <p className="text-blue-100">Visualiza, responde y gestiona las incidencias</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Total de reclamos</p>
              <p className="text-4xl font-bold">{reclamos.length}</p>
            </div>
          </div>
        </div>

        {/* Tarjetas de leyenda de estados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-red-400 to-red-600 text-white rounded-xl p-4 shadow-md flex items-center gap-3">
            <AlertCircle className="w-6 h-6" />
            <div>
              <p className="text-sm opacity-90">Pendiente</p>
              <p className="font-bold text-lg">{reclamos.filter(r => r.estado === 'Pendiente').length}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-xl p-4 shadow-md flex items-center gap-3">
            <Info className="w-6 h-6" />
            <div>
              <p className="text-sm opacity-90">En Proceso</p>
              <p className="font-bold text-lg">{reclamos.filter(r => r.estado === 'En Proceso').length}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl p-4 shadow-md flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="text-sm opacity-90">Resuelto</p>
              <p className="font-bold text-lg">{reclamos.filter(r => r.estado === 'Resuelto').length}</p>
            </div>
          </div>
        </div>

        {/* Grid de reclamos */}
        <div className={`grid gap-6 ${reclamos.length === 1
            ? 'grid-cols-1'
            : reclamos.length === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
          {reclamos.map((r, index) => (
            <motion.div
              key={r.id}
              className={`shadow-lg rounded-2xl overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl bg-gradient-to-l ${getGradient(r.estado)} text-white`}
              onClick={() => setSelectedReclamo(r)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold">{r.asunto}</h3>
                    <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-white/30 font-semibold backdrop-blur-sm">
                      {r.socio}
                    </span>
                  </div>
                  <Info className="w-6 h-6 opacity-80" />
                </div>
                <p className="text-sm opacity-90">{r.fecha}</p>
                <p className="mt-2 line-clamp-3">{r.descripcion}</p>
                {r.respuesta && (
                  <p className="mt-2 text-green-200 flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" /> {r.respuesta}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal de reclamo */}
        {selectedReclamo && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <h3 className="text-xl font-bold mb-2">{selectedReclamo.asunto}</h3>
              <p className="mb-2"><strong>Socio:</strong> {selectedReclamo.socio}</p>
              <p className="mb-4">{selectedReclamo.descripcion}</p>
              {selectedReclamo.respuesta && (
                <p className="mb-4 text-green-600 flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" /> <strong>Respuesta:</strong> {selectedReclamo.respuesta}
                </p>
              )}

              <textarea
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="w-full border rounded-md p-2 mb-4"
              />

              <div className="flex justify-between">
                <div className="space-x-2">
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                    onClick={() => actualizarEstado(selectedReclamo.id, 'Pendiente')}
                  >Pendiente</button>
                  <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                    onClick={() => actualizarEstado(selectedReclamo.id, 'En Proceso')}
                  >En Proceso</button>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                    onClick={() => enviarRespuesta(selectedReclamo.id)}
                  >Responder / Resolver</button>
                </div>
                <button
                  className="px-4 py-2 bg-gray-300 rounded-md"
                  onClick={() => setSelectedReclamo(null)}
                >Cerrar</button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </div>
    </div>
  )
}

export default IncidenciasAdmin
