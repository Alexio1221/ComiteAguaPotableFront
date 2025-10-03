'use client'

import React, { useState } from 'react'
import { File, PlusCircle } from 'lucide-react'

interface Aviso {
  id: number
  titulo: string
  descripcion: string
  fecha: string
  imagen?: string
}

// Datos de ejemplo
const avisosIniciales: Aviso[] = [
  {
    id: 1,
    titulo: 'Nueva apertura de oficina',
    descripcion: 'Se ha abierto una nueva oficina en el centro de la ciudad. Visítanos y conoce nuestros servicios.',
    fecha: '25/09/2025',
    imagen: '/imagenes/loginImagen.webp',
  },
  {
    id: 2,
    titulo: 'Evento de networking',
    descripcion: 'Este sábado realizaremos un evento de networking para empresarios locales. ¡No te lo puedes perder!',
    fecha: '22/09/2025',
    imagen: '/imagenes/sofia.jpg',
  },
]

const AvisosAdmin: React.FC = () => {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fecha, setFecha] = useState('')
  const [imagen, setImagen] = useState<File | null>(null)
  const [avisos, setAvisos] = useState<Aviso[]>(avisosIniciales)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!titulo || !descripcion || !fecha) return

    const nuevoAviso: Aviso = {
      id: avisos.length + 1,
      titulo,
      descripcion,
      fecha,
      imagen: imagen ? URL.createObjectURL(imagen) : '',
    }

    setAvisos([nuevoAviso, ...avisos])

    // Reset
    setTitulo('')
    setDescripcion('')
    setFecha('')
    setImagen(null)
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

        {/* Formulario de nuevo aviso */}
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
              <label className="block text-sm font-medium text-gray-700">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Imagen (opcional)</label>
              <input
                type="file"
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

        {/* Lista de avisos */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-blue-700">Avisos / Noticias Registrados</h3>
          {avisos.length === 0 ? (
            <p className="text-gray-500">No hay avisos disponibles.</p>
          ) : (
            <div className="space-y-3">
              {avisos.map((a) => (
                <div key={a.id} className="bg-gray-50 border rounded-xl p-4 hover:bg-gray-100 transition flex gap-4">
                  {a.imagen && <img src={a.imagen} alt={a.titulo} className="w-24 h-24 object-cover rounded-lg" />}
                  <div>
                    <p className="font-semibold text-gray-800">{a.titulo}</p>
                    <p className="text-sm text-gray-600">{a.descripcion}</p>
                    <p className="text-xs text-gray-400 mt-1">Fecha: {a.fecha}</p>
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

export default AvisosAdmin
