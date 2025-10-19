'use client'

import { Dialog, Transition, DialogPanel, TransitionChild, DialogTitle } from '@headlessui/react'
import { Fragment } from 'react'
import { Droplet, CheckCircle, X } from 'lucide-react'

interface PreviewLecturaModalProps {
    isOpen: boolean
    onConfirm: () => void
    onCancel: () => void
    datos: {
        idMedidor: number
        lecturaAnterior: number
        lecturaActual: number
        consumo: number
        precioPorM3?: number
        montoTotal?: number
        nombre: string
        apellido: string
        direccion: string
    }
}

export default function ConfirmModalLectura({ isOpen, onConfirm, onCancel, datos }: PreviewLecturaModalProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={onCancel}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95 translate-y-3"
                        enterTo="opacity-100 scale-100 translate-y-0"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100 translate-y-0"
                        leaveTo="opacity-0 scale-95 translate-y-3"
                    >
                        <DialogPanel className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md overflow-hidden border border-blue-100 max-h-[90vh] overflow-y-auto">
                            {/* Icono */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20" />
                                    <div className="relative bg-gradient-to-br from-blue-600 to-indigo-500 p-3 rounded-full shadow-lg">
                                        <Droplet className="text-white" size={32} />
                                    </div>
                                </div>
                            </div>

                            {/* Contenido */}
                            <div className="p-5">
                                <DialogTitle className="text-lg sm:text-xl font-bold text-gray-800 text-center mb-3">
                                    Confirmar registro de lectura
                                </DialogTitle>

                                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm sm:text-base text-gray-700">
                                    <div className="flex justify-between"><span className="font-medium">Socio:</span><span>{datos.nombre} {datos.apellido}</span></div>
                                    <div className="flex justify-between"><span className="font-medium">Dirección:</span><span>{datos.direccion}</span></div>
                                    <div className="flex justify-between"><span className="font-medium">N° Medidor:</span><span>{datos.idMedidor}</span></div>
                                    <div className="flex justify-between"><span className="font-medium">Lectura anterior:</span><span>{Number(datos.lecturaAnterior).toFixed(2)} m³</span></div>
                                    <div className="flex justify-between"><span className="font-medium">Lectura actual:</span><span>{Number(datos.lecturaActual).toFixed(2)} m³</span></div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Consumo:</span>
                                        <span className="text-blue-600 font-semibold">{Number(datos.consumo).toFixed(2)} m³</span>
                                    </div>
                                    {datos.precioPorM3 != null && (
                                        <div className="flex justify-between border-t pt-2">
                                            <span className="font-medium">Precio por m³:</span>
                                            <span>{Number(datos.precioPorM3).toFixed(2)} Bs</span>
                                        </div>
                                    )}
                                    {datos.montoTotal != null && (
                                        <div className="flex justify-between text-lg font-bold text-blue-700 border-t pt-2">
                                            <span>Total a pagar:</span>
                                            <span>{Number(datos.montoTotal).toFixed(2)} Bs</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="bg-gray-50 px-5 py-3 flex flex-col-reverse sm:flex-row justify-center gap-3">
                                <button
                                    onClick={onCancel}
                                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100 active:scale-95 transition font-medium flex items-center justify-center gap-2"
                                >
                                    <X size={16} />
                                    Cancelar
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-blue-800 to-blue-400 text-white hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition font-semibold flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={16} />
                                    Confirmar y Guardar
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}
