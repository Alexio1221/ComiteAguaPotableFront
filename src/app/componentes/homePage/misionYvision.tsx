'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Target, Eye, Droplet, Users, Shield, Leaf } from 'lucide-react'

const MisionVision: React.FC = () => {
    return (
        <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-20"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Título principal */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block mb-4">
                        <Droplet className="w-12 h-12 text-blue-600 mx-auto" />
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 mb-4">
                        Nuestro Compromiso
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Trabajamos cada día por garantizar el acceso al agua potable de calidad
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Misión */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="bg-white rounded-3xl shadow-xl p-8 h-full border-t-4 border-blue-600 hover:shadow-2xl transition-shadow">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
                                    <Target className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-800">Misión</h3>
                            </div>

                            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                Nuestra misión es <strong className="text-blue-600">garantizar agua potable de calidad</strong> para todos los socios, con <strong className="text-blue-600">transparencia</strong>, <strong className="text-blue-600">participación comunitaria</strong> y un <strong className="text-blue-600">uso sostenible</strong> del recurso hídrico.
                            </p>

                            {/* Valores clave de la misión */}
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                                    <Droplet className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Servicio Permanente</h4>
                                        <p className="text-sm text-gray-600">Agua potable de forma eficaz para todos los socios</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Transparencia</h4>
                                        <p className="text-sm text-gray-600">Gestión clara y participación comunitaria activa</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                                    <Leaf className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Sostenibilidad</h4>
                                        <p className="text-sm text-gray-600">Uso responsable del recurso hídrico</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Visión */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="bg-white rounded-3xl shadow-xl p-8 h-full border-t-4 border-cyan-600 hover:shadow-2xl transition-shadow">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-4 rounded-2xl shadow-lg">
                                    <Eye className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-800">Visión</h3>
                            </div>

                            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                Ser una organización <strong className="text-cyan-600">sólida y sostenible</strong>, reconocida por su <strong className="text-cyan-600">compromiso social</strong>, <strong className="text-cyan-600">transparencia</strong> y <strong className="text-cyan-600">cuidado del medio ambiente</strong>, asegurando agua de calidad para las futuras generaciones.
                            </p>
                            {/* Pilares de la visión */}
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 bg-cyan-50 p-3 rounded-lg">
                                    <Users className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Compromiso Social</h4>
                                        <p className="text-sm text-gray-600">Reconocidos por nuestro servicio a la comunidad</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 bg-cyan-50 p-3 rounded-lg">
                                    <Leaf className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Cuidado Ambiental</h4>
                                        <p className="text-sm text-gray-600">Preservando el recurso para futuras generaciones</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 bg-cyan-50 p-3 rounded-lg">
                                    <Target className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Desarrollo Integral</h4>
                                        <p className="text-sm text-gray-600">Contribuyendo al progreso de toda la zona</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default MisionVision