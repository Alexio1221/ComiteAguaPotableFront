'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Calendar, Users, Plus, ClipboardList } from 'lucide-react'
import ruta from '@/api/axios'
import ReunionForm from './ReunionForm'
import ReunionesList from './ReunionesList'
import ConfirmModal from '@/app/modals/ConfirmModal'

interface Reunion {
  idReunion: number
  tipo: string
  fechaReunion: string
  lugar: string
  motivo: string
  descripcion: string
}

const ReunionesAdmin: React.FC = () => {
  const [reuniones, setReuniones] = useState<Reunion[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    const fetchReuniones = async () => {
      try {
        const res = await ruta.get('/avisos/reunion')
        setReuniones(res.data)
      } catch {
        toast.error('No se pudieron cargar las reuniones.')
      } finally {
        setLoading(false)
      }
    }
    fetchReuniones()
  }, [])

  const handleDelete = (id: number) => {
    setSelectedId(id)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedId == null) return
    try {
      await ruta.delete(`/avisos/reunion/${selectedId}`)
      setReuniones(reuniones.filter(r => r.idReunion !== selectedId))
      toast.success('Reunión eliminada correctamente.')
    } catch {
      toast.error('No se pudo eliminar la reunión.')
    } finally {
      setConfirmOpen(false)
      setSelectedId(null)
    }
  }

  const handleCreated = (reunion: Reunion) => {
    setReuniones([reunion, ...reuniones])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Principal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="text-white" size={32} />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
                  Reuniones y Asambleas
                </h1>
                <p className="text-blue-100 text-sm sm:text-base">
                  Gestiona las convocatorias y eventos de la comunidad
                </p>
              </div>
            </div>
          </div>

          {/* Stats móvil */}
          <div className="sm:hidden bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 flex items-center justify-center gap-2 text-white">
            <Calendar size={18} />
            <span className="font-semibold">{reuniones.length}</span>
            <span className="text-sm">Reuniones Vigentes</span>
          </div>
        </motion.div>

        {/* Formulario de Nueva Reunión */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100"
        >
          {/* Header del formulario */}
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 px-6 py-4 border-b border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Plus className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-blue-900">
                  Nueva Reunión / Asamblea
                </h3>
                <p className="text-sm text-blue-700 hidden sm:block">
                  Completa los datos para crear una nueva convocatoria
                </p>
              </div>
            </div>
          </div>

          {/* Contenido del formulario */}
          <div className="p-4 sm:p-6">
            <ReunionForm onCreated={handleCreated} />
          </div>
        </motion.div>

        {/* Lista de Reuniones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100"
        >
          {/* Header de la lista */}
          <div className="bg-gradient-to-r from-cyan-100 to-teal-100 px-6 py-4 border-b border-cyan-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-600 rounded-lg">
                <ClipboardList className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-cyan-900">
                  Reuniones Vigentes
                </h3>
                <p className="text-sm text-cyan-700 hidden sm:block">
                  Lista de todas las reuniones programadas
                </p>
              </div>
              {reuniones.length > 0 && (
                <div className="bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {reuniones.length}
                </div>
              )}
            </div>
          </div>

          {/* Contenido de la lista */}
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-gray-500">Cargando reuniones...</p>
              </div>
            ) : reuniones.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <Calendar className="text-gray-400" size={48} />
                </div>
                <p className="text-gray-600 font-medium text-lg">No hay reuniones programadas</p>
                <p className="text-gray-500 text-sm mt-2">Crea una nueva reunión para comenzar</p>
              </div>
            ) : (
              <ReunionesList reuniones={reuniones} onDelete={handleDelete} />
            )}
          </div>
        </motion.div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        title={'Eliminar Reunión'}
        message="¿Estás seguro de eliminar esta reunión?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default ReunionesAdmin