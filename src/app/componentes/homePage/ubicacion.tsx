'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Phone } from 'lucide-react'

const Ubicacion: React.FC = () => {
    return (
        <div className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500">
            {/* Decoración de fondo con ondas */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-3xl opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-300 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400 rounded-full blur-3xl opacity-10"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Título */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block mb-4 bg-white p-4 rounded-full shadow-xl">
                        <MapPin className="w-12 h-12 text-blue-600" />
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                        Nuestra Ubicación
                    </h2>
                    <p className="text-blue-50 text-lg max-w-2xl mx-auto">
                        Visítanos en nuestra oficina o contáctanos para más información
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Información de la oficina */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        {/* Imagen de la oficina - Ahora primero y más grande */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-500">
                            <img
                                src="/imagenes/ubicacionComite.jpg"
                                alt="Oficina del Comité"
                                className="w-full h-72 object-cover"
                            />
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4">
                                <h3 className="text-xl font-bold text-white text-center">
                                    Oficina del Comité de Agua Potable
                                </h3>
                            </div>
                        </div>

                        {/* Tarjetas informativas */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 hover:shadow-2xl transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Fácil Acceso</h4>
                                    <p className="text-gray-600 text-sm">
                                        Ubicados en una zona de fácil acceso con transporte público cercano
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100 hover:shadow-2xl transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
                                    <Clock className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Horario</h4>
                                    <p className="text-gray-600 text-sm">
                                        Atención los días sábados de 8:00 a.m. a 1:00 p.m.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100 hover:shadow-2xl transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 p-3 rounded-xl flex-shrink-0">
                                    <Phone className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <a href="#nosotros">
                                        <h4 className="font-bold text-gray-800 mb-2 text-lg">Atención Personalizada</h4>
                                        <p className="text-gray-600 text-sm">
                                            Nuestro equipo está disponible para atenderte y resolver tus dudas
                                        </p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Mapa de Google */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden h-full border-4 border-white">
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-5">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <MapPin className="w-6 h-6" />
                                    Encuéntranos en el Mapa
                                </h3>
                                <p className="text-blue-50 text-sm mt-1">
                                    Haz clic para abrir en Google Maps y obtener direcciones
                                </p>
                            </div>
                            <div className="relative w-full h-[700px]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d951.7845470604128!2d-65.98504473036922!3d-17.405154719267514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDI0JzE4LjYiUyA2NcKwNTknMDMuOCJX!5e0!3m2!1ses!2sbo!4v1759277674181!5m2!1ses!2sbo"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Ubicacion