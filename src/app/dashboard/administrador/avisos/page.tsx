'use client'

import React, { useState, useEffect } from 'react'
import { PlusCircle, AlertCircle, ClipboardClock, CalendarDays } from 'lucide-react'
import ruta from '@/api/axios'
import toast from 'react-hot-toast'

interface Aviso {
  idNoticiaAviso: number
  titulo: string
  descripcion: string
  fechaVigencia: string
  fechaPublicacion: string
  imagen?: string
}

const AvisosAdmin: React.FC = () => {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fechaVigencia, setFechaVigencia] = useState('')
  const [imagen, setImagen] = useState<File | null>(null)
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [errorFecha, setErrorFecha] = useState<string | null>(null)

  //  Obtener avisos al cargar el componente
  useEffect(() => {
    const fetchAvisos = async () => {
      try {
        const res = await ruta.get('/avisos')
        setAvisos(res.data)
      } catch (error) {
        console.error('Error al obtener avisos:', error)
        toast.error('No se pudieron cargar los avisos.')
      }
    }
    fetchAvisos()
  }, [])

  //  Crear nuevo aviso
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titulo || !descripcion || !fechaVigencia) {
      toast.error('Por favor, completa todos los campos.')
      return
    }

    const hoy = new Date().toISOString().split('T')[0]
    if (fechaVigencia <= hoy) {
      setErrorFecha('La fecha de vigencia debe ser posterior al día actual.')
      return
    }
    setErrorFecha(null)

    try {
      const formData = new FormData()
      formData.append('titulo', titulo)
      formData.append('descripcion', descripcion)
      formData.append('fechaVigencia', fechaVigencia)
      if (imagen) formData.append('imagen', imagen)

      const response = await ruta.post('/avisos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const nuevoAviso: Aviso = response.data
      setAvisos([nuevoAviso, ...avisos])
      toast.success('Aviso creado correctamente.')

      // Reset
      setTitulo('')
      setDescripcion('')
      setFechaVigencia('')
      setImagen(null)
    } catch (error) {
      console.error('Error al crear el aviso:', error)
      toast.error('Ocurrió un error al crear el aviso.')
    }
  }

  // 🗑 Eliminar aviso
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este aviso?')) return

    try {
      await ruta.delete(`/avisos/${id}`)
      setAvisos(avisos.filter((a) => a.idNoticiaAviso !== id))
      toast.success('Aviso eliminado correctamente.')
    } catch (error) {
      console.error('Error al eliminar el aviso:', error)
      toast.error('No se pudo eliminar el aviso.')
    }
  }

  // Formateador de fechas en español
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-BO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <PlusCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Avisos / Noticias</h2>
              <p className="text-blue-100">Crea y gestiona los avisos o noticias de tu comité</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-blue-700">Nuevo Aviso / Noticia</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Título</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Título del aviso/noticia"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Contenido del aviso o noticia"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de vigencia</label>
              <input
                type="date"
                value={fechaVigencia}
                onChange={(e) => setFechaVigencia(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errorFecha ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'
                  }`}
              />
              {errorFecha && (
                <p className="flex items-center gap-1 text-sm text-red-600 mt-1">
                  <AlertCircle className="w-4 h-4" /> {errorFecha}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Imagen (opcional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files ? e.target.files[0] : null)}
                className="mt-1 w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Crear Aviso
            </button>
          </form>
        </div>

        {/* Lista */}
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
      </div>
    </div>
  )
}

export default AvisosAdmin
