'use client'

import React, { useState } from 'react'
import { FileText, PlusCircle } from 'lucide-react'
import ruta from '@/api/axios' // ← tu instancia personalizada de Axios

interface Reunion {
  tipo: string
  fecha: string
  hora: string
  lugar: string
  motivo: string
  descripcion: string
  documentoAsamblea?: string
}

interface Aviso {
  titulo: string
  descripcion: string
  fecha: string
  imagen?: string
}

const tipos = [
  'Reunión de Directorio',
  'Asamblea General',
  'Trabajo',
  'Reunión Técnica',
  'Otro',
]

const ReunionesAdmin: React.FC = () => {
  const [tipo, setTipo] = useState(tipos[0])
  const [otroTipo, setOtroTipo] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [lugar, setLugar] = useState('')
  const [motivo, setMotivo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [documento, setDocumento] = useState<File | null>(null)
  const [imagenAviso, setImagenAviso] = useState<File | null>(null)
  const [imagenPreview, setImagenPreview] = useState<string | null>(null)

  const [reuniones, setReuniones] = useState<Reunion[]>([])
  const [avisos, setAvisos] = useState<Aviso[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fecha || !hora || !lugar || !motivo || !descripcion) return

    const tipoFinal = tipo === 'Otro' ? otroTipo : tipo

    try {
      const formData = new FormData()
      formData.append('tipo', tipoFinal)
      formData.append('fecha', fecha)
      formData.append('hora', hora)
      formData.append('lugar', lugar)
      formData.append('motivo', motivo)
      formData.append('descripcion', descripcion)
      if (documento) formData.append('documentoAsamblea', documento)
      if (imagenAviso) formData.append('imagenAviso', imagenAviso)

      // Enviar datos al backend
      const response = await ruta.post('/reuniones', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      // El backend debe devolver la reunión creada + aviso
      const { reunionCreada, avisoCreado } = response.data

      // Actualizar estados
      setReuniones([reunionCreada, ...reuniones])
      if (avisoCreado) setAvisos([avisoCreado, ...avisos])

      // Reset formulario
      setTipo(tipos[0])
      setOtroTipo('')
      setFecha('')
      setHora('')
      setLugar('')
      setMotivo('')
      setDescripcion('')
      setDocumento(null)
      setImagenAviso(null)
      setImagenPreview(null)
    } catch (error) {
      console.error('Error al crear la reunión:', error)
      alert('Ocurrió un error al crear la reunión.')
    }
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
              <h2 className="text-3xl font-bold">Reuniones / Asambleas</h2>
              <p className="text-blue-100">Crea reuniones/asambleas y genera avisos automáticamente</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-blue-700">Nueva Reunión / Asamblea</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {tipos.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {tipo === 'Otro' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Especifica el tipo</label>
                <input
                  type="text"
                  value={otroTipo}
                  onChange={(e) => setOtroTipo(e.target.value)}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Ej: Reunión extraordinaria, capacitación..."
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-gray-700">Hora</label>
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Lugar</label>
              <input
                type="text"
                value={lugar}
                onChange={(e) => setLugar(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Motivo</label>
              <input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Ej: Aprobación presupuesto, coordinación de mantenimiento..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Detalles de la reunión/asamblea..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Documento de Asamblea (opcional)
              </label>
              <input type="file" onChange={(e) => setDocumento(e.target.files ? e.target.files[0] : null)} className="mt-1 w-full" />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Imagen (opcional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    // Si se selecciona un archivo, lo guarda; si se cancela, limpia el estado
                    const file = e.target.files?.[0] || null
                    setImagenAviso(file)
                  }}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Preview de la imagen seleccionada */}
              {imagenAviso && (
                <div className="flex-shrink-0">
                  <p className="text-sm text-gray-600 mb-1 text-center">Vista previa</p>
                  <img
                    src={URL.createObjectURL(imagenAviso)}
                    alt="Imagen seleccionada"
                    className="w-80 h-80 object-cover rounded-lg border shadow-sm"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Crear Reunión
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReunionesAdmin
