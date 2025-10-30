'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { PlusCircle, Pencil, Trash2, Droplets } from 'lucide-react'
import ruta from '@/api/axios'
import ConfirmModal from '@/app/modals/ConfirmModal'
import CategoriaModal from './CategoriaModal'

interface Categoria {
  idCategoria: number
  tipo: string
  tarifa: number
  tarifaAdicional: number
  limiteBasico: number
  moraExponencial: boolean
  descripcion: string
}

const CategoriasAdmin: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<Categoria | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = async () => {
    try {
      const res = await ruta.get('/servicios/categorias')
      setCategorias(res.data)
    } catch {
      toast.error('Error al cargar categorías')
    }
  }

  const openModal = (categoria?: Categoria) => {
    if (categoria) {
      setEditing(categoria)
    } else {
      setEditing(null)
    }
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setEditing(null)
  }

  const handleDelete = (id: number) => {
    setSelectedId(id)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedId == null) return
    try {
      const response = await ruta.delete(`/servicios/categoria/${selectedId}`)
      toast.success(response.data?.mensaje?.toString() || 'Categoría eliminada correctamente')
      fetchCategorias()
    } catch (error: any) {
      toast.error(error.response?.data?.mensaje || 'Error al eliminar la categoría')
    } finally {
      setConfirmOpen(false)
      setSelectedId(null)
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
                onClick={() => openModal()}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 font-medium text-sm sm:text-base"
              >
                <PlusCircle size={18} /> Nueva Categoría
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tabla */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:block bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                  <th className="p-4 text-left font-semibold">Tipo</th>
                  <th className="p-4 text-left font-semibold">Tarifa Básica</th>
                  <th className="p-4 text-left font-semibold">Tarifa Adicional</th>
                  <th className="p-4 text-left font-semibold">Límite Básico</th>
                  <th className='p-4 text-left font-semibold'>Mora Exponencial</th>
                  <th className="p-4 text-left font-semibold">Descripción</th>
                  <th className="p-4 text-center font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((cat, index) => (
                  <motion.tr
                    key={cat.idCategoria}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-blue-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300"
                  >
                    <td className="p-4">
                      <span className="font-semibold text-gray-800 bg-blue-100 px-3 py-1 rounded-lg inline-block">
                        {cat.tipo}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-blue-600">
                          {new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cat.tarifa)}
                        </span>
                        <span className="text-xs text-gray-500">Bs</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-cyan-600">
                          {new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cat.tarifaAdicional)}
                        </span>
                        <span className="text-xs text-gray-500">Bs/m³</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-teal-600">
                          {new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cat.limiteBasico)}
                        </span>
                        <span className="text-xs text-gray-500">m³</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={cat.moraExponencial}
                        disabled
                        className="w-5 h-5 rounded border-gray-300 accent-blue-600 cursor-not-allowed"
                      />
                    </td>
                    <td className="p-4">
                      <span className="text-gray-600 text-sm">{cat.descripcion}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openModal(cat)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          <Pencil size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(cat.idCategoria)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {categorias.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center"
            >
              <Droplets className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg font-medium">No hay categorías registradas</p>
              <p className="text-gray-400 text-sm mt-2">Comienza agregando una nueva categoría</p>
            </motion.div>
          )}
        </motion.div>

        {/* Vista Mobile/Tablet */}
        <div className="lg:hidden space-y-3 sm:space-y-4">
          {categorias.map((cat, index) => (
            <motion.div
              key={cat.idCategoria}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden"
            >
              {/* Header de la card */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 flex items-center justify-between">
                <span className="font-bold text-white text-lg">{cat.tipo}</span>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openModal(cat)}
                    className="p-2 bg-white/20 text-white rounded-lg backdrop-blur-sm active:bg-white/30 transition-all"
                  >
                    <Pencil size={18} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(cat.idCategoria)}
                    className="p-2 bg-white/20 text-white rounded-lg backdrop-blur-sm active:bg-white/30 transition-all"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </div>

              {/* Contenido de la card */}
              <div className="p-4 space-y-3">
                {/* Tarifas en grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 mb-1">Tarifa Básica</p>
                    <p className="font-bold text-blue-600 text-sm sm:text-base">
                      {new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cat.tarifa)}
                    </p>
                    <p className="text-xs text-gray-500">Bs</p>
                  </div>

                  <div className="bg-cyan-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 mb-1">Tarifa Adic.</p>
                    <p className="font-bold text-cyan-600 text-sm sm:text-base">
                      {new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cat.tarifaAdicional)}
                    </p>
                    <p className="text-xs text-gray-500">Bs/m³</p>
                  </div>

                  <div className="bg-teal-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 mb-1">Límite Básico</p>
                    <p className="font-bold text-teal-600 text-sm sm:text-base">
                      {new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cat.limiteBasico)}
                    </p>
                    <p className="text-xs text-gray-500">m³</p>
                  </div>
                </div>

                {/* Descripción */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Descripción</p>
                  <p className="text-sm text-gray-700">{cat.descripcion}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {categorias.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg border border-blue-100 p-8 sm:p-12 text-center"
            >
              <Droplets className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 text-base sm:text-lg font-medium">No hay categorías registradas</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-2">Comienza agregando una nueva categoría</p>
            </motion.div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        title={'Eliminar Categoría'}
        message="¿Deseas eliminar esta categoría?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <CategoriaModal
        isOpen={isOpen}
        onClose={closeModal}
        initialData={editing}
        onSaved={fetchCategorias}
      />
    </div>
  )
}

export default CategoriasAdmin