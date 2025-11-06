'use client'

import React, { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition, DialogPanel, TransitionChild, DialogTitle } from '@headlessui/react'
import { Save, X, Droplets } from 'lucide-react'
import toast from 'react-hot-toast'
import ruta from '@/api/axios'

interface Categoria {
  idCategoria?: number
  tipo: string
  tarifa: number
  tarifaAdicional: number
  limiteBasico: number
  moraExponencial: boolean
  descripcion: string
}

interface CategoriaModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: Categoria | null
  onSaved: () => void
}

const CategoriaModal: React.FC<CategoriaModalProps> = ({ isOpen, onClose, initialData, onSaved }) => {
  const [form, setForm] = useState<Categoria>({
    tipo: '',
    tarifa: 0,
    tarifaAdicional: 0,
    limiteBasico: 0,
    moraExponencial: false,
    descripcion: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setForm(initialData)
    } else {
      setForm({
        tipo: '',
        tarifa: 0,
        tarifaAdicional: 0,
        limiteBasico: 0,
        moraExponencial: false,
        descripcion: '',
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (initialData) {
        await ruta.put(`/servicios/categoria/${initialData.idCategoria}`, form)
        toast.success('Categoría actualizada correctamente')
      } else {
        await ruta.post('/servicios/categorias', form)
        toast.success('Categoría registrada correctamente')
      }
      onSaved()
      onClose()
    } catch (error: any) {
      const mensaje = error.response?.data?.mensaje || 'Error al guardar la categoría'
      toast.error(mensaje)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <DialogPanel className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-blue-100">
              {/* Header con gradiente */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Droplets className="text-white" size={24} />
                    </div>
                    <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
                      {initialData ? 'Editar Categoría' : 'Nueva Categoría'}
                    </DialogTitle>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                {/* Tipo de categoría */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Tipo de Categoría
                  </label>
                  <input
                    type="text"
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    required
                    placeholder="Ej: Residencial, Comercial, Industrial..."
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base"
                  />
                </div>

                {/* Grid de tarifas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Tarifa Básica
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={form.tarifa}
                        onChange={(e) => {
                          const value = e.target.value
                          setForm({ ...form, tarifa: value === '' ? 0 : Number(value) })
                        }}
                        required
                        placeholder="0.00"
                        className="w-full border-2 border-gray-200 p-3 pr-12 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                        Bs
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Tarifa Adicional
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={form.tarifaAdicional}
                        onChange={(e) => {
                          const value = e.target.value
                          setForm({ ...form, tarifaAdicional: value === '' ? 0 : Number(value) })
                        }}
                        required
                        placeholder="0.00"
                        className="w-full border-2 border-gray-200 p-3 pr-16 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all text-sm sm:text-base"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm font-medium">
                        Bs/m³
                      </span>
                    </div>
                  </div>
                </div>

                {/* Límite básico */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Límite Básico
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={form.limiteBasico}
                      onChange={(e) => {
                        const value = e.target.value
                        setForm({ ...form, limiteBasico: value === '' ? 0 : Number(value) })
                      }}
                      required
                      placeholder="0.00"
                      className="w-full border-2 border-gray-200 p-3 pr-12 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all text-sm sm:text-base"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                      m³
                    </span>
                  </div>
                </div>

                {/* Mora Exponencial */}
                <div className="flex items-center gap-2">
                  <label htmlFor="moraExponencial" className="text-sm font-medium text-gray-700">
                    Mora Exponencial
                  </label>
                  <input
                    type="checkbox"
                    id="moraExponencial"
                    checked={form.moraExponencial}
                    onChange={(e) => setForm({ ...form, moraExponencial: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 accent-blue-600"
                  />
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Descripción
                  </label>
                  <textarea
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    rows={3}
                    placeholder="Descripción opcional de la categoría..."
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none text-sm sm:text-base"
                  />
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-200 active:scale-95 flex items-center justify-center gap-2 transition-all font-medium text-sm sm:text-base"
                  >
                    <X size={18} /> Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save size={18} /> {initialData ? 'Actualizar' : 'Guardar'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}

export default CategoriaModal