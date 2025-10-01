'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Phone, Award } from 'lucide-react'

type Integrante = {
    id: number
    nombre: string
    cargo: string
    funcion: string
    contacto: string
    imagen: string
}

const integrantes: Integrante[] = [
    {
        id: 1,
        nombre: 'María López',
        cargo: 'Presidenta',
        funcion: 'Representa al comité y toma decisiones clave.',
        contacto: '71234567',
        imagen: 'https://ui-avatars.com/api/?name=Maria+Lopez&background=0284c7&color=fff&size=200',
    },
    {
        id: 2,
        nombre: 'Carlos Gómez',
        cargo: 'Secretario',
        funcion: 'Encargado de la documentación y actas.',
        contacto: '76543210',
        imagen: 'https://ui-avatars.com/api/?name=Carlos+Gomez&background=0284c7&color=fff&size=200',
    },
    {
        id: 3,
        nombre: 'Sofia Torres',
        cargo: 'Tesorera',
        funcion: 'Maneja los fondos y reportes económicos del comité.',
        contacto: '78901234',
        imagen: '/imagenes/sofia.jpg',   
    },
]

export default function Nosotros() {
    return (
        <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
            {/* Decoración de fondo */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Título mejorado */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block mb-4">
                        <Award className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 mb-4">
                        Mesa Directiva
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Conoce al equipo comprometido con la gestión transparente del agua potable en nuestra comunidad
                    </p>
                </motion.div>

                {/* Grid de tarjetas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    {integrantes.map((persona, index) => (
                        <motion.div
                            key={persona.id}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: index * 0.15, duration: 0.6, ease: 'easeOut' }}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="w-full max-w-sm"
                        >
                            <div className="relative group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                                {/* Barra superior decorativa */}
                                <div className="h-2 bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500"></div>
                                
                                {/* Contenido */}
                                <div className="p-8">
                                    {/* Imagen con efecto */}
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                        <img
                                            src={persona.imagen}
                                            alt={persona.nombre}
                                            className="relative w-32 h-32 mx-auto rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-all"
                                        />
                                        {/* Badge del cargo */}
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                                            <span className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                                {persona.cargo}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Nombre */}
                                    <h3 className="text-2xl font-bold text-gray-800 text-center mt-8 mb-2">
                                        {persona.nombre}
                                    </h3>

                                    {/* Función */}
                                    <p className="text-gray-600 text-sm text-center mb-6 min-h-[3rem]">
                                        {persona.funcion}
                                    </p>

                                    {/* Contacto */}
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-center gap-3 text-gray-700 hover:text-blue-600 transition-colors">
                                            <Phone className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-medium">{persona.contacto}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Efecto de brillo en hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-transparent to-cyan-400/0 group-hover:from-blue-400/5 group-hover:to-cyan-400/5 transition-all duration-500 pointer-events-none"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}