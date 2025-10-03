'use client'

import React, { useState } from 'react'
import { FileText, MessageCircle, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Reclamo {
  id: number
  fecha: string
  motivo: string
  descripcion: string
  estado: 'Pendiente' | 'En Proceso' | 'Resuelto' | 'Rechazado'
  respuesta?: string
}

const ReclamosSocio: React.FC = () => {
  const [motivo, setMotivo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [reclamos, setReclamos] = useState<Reclamo[]>([
    {
      id: 1,
      fecha: '28/09/2025',
      motivo: 'Error en Factura',
      descripcion: 'El monto de mi comprobante de septiembre no coincide con mi consumo.',
      estado: 'Resuelto',
      respuesta: 'Se corrigió el comprobante, se aplicará en tu próximo recibo.',
    },
    {
      id: 2,
      fecha: '30/09/2025',
      motivo: 'Corte de Agua',
      descripcion: 'No tuve agua el día 29 de septiembre en la mañana.',
      estado: 'Pendiente',
    },
  ])

  // Enviar reclamo
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!motivo || !descripcion) return
    const nuevoReclamo: Reclamo = {
      id: reclamos.length + 1,
      fecha: new Date().toLocaleDateString(),
      motivo,
      descripcion,
      estado: 'Pendiente',
    }
    setReclamos([nuevoReclamo, ...reclamos])
    setMotivo('')
    setDescripcion('')
  }

  // Icono por estado
  const getEstadoIcon = (estado: Reclamo['estado']) => {
    switch (estado) {
      case 'Pendiente':
        return <Clock className="w-4 h-4 text-orange-500" />
      case 'En Proceso':
        return <MessageCircle className="w-4 h-4 text-blue-500" />
      case 'Resuelto':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'Rechazado':
        return <XCircle className="w-4 h-4 text-red-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Reclamos</h2>
              <p className="text-blue-100">Envía un reclamo y revisa el estado de tus solicitudes</p>
            </div>
          </div>
        </div>

        {/* Formulario de reclamo */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-blue-700">Nuevo Reclamo</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Motivo</label>
              <input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Ej: Error en factura, falta de agua..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Describe el problema..."
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Enviar Reclamo
            </button>
          </form>
        </div>

        {/* Historial de reclamos */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-blue-700">Historial de Reclamos</h3>
          {reclamos.length === 0 ? (
            <p className="text-gray-500">No has realizado ningún reclamo.</p>
          ) : (
            <div className="space-y-3">
              {reclamos.map((r) => (
                <div
                  key={r.id}
                  className="bg-gray-50 border rounded-xl p-4 hover:bg-gray-100 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{r.motivo}</p>
                      <p className="text-sm text-gray-600">{r.descripcion}</p>
                      <p className="text-xs text-gray-400 mt-1">Fecha: {r.fecha}</p>
                      {r.respuesta && (
                        <p className="text-sm mt-2 text-green-700">
                          <span className="font-medium">Respuesta:</span> {r.respuesta}
                        </p>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-sm font-semibold">
                      {getEstadoIcon(r.estado)} {r.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReclamosSocio
