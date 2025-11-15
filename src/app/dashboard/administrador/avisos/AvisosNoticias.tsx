'use client'

import React from 'react'
import ruta from '@/api/axios'
import toast from 'react-hot-toast'
import { CalendarDays, ClipboardClock } from 'lucide-react'

interface Aviso {
  idNoticiaAviso: number
  titulo: string
  descripcion: string
  fechaVigencia: string
  fechaPublicacion: string
  imagen?: string
}

interface Props {
  avisos: Aviso[]
  setAvisos: React.Dispatch<React.SetStateAction<Aviso[]>>
}

const AvisosNoticias: React.FC<Props> = ({ avisos, setAvisos }) => {
  const formatearFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString('es-BO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este aviso?')) return

    try {
      await ruta.delete(`/avisos/${id}`)
      setAvisos(avisos.filter((a) => a.idNoticiaAviso !== id))
      toast.success('Aviso eliminado correctamente.')
    } catch (error) {
      console.error('Error al eliminar aviso:', error)
      toast.error('No se pudo eliminar el aviso.')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold mb-4 text-blue-700">Avisos / Noticias Vigentes</h3>

      {avisos.length === 0 ? (
        <p className="text-gray-500">No hay avisos disponibles.</p>
      ) : (
        <div className="space-y-3">
          {avisos.map((a) => (
            <div
              key={a.idNoticiaAviso}
              className="bg-gray-50 border rounded-xl p-4 hover:bg-gray-100 transition flex gap-4 items-start"
            >
              {a.imagen && (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${a.imagen}`}
                  alt={a.titulo}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}

              <div className="flex-1">
                <p className="font-semibold text-gray-800">{a.titulo}</p>
                <p className="text-sm text-gray-600 mb-2">{a.descripcion}</p>

                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <CalendarDays className="w-4 h-4 text-blue-500" />
                  <span>Publicado el: {formatearFecha(a.fechaPublicacion)}</span>
                </p>

                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <ClipboardClock className="w-4 h-4 text-amber-500" />
                  <span>Vigente hasta: {formatearFecha(a.fechaVigencia)}</span>
                </p>
              </div>

              <button
                onClick={() => handleDelete(a.idNoticiaAviso)}
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AvisosNoticias
