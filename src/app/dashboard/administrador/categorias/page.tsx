'use client'

import React, { useEffect, useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { PlusCircle, Pencil, Trash2, Save, X } from 'lucide-react'
import axios from '@/api/axios'

interface Categoria {
  idCategoria?: number
  tipo: string
  tarifa: number
  tarifaAdicional: number
  limiteBasico: number
  descripcion: string
}

const CategoriasAdmin: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Categoria | null>(null)
  const [form, setForm] = useState<Categoria>({
    tipo: '',
    tarifa: 0,
    tarifaAdicional: 0,
    limiteBasico: 0,
    descripcion: '',
  })

  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = async () => {
    try {
      const res = await axios.get('/categorias')
      setCategorias(res.data)
    } catch {
      toast.error('Error al cargar categorías')
    }
  }

  const openModal = (categoria?: Categoria) => {
    if (categoria) {
      setEditing(categoria)
      setForm(categoria)
    } else {
      setEditing(null)
      setForm({
        tipo: '',
        tarifa: 0,
        tarifaAdicional: 0,
        limiteBasico: 0,
        descripcion: '',
      })
    }
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setEditing(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editing) {
        await axios.put(`/categorias/${editing.idCategoria}`, form)
        toast.success('Categoría actualizada correctamente')
      } else {
        await axios.post('/categorias', form)
        toast.success('Categoría registrada correctamente')
      }
      fetchCategorias()
      closeModal()
    } catch {
      toast.error('Error al guardar la categoría')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Deseas eliminar esta categoría?')) return
    try {
      await axios.delete(`/categorias/${id}`)
      toast.success('Categoría eliminada correctamente')
      fetchCategorias()
    } catch {
      toast.error('Error al eliminar la categoría')
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <PlusCircle className="text-blue-600" /> Gestión de Categorías
        </h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} /> Nueva Categoría
        </button>
      </motion.div>

      {/* Tabla */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="overflow-x-auto bg-white rounded-2xl shadow border"
      >
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="p-3">Tipo</th>
              <th className="p-3">Tarifa Básica (Bs)</th>
              <th className="p-3">Tarifa Adicional (Bs/m³)</th>
              <th className="p-3">Límite Básico (m³)</th>
              <th className="p-3">Descripción</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <motion.tr
                key={cat.idCategoria}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{cat.tipo}</td>
                <td className="p-3">{cat.tarifa.toFixed(2)}</td>
                <td className="p-3">{cat.tarifaAdicional.toFixed(2)}</td>
                <td className="p-3">{cat.limiteBasico.toFixed(2)}</td>
                <td className="p-3 text-gray-600">{cat.descripcion}</td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() => openModal(cat)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.idCategoria!)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6">
                <Dialog.Title className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  {editing ? 'Editar Categoría' : 'Nueva Categoría'}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium">Tipo</label>
                    <input
                      type="text"
                      value={form.tipo}
                      onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                      required
                      className="w-full border p-2 rounded-lg focus:outline-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium">
                        Tarifa Básica (Bs)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={form.tarifa}
                        onChange={(e) =>
                          setForm({ ...form, tarifa: parseFloat(e.target.value) })
                        }
                        required
                        className="w-full border p-2 rounded-lg focus:outline-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        Tarifa Adicional (Bs/m³)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={form.tarifaAdicional}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            tarifaAdicional: parseFloat(e.target.value),
                          })
                        }
                        required
                        className="w-full border p-2 rounded-lg focus:outline-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Límite Básico (m³)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.limiteBasico}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          limiteBasico: parseFloat(e.target.value),
                        })
                      }
                      required
                      className="w-full border p-2 rounded-lg focus:outline-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Descripción
                    </label>
                    <textarea
                      value={form.descripcion}
                      onChange={(e) =>
                        setForm({ ...form, descripcion: e.target.value })
                      }
                      rows={2}
                      className="w-full border p-2 rounded-lg focus:outline-blue-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                    >
                      <X size={16} /> Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Save size={16} /> {editing ? 'Actualizar' : 'Guardar'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default CategoriasAdmin
