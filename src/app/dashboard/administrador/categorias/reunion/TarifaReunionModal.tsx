'use client'

import React, { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition, DialogPanel, TransitionChild, DialogTitle } from '@headlessui/react'
import { Save, X, Droplets } from 'lucide-react'
import toast from 'react-hot-toast'
import ruta from '@/api/axios'

interface TarifaReunion {
  idTarifaReunion?: number
  nombreReunion: string
  ausente: number
  retraso: number
  fechaActualizacion: string
}

interface TarifaModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: TarifaReunion | null
  onSaved: () => void
}

const TarifaReunionModal: React.FC<TarifaModalProps> = ({ isOpen, onClose, initialData, onSaved }) => {
  const [form, setForm] = useState<TarifaReunion>({
    nombreReunion: '',
    ausente: 0,
    retraso: 0,
    fechaActualizacion: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setForm(initialData)
    } else {
      setForm({
        nombreReunion: '',
        ausente: 0,
        retraso: 0,
        fechaActualizacion: '',
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (initialData) {
        await ruta.put(`/servicios/tarifa/${initialData.idTarifaReunion}`, form)
        toast.success('Tarifa actualizada correctamente')
      } else {
        await ruta.post('/servicios/tarifa', form)
        toast.success('Categoría registrada correctamente')
      }
      onSaved()
      onClose()
    } catch (error: any) {
      const mensaje = error.response?.data?.mensaje || 'Error al guardar la  tarifa'
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
                    Tipo de Reunión
                  </label>
                  <input
                    type="text"
                    value={form.nombreReunion}
                    onChange={(e) => setForm({ ...form, nombreReunion: e.target.value })}
                    required
                    placeholder="Ej: Residencial, Comercial, Industrial..."
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base"
                  />
                </div>

                {/* Grid de tarifas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Tarifa Retraso
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={form.retraso}
                        onChange={(e) => {
                          const value = e.target.value
                          setForm({ ...form, retraso: value === '' ? 0 : Number(value) })
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
                        value={form.ausente}
                        onChange={(e) => {
                          const value = e.target.value
                          setForm({ ...form, ausente: value === '' ? 0 : Number(value) })
                        }}
                        required
                        placeholder="0.00"
                        className="w-full border-2 border-gray-200 p-3 pr-16 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all text-sm sm:text-base"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm font-medium">
                        Bs
                      </span>
                    </div>
                  </div>
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

export default TarifaReunionModal