'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Pencil, Trash2, Droplets } from 'lucide-react'

interface TarifaReunion {
    idTarifaReunion: number
    nombreReunion: string
    ausente: number
    retraso: number
    fechaActualizacion: string
}

interface Props {
    tarifas: TarifaReunion[]
    onEdit: (categoria: TarifaReunion) => void
    onDelete: (id: number) => void
}

const TarifaReunionTabla: React.FC<Props> = ({ tarifas, onEdit, onDelete }) => {
    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden lg:block bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-green-600 to-lime-500 text-white">
                                <th className="p-4 text-left font-semibold">Tipo</th>
                                <th className="p-4 text-left font-semibold">Tarifa Retraso</th>
                                <th className="p-4 text-left font-semibold">Tarifa Ausente</th>
                                <th className="p-4 text-left font-semibold">Fecha Actualizacion</th>
                                <th className="p-4 text-center font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tarifas.map((tar, index) => (
                                <motion.tr
                                    key={tar.idTarifaReunion}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="border-b border-blue-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300"
                                >
                                    <td className="p-4">
                                        <span className="font-semibold text-gray-800 bg-blue-100 px-3 py-1 rounded-lg inline-block">
                                            {tar.nombreReunion}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-blue-600">
                                                {new Intl.NumberFormat('es-BO', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(tar.retraso)}
                                            </span>
                                            <span className="text-xs text-gray-500">Bs</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-cyan-600">
                                                {new Intl.NumberFormat('es-BO', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(tar.ausente)}
                                            </span>
                                            <span className="text-xs text-gray-500">Bs</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-gray-600 text-sm">{new Date(tar.fechaActualizacion).toLocaleDateString('es-BO', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => onEdit(tar)}
                                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
                                            >
                                                <Pencil size={18} />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => onDelete(tar.idTarifaReunion)}
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

                {tarifas.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center">
                        <Droplets className="mx-auto text-gray-300 mb-4" size={64} />
                        <p className="text-gray-500 text-lg font-medium">No hay tarifas registradas</p>
                        <p className="text-gray-400 text-sm mt-2">Comienza agregando una nueva tarifa</p>
                    </motion.div>
                )}
            </motion.div>
            {/* Vista Mobile/Tablet */}
            <div className="lg:hidden space-y-3 sm:space-y-4">
                {tarifas.map((tar, index) => (
                    <motion.div
                        key={tar.idTarifaReunion}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden"
                    >
                        {/* Header de la card */}
                        <div className="bg-gradient-to-r from-green-600 to-lime-500 p-4 flex items-center justify-between">
                            <span className="font-bold text-white text-lg">{tar.nombreReunion}</span>
                            <div className="flex gap-2">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onEdit(tar)}
                                    className="p-2 bg-white/20 text-white rounded-lg backdrop-blur-sm active:bg-white/30 transition-all"
                                >
                                    <Pencil size={18} />
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onDelete(tar.idTarifaReunion)}
                                    className="p-2 bg-white/20 text-white rounded-lg backdrop-blur-sm active:bg-white/30 transition-all"
                                >
                                    <Trash2 size={18} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Contenido de la card */}
                        <div className="p-4 space-y-3">
                            {/* Tarifas en grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-blue-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-gray-600 mb-1">Tarifa Retrado</p>
                                    <p className="font-bold text-blue-600 text-sm sm:text-base">
                                        {new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tar.retraso)}
                                    </p>
                                    <p className="text-xs text-gray-500">Bs</p>
                                </div>

                                <div className="bg-cyan-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-gray-600 mb-1">Tarifa Ausente</p>
                                    <p className="font-bold text-cyan-600 text-sm sm:text-base">
                                        {new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tar.ausente)}
                                    </p>
                                    <p className="text-xs text-gray-500">Bs</p>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Fecha Actualizacion</p>
                                <p className="text-sm text-gray-700">{new Date(tar.fechaActualizacion).toLocaleDateString('es-BO', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                })}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {tarifas.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-xl shadow-lg border border-blue-100 p-8 sm:p-12 text-center"
                    >
                        <Droplets className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="text-gray-500 text-base sm:text-lg font-medium">No hay tarifas registradas</p>
                        <p className="text-gray-400 text-xs sm:text-sm mt-2">Comienza agregando una nueva tarifa</p>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default TarifaReunionTabla
