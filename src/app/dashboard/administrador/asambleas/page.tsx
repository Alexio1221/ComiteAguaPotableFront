'use client'

import React, { useState, useEffect } from 'react'
import { PlusCircle } from 'lucide-react'
import ruta from '@/api/axios'
import toast from 'react-hot-toast'

interface Reunion {
  idReunion: number
  tipo: string
  fecha: string
  hora: string
  lugar: string
  motivo: string
  descripcion: string
  documentoAsamblea?: string
}

const tipos = [
  'Reunión de Directorio',
  'Asamblea General',
  'Trabajo',
  'Reunión Técnica',
  'Otro',
]

const ReunionesAdmin: React.FC = () => {
  // Estados de formulario
  const [tipo, setTipo] = useState(tipos[0])
  const [otroTipo, setOtroTipo] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [lugar, setLugar] = useState('')
  const [motivo, setMotivo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [documento, setDocumento] = useState<File | null>(null)
  const [imagenAviso, setImagenAviso] = useState<File | null>(null)

  // Reuniones vigentes
  const [reuniones, setReuniones] = useState<Reunion[]>([])

  // 🗂 Obtener reuniones vigentes
  useEffect(() => {
    const fetchReuniones = async () => {
      try {
        const res = await ruta.get('/avisos/reunion')
        setReuniones(res.data)
      } catch (error: any) {
        console.error('Error al obtener reuniones:', error)
        toast.error('No se pudieron cargar las reuniones.')
      }
    }
    fetchReuniones()
  }, [])

  // 📌 Crear reunión + aviso
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fecha || !hora || !lugar || !motivo || !descripcion) {
      toast.error('Por favor completa todos los campos obligatorios.')
      return
    }

    const tipoFinal = tipo === 'Otro' ? otroTipo : tipo

    try {
      // FormData reunión
      const formDataReuniones = new FormData()
      formDataReuniones.append('tipo', tipoFinal)
      formDataReuniones.append('fecha', fecha)
      formDataReuniones.append('hora', hora)
      formDataReuniones.append('lugar', lugar)
      formDataReuniones.append('motivo', motivo)
      formDataReuniones.append('descripcion', descripcion)
      if (documento) formDataReuniones.append('documentoAsamblea', documento)

      // FormData aviso
      const formDataAvisos = new FormData()
      formDataAvisos.append('titulo', motivo)
      formDataAvisos.append('descripcion', descripcion)
      formDataAvisos.append('fechaVigencia', fecha)
      if (imagenAviso) formDataAvisos.append('imagen', imagenAviso)

      // Enviar ambas solicitudes en paralelo
      const [resReunion, resAviso] = await Promise.all([
        ruta.post('/avisos/reunion', formDataReuniones, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
        ruta.post('/avisos', formDataAvisos, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
      ])

      const reunionCreada: Reunion = resReunion.data

      // Actualizar listado
      setReuniones([reunionCreada, ...reuniones])

      // Mostrar mensaje de backend si lo envía
      if (resReunion.data.message) toast.success(resReunion.data.message)
      if (resAviso.data.message) toast.success(resAviso.data.message)

      toast.success('Reunión y aviso creados correctamente.')

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
    } catch (error: any) {
      console.error('Error al crear reunión o aviso:', error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Ocurrió un error al crear la reunión o aviso.')
      }
    }
  }

  // 🗑 Eliminar reunión
  const handleDeleteReunion = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta reunión?')) return

    try {
      const res = await ruta.delete(`/avisos/reunion/${id}`)
      setReuniones(reuniones.filter(r => r.idReunion !== id))
      toast.success(res.data?.message || 'Reunión eliminada correctamente.')
    } catch (error: any) {
      console.error('Error al eliminar reunión:', error)
      toast.error('No se pudo eliminar la reunión.')
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
                {tipos.map(t => <option key={t} value={t}>{t}</option>)}
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
                  min={new Date().toISOString().split('T')[0]}
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
              <input type="file" onChange={(e) => setDocumento(e.target.files?.[0] || null)} className="mt-1 w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Imagen de aviso (opcional)</label>
              <input type="file" accept="image/*" onChange={(e) => setImagenAviso(e.target.files?.[0] || null)} className="mt-1 w-full" />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Crear Reunión
            </button>
          </form>
        </div>

        {/* Lista de reuniones vigentes */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-blue-700">Reuniones Vigentes</h3>
          {reuniones.length === 0 ? (
            <p className="text-gray-500">No hay reuniones vigentes.</p>
          ) : (
            <div className="space-y-3">
              {reuniones.map(r => (
                <div
                  key={r.idReunion}
                  className="bg-gray-50 border rounded-xl p-4 hover:bg-gray-100 transition flex gap-4 items-start"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{r.tipo}</p>
                    <p className="text-sm text-gray-600">{r.motivo}</p>
                    <p className="text-xs text-gray-500">Fecha: {new Date(r.fecha).toLocaleDateString('es-BO')}</p>
                    <p className="text-xs text-gray-500">Hora: {r.hora}</p>
                    <p className="text-xs text-gray-500">Lugar: {r.lugar}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteReunion(r.idReunion)}
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

export default ReunionesAdmin
