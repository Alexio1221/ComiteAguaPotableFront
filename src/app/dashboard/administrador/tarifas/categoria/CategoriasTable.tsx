'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Pencil, Trash2, Droplets } from 'lucide-react'

interface Categoria {
    idCategoria: number
    tipo: string
    tarifa: number
    tarifaAdicional: number
    limiteBasico: number
    moraExponencial: boolean
    descripcion: string
}

interface Props {
    categorias: Categoria[]
    onEdit: (categoria: Categoria) => void
    onDelete: (id: number) => void
}

const CategoriasTable: React.FC<Props> = ({ categorias, onEdit, onDelete }) => {
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
                            <tr className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                                <th className="p-4 text-left font-semibold">Tipo</th>
                                <th className="p-4 text-left font-semibold">Tarifa Básica</th>
                                <th className="p-4 text-left font-semibold">Tarifa Adicional</th>
                                <th className="p-4 text-left font-semibold">Límite Básico</th>
                                <th className="p-4 text-left font-semibold">Mora Exponencial</th>
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
                                                {new Intl.NumberFormat('es-BO', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(cat.tarifa)}
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
                                                }).format(cat.tarifaAdicional)}
                                            </span>
                                            <span className="text-xs text-gray-500">Bs/m³</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-teal-600">
                                                {new Intl.NumberFormat('es-BO', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(cat.limiteBasico)}
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
                                                onClick={() => onEdit(cat)}
                                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
                                            >
                                                <Pencil size={18} />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => onDelete(cat.idCategoria)}
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center">
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
                                    onClick={() => onEdit(cat)}
                                    className="p-2 bg-white/20 text-white rounded-lg backdrop-blur-sm active:bg-white/30 transition-all"
                                >
                                    <Pencil size={18} />
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onDelete(cat.idCategoria)}
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
    )
}

export default CategoriasTable
