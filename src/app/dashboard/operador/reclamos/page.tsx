'use client'

import React, { useEffect, useState } from 'react'
import { Clock, MessageCircle, CheckCircle, XCircle, Send } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ruta from '@/api/axios'

interface Reclamo {
  idReclamo: number
  motivo: string
  descripcion: string
  imagenURL: string
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTO' | 'RECHAZADO'
  fechaCreacion: string
  socioNombre: string
}

const estados: Reclamo['estado'][] = ['PENDIENTE', 'EN_PROCESO', 'RESUELTO', 'RECHAZADO']

const ReclamosOperador: React.FC = () => {
  const [reclamos, setReclamos] = useState<Reclamo[]>([])
  const [loading, setLoading] = useState(false)
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null)

  useEffect(() => {
    const fetchReclamos = async () => {
      setLoading(true)
      try {
        const res = await ruta.get('/reclamos')
        setReclamos(res.data)
      } catch {
        toast.error('Error al cargar los reclamos')
      } finally {
        setLoading(false)
      }
    }
    fetchReclamos()
  }, [])

  const handleEstadoChange = async (id: number, nuevoEstado: Reclamo['estado']) => {
    try {
      const res = await ruta.put(`/reclamos/${id}`, { estado: nuevoEstado })
      setReclamos((prev) =>
        prev.map((r) => (r.idReclamo === id ? { ...r, estado: res.data.estado } : r))
      )
      toast.success('Estado actualizado')
    } catch {
      toast.error('Error al actualizar estado')
    }
  }

  const getEstadoConfig = (estado: Reclamo['estado']) => {
    switch (estado) {
      case 'PENDIENTE': return { icon: <Clock className="w-4 h-4" />, text: 'Pendiente', color: 'text-blue-600', bg: 'bg-blue-100' }
      case 'EN_PROCESO': return { icon: <MessageCircle className="w-4 h-4" />, text: 'En Proceso', color: 'text-blue-800', bg: 'bg-blue-200' }
      case 'RESUELTO': return { icon: <CheckCircle className="w-4 h-4" />, text: 'Resuelto', color: 'text-green-700', bg: 'bg-green-100' }
      case 'RECHAZADO': return { icon: <XCircle className="w-4 h-4" />, text: 'Rechazado', color: 'text-red-600', bg: 'bg-red-100' }
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-blue-600 text-white rounded-2xl shadow p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Reclamos de Socios</h2>
            <p className="text-blue-100">Gestiona y actualiza el estado de los reclamos recibidos</p>
          </div>
          <div className="text-sm text-white font-medium">
            Total: {reclamos.length} reclamos
          </div>
        </div>

        {/* Lista de reclamos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-gray-500 col-span-full">Cargando reclamos...</p>
          ) : reclamos.length === 0 ? (
            <p className="text-gray-500 col-span-full">No hay reclamos registrados.</p>
          ) : (
            reclamos.map((r) => {
              const estado = getEstadoConfig(r.estado)
              return (
                <div key={r.idReclamo} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-blue-800 text-lg">{r.motivo}</h3>
                    <div className={`${estado.bg} ${estado.color} px-2 py-1 rounded text-xs flex items-center gap-1`}>
                      {estado.icon} {estado.text}
                    </div>
                  </div>
                  <p className="text-sm text-blue-700 line-clamp-3">{r.descripcion}</p>
                  {r.imagenURL && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${r.imagenURL}`}
                      alt="Evidencia"
                      className="w-full h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
                      onClick={() => setImagenAmpliada(`${process.env.NEXT_PUBLIC_API_URL}${r.imagenURL}`)}
                    />
                  )}
                  <p className="text-xs text-blue-600">
                    Socio: {r.socioNombre} — {new Date(r.fechaCreacion).toLocaleDateString()}
                  </p>
                  <select
                    value={r.estado}
                    onChange={(e) => handleEstadoChange(r.idReclamo, e.target.value as Reclamo['estado'])}
                    className="mt-2 border border-blue-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {estados.map((e) => (
                      <option key={e} value={e}>{e.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              )
            })
          )}
        </div>

      </div>

      {/* Modal imagen */}
      {imagenAmpliada && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999] p-4"
          onClick={() => setImagenAmpliada(null)}
        >
          <img
            src={imagenAmpliada}
            alt="Vista ampliada"
            className="max-h-[90vh] w-auto object-contain rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  )
}

export default ReclamosOperador
