'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { PlusCircle, Pencil, Trash2, Droplets } from 'lucide-react'
import ruta from '@/api/axios'
import ConfirmModal from '@/app/modals/ConfirmModal'
import CategoriaModal from './categoria/CategoriaModal'
import CategoriasTable from './categoria/CategoriasTable'
import TarifaReunionTabla from './reunion/TarifaReunionTable'
import TarifaReunionModal from './reunion/TarifaReunionModal'

interface Categoria {
  idCategoria: number
  tipo: string
  tarifa: number
  tarifaAdicional: number
  limiteBasico: number
  moraExponencial: boolean
  descripcion: string
}

interface TarifaReunion {
  idTarifaReunion: number
  nombreReunion: string
  ausente: number
  retraso: number
  fechaActualizacion: string
}

const CategoriasAdmin: React.FC = () => {
  // === ESTADOS DE CATEGORÍAS ===
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
  const [confirmCategoriaOpen, setConfirmCategoriaOpen] = useState(false)
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(null)

  // === ESTADOS DE TARIFAS DE REUNIÓN ===
  const [tarifasReunion, setTarifasReunion] = useState<TarifaReunion[]>([])
  const [isTarifaModalOpen, setIsTarifaModalOpen] = useState(false)
  const [editingTarifa, setEditingTarifa] = useState<TarifaReunion | null>(null)
  const [confirmTarifaOpen, setConfirmTarifaOpen] = useState(false)
  const [selectedTarifaId, setSelectedTarifaId] = useState<number | null>(null)

  // === EFECTO INICIAL ===
  useEffect(() => {
    fetchCategorias()
    fetchTarifasReunion()
  }, [])

  // FUNCIONES DE CATEGORÍAS 
  const fetchCategorias = async () => {
    try {
      const res = await ruta.get('/servicios/categorias')
      setCategorias(res.data)
    } catch {
      toast.error('Error al cargar categorías')
    }
  }

  const openCategoriaModal = (categoria?: Categoria) => {
    setEditingCategoria(categoria || null)
    setIsCategoriaModalOpen(true)
  }

  const closeCategoriaModal = () => {
    setIsCategoriaModalOpen(false)
    setEditingCategoria(null)
  }

  const handleDeleteCategoria = (id: number) => {
    setSelectedCategoriaId(id)
    setConfirmCategoriaOpen(true)
  }

  const handleConfirmDeleteCategoria = async () => {
    if (selectedCategoriaId == null) return
    try {
      const response = await ruta.delete(`/servicios/categoria/${selectedCategoriaId}`)
      toast.success(response.data?.mensaje || 'Categoría eliminada correctamente')
      fetchCategorias()
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al eliminar la categoría')
    } finally {
      setConfirmCategoriaOpen(false)
      setSelectedCategoriaId(null)
    }
  }

  // FUNCIONES DE TARIFAS DE REUNIÓN
  const fetchTarifasReunion = async () => {
    try {
      const res = await ruta.get('/servicios/tarifas-reunion')
      setTarifasReunion(res.data)
    } catch {
      toast.error('Error al cargar tarifas de reunión')
    }
  }

  const openTarifaModal = (tarifa?: TarifaReunion) => {
    setEditingTarifa(tarifa || null)
    setIsTarifaModalOpen(true)
  }

  const closeTarifaModal = () => {
    setIsTarifaModalOpen(false)
    setEditingTarifa(null)
  }

  const handleDeleteTarifa = (id: number) => {
    setSelectedTarifaId(id)
    setConfirmTarifaOpen(true)
  }

  const handleConfirmDeleteTarifa = async () => {
    if (selectedTarifaId == null) return
    try {
      const response = await ruta.delete(`/servicios/tarifa/${selectedTarifaId}`)
      toast.success(response.data?.mensaje || 'Tarifa de reunión eliminada correctamente')
      fetchTarifasReunion()
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al eliminar la tarifa de reunión')
    } finally {
      setConfirmTarifaOpen(false)
      setSelectedTarifaId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 sm:mb-8"
        >
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-blue-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
                  <Droplets className="text-white" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent truncate">
                    Gestión de Categorías
                  </h1>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">
                    Administra las tarifas de agua potable
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openCategoriaModal()}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 font-medium text-sm sm:text-base"
              >
                <PlusCircle size={18} /> Nueva Categoría
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tabla Categoria*/}
        <CategoriasTable
          categorias={categorias}
          onEdit={openCategoriaModal}
          onDelete={handleDeleteCategoria}
        />
      </div>

      <div className="max-w-7xl mx-auto mt-10">
        {/* Header  Tarifa*/}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 sm:mb-8"
        >
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-blue-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-green-600 to-lime-500 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
                  <Droplets className="text-white" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-lime-500 bg-clip-text text-transparent truncate">
                    Tarifas de reuniones
                  </h1>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">
                    Administra las tarifas de agua potable
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openTarifaModal()}
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-lime-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 font-medium text-sm sm:text-base"
              >
                <PlusCircle size={18} /> Nueva Tarifa
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tabla Tarifas Reunion*/}
        <TarifaReunionTabla
          tarifas={tarifasReunion}
          onEdit={openTarifaModal}
          onDelete={handleDeleteTarifa}
        />
      </div>

      {/* Modales */}
      <ConfirmModal
        isOpen={confirmCategoriaOpen}
        title={'Eliminar Categoría'}
        message="¿Deseas eliminar esta categoría?"
        onCancel={() => setConfirmCategoriaOpen(false)}
        onConfirm={handleConfirmDeleteCategoria}
      />

      <CategoriaModal
        isOpen={isCategoriaModalOpen}
        onClose={closeCategoriaModal}
        initialData={editingCategoria}
        onSaved={fetchCategorias}
      />

      <ConfirmModal
        isOpen={confirmTarifaOpen}
        title={'Eliminar Tarifa de Reunión'}
        message="¿Deseas eliminar esta tarifa de reunión?"
        onCancel={() => setConfirmTarifaOpen(false)}
        onConfirm={handleConfirmDeleteTarifa}
      />

      <TarifaReunionModal
        isOpen={isTarifaModalOpen}
        onClose={closeTarifaModal}
        initialData={editingTarifa}
        onSaved={fetchTarifasReunion}
      />
    </div>
  )
}

export default CategoriasAdmin