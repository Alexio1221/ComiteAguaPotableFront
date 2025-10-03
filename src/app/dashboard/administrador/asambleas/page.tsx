'use client'

import React, { useState } from 'react'
import { FileText, Clock, CheckCircle, XCircle, File } from 'lucide-react'
import { motion } from 'framer-motion'

interface Reunion {
  id: number
  tipo: 'Reunión' | 'Asamblea'
  fecha: string
  hora: string
  lugar: string
  motivo: string
  descripcion: string
  estado: 'Programada' | 'Realizada' | 'Cancelada'
  documentoAsamblea?: string // opcional
}

interface Aviso {
  id: number
  titulo: string
  descripcion: string
  fecha: string
  imagen?: string
}

// Datos iniciales
const reunionesIniciales: Reunion[] = [
  {
    id: 1,
    tipo: 'Asamblea',
    fecha: '05/10/2025',
    hora: '18:00',
    lugar: 'Sala de reuniones principal',
    motivo: 'Asamblea General',
    descripcion: 'Aprobación del presupuesto anual y elección de nueva directiva.',
    estado: 'Programada',
  },
  {
    id: 2,
    tipo: 'Reunión',
    fecha: '28/09/2025',
    hora: '10:00',
    lugar: 'Oficina comité',
    motivo: 'Mantenimiento Red Principal',
    descripcion: 'Coordinar trabajos de mantenimiento en la red.',
    estado: 'Realizada',
  },
]

const ReunionesAdmin: React.FC = () => {
  // Estados para formulario
  const [tipo, setTipo] = useState<'Reunión' | 'Asamblea'>('Reunión')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [lugar, setLugar] = useState('')
  const [motivo, setMotivo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [documento, setDocumento] = useState<File | null>(null)

  // Opciones de aviso
  const [generarAviso, setGenerarAviso] = useState(false)
  const [imagenAviso, setImagenAviso] = useState<File | null>(null)

  // Datos
  const [reuniones, setReuniones] = useState<Reunion[]>(reunionesIniciales)
  const [avisos, setAvisos] = useState<Aviso[]>([])

  // Crear nueva reunión/asamblea
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fecha || !hora || !lugar || !motivo || !descripcion) return

    const nuevaReunion: Reunion = {
      id: reuniones.length + 1,
      tipo,
      fecha,
      hora,
      lugar,
      motivo,
      descripcion,
      estado: 'Programada',
      documentoAsamblea: documento ? documento.name : '',
    }
    setReuniones([nuevaReunion, ...reuniones])

    // Si se quiere generar aviso/noticia
    if (generarAviso) {
      const nuevoAviso: Aviso = {
        id: avisos.length + 1,
        titulo: motivo,
        descripcion,
        fecha,
        imagen: imagenAviso ? URL.createObjectURL(imagenAviso) : '',
      }
      setAvisos([nuevoAviso, ...avisos])
    }

    // Reset form
    setTipo('Reunión')
    setFecha('')
    setHora('')
    setLugar('')
    setMotivo('')
    setDescripcion('')
    setDocumento(null)
    setGenerarAviso(false)
    setImagenAviso(null)
  }

  // Icono por estado
  const getEstadoIcon = (estado: Reunion['estado']) => {
    switch (estado) {
      case 'Programada':
        return <Clock className="w-4 h-4 text-orange-500" />
      case 'Realizada':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'Cancelada':
        return <XCircle className="w-4 h-4 text-red-600" />
    }
  }

  // Gradiente por estado
  const getGradient = (estado: Reunion['estado']) => {
    switch (estado) {
      case 'Programada':
        return 'from-orange-400 to-orange-600'
      case 'Realizada':
        return 'from-green-400 to-green-600'
      case 'Cancelada':
        return 'from-red-400 to-red-600'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Reuniones / Asambleas</h2>
              <p className="text-blue-100">Crea reuniones/asambleas y genera avisos automáticamente</p>
            </div>
          </div>
        </div>

        {/* Dashboard de estados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-xl p-4 shadow-md flex items-center gap-3">
            <Clock className="w-6 h-6" />
            <div>
              <p className="text-sm opacity-90">Programadas</p>
              <p className="font-bold text-lg">{reuniones.filter(r => r.estado === 'Programada').length}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl p-4 shadow-md flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="text-sm opacity-90">Realizadas</p>
              <p className="font-bold text-lg">{reuniones.filter(r => r.estado === 'Realizada').length}</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-400 to-red-600 text-white rounded-xl p-4 shadow-md flex items-center gap-3">
            <XCircle className="w-6 h-6" />
            <div>
              <p className="text-sm opacity-90">Canceladas</p>
              <p className="font-bold text-lg">{reuniones.filter(r => r.estado === 'Cancelada').length}</p>
            </div>
          </div>
        </div>

        {/* Formulario de nueva reunión/asamblea */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-blue-700">Nueva Reunión / Asamblea</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as 'Reunión' | 'Asamblea')}
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="Reunión">Reunión</option>
                <option value="Asamblea">Asamblea</option>
              </select>
            </div>
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
                placeholder="Ej: Asamblea general, coordinación de mantenimiento..."
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

            {/* Opción para generar aviso */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={generarAviso}
                onChange={(e) => setGenerarAviso(e.target.checked)}
                id="generarAviso"
                className="w-4 h-4"
              />
              <label htmlFor="generarAviso" className="text-gray-700 text-sm">
                Generar aviso/noticia
              </label>
            </div>

            {/* Subir imagen opcional para aviso */}
            {generarAviso && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Imagen (opcional)</label>
                <input
                  type="file"
                  onChange={(e) => setImagenAviso(e.target.files ? e.target.files[0] : null)}
                  className="mt-1 w-full"
                />
              </div>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Crear
            </button>
          </form>
        </div>

        {/* Historial de reuniones/asambleas */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-blue-700">Historial</h3>
          {reuniones.length === 0 ? (
            <p className="text-gray-500">No se han registrado reuniones o asambleas.</p>
          ) : (
            <div className="space-y-3">
              {reuniones.map((r) => (
                <div
                  key={r.id}
                  className={`shadow-md rounded-xl overflow-hidden p-4 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r ${getGradient(r.estado)} text-white`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg">
                        {r.motivo} {r.tipo === 'Asamblea' && <span className="ml-2 px-2 py-0.5 text-xs bg-white/30 rounded-full">Asamblea</span>}
                      </p>
                      <p className="text-sm">{r.descripcion}</p>
                      <p className="text-xs mt-1">Fecha: {r.fecha} - Hora: {r.hora}</p>
                      <p className="text-xs">Lugar: {r.lugar}</p>
                      {r.documentoAsamblea && (
                        <p className="flex items-center gap-1 mt-1 text-sm">
                          <File className="w-4 h-4" /> {r.documentoAsamblea}
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

        {/* Lista de avisos generados */}
        {avisos.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4 text-blue-700">Avisos Generados</h3>
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
          </div>
        )}

      </div>
    </div>
  )
}

export default ReunionesAdmin

