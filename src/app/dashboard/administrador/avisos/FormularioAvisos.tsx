'use client'

import React, { useState } from 'react'
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

interface Props {
  avisos?: Aviso[] 
  setAvisos?: React.Dispatch<React.SetStateAction<Aviso[]>>
  onGuardarTituloFigura?: (titulo: string) => void
}

const FormularioAvisos: React.FC<Props> = ({ avisos = [], setAvisos, onGuardarTituloFigura: onGuardarTituloFigura }) => {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fechaVigencia, setFechaVigencia] = useState('')
  const [imagen, setImagen] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titulo || !descripcion || !fechaVigencia) {
      toast.error('Por favor, completa todos los campos.')
      return
    }

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

      // si setAvisos existe, lo usa (modo módulo)
      if (typeof setAvisos === 'function') {
        setAvisos([nuevoAviso, ...avisos])
      }

      // si viene del modal, devuelve el título
      if (onGuardarTituloFigura) {
        onGuardarTituloFigura(titulo)
      }

      toast.success('Aviso creado correctamente.')

      // limpiar
      setTitulo('')
      setDescripcion('')
      setFechaVigencia('')
      setImagen(null)

    } catch (error: any) {
      console.error('Error al crear el aviso:', error)
      toast.error(error.response?.data?.mensaje || 'Ocurrió un error al crear el aviso.')
    }
  }

  return (
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
            rows={3}
            placeholder="Contenido del aviso o noticia"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de vigencia</label>
          <input
            type="date"
            value={fechaVigencia}
            onChange={(e) => setFechaVigencia(e.target.value)}
            min={new Date().toLocaleDateString('en-CA', { timeZone: 'America/La_Paz' })}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
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
  )
}

export default FormularioAvisos
