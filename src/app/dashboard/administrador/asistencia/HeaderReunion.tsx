'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Calendario } from '@/animaciones/Animaciones'
import { Calendar, Clock } from 'lucide-react'

interface HeaderReunionProps {
    reunion?: {
        tipo: string
        descripcion?: string
        fechaReunion: string
        estado: string
    }
    fechaActual: string
}

export default function HeaderReunion({ reunion, fechaActual }: HeaderReunionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 rounded-3xl shadow-2xl p-8 border border-gray-100 w-full max-w-4xl mb-6 overflow-hidden"
        >
            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-0" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl -z-0" />

            {/* Borde animado */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                style={{ padding: '2px' }}>
                <div className="w-full h-full bg-white rounded-3xl" />
            </div>

            {/* Contenido */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Calendario */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-full md:w-1/3 flex justify-center"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full" />
                        <Calendario className="relative w-full max-w-xs drop-shadow-lg" />
                    </div>
                </motion.div>

                {/* Textos */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="w-full md:w-2/3 text-center md:text-left"
                >
                    <div className="w-full text-center md:text-left space-y-4">
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent">
                            Control de Asistencia
                        </h1>

                        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                            {/* Fecha actual */}
                            <div className={`w-full ${reunion ? 'md:w-1/2' : 'md:w-full'} flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100`}>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Fecha Actual</p>
                                    <p className="text-lg font-bold text-gray-800">{fechaActual}</p>
                                </div>
                            </div>

                            {/* Información de la reunión */}
                            {reunion && (
                                <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl p-4 shadow-lg">
                                    <h2 className="text-md font-semibold">{reunion.tipo}</h2>
                                    <p className="text-sm text-blue-100">{reunion.descripcion}</p>
                                    <p className="flex gap-2 items-center mt-2">
                                        <Clock className="w-4 h-4" />
                                        {new Date(reunion.fechaReunion).toLocaleTimeString('es-BO', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false,
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}