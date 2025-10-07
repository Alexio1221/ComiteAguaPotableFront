'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import ruta from '@/api/axios' // tu instancia de Axios
import toast from 'react-hot-toast'

type Noticia = {
  idNoticiaAviso: number
  titulo: string
  descripcion: string
  fechaPublicacion: string
  imagen?: string
}

const NoticiasAvisosCarrusel: React.FC = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)

  // Obtener avisos/noticias desde la API
  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const res = await ruta.get('/avisos')
        setNoticias(res.data)
      } catch (error) {
        toast.error('No se pudieron cargar las noticias o avisos.')
      }
    }
    fetchNoticias()
  }, [])

  // Cambiar slide automáticamente
  useEffect(() => {
    if (isPaused || noticias.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % noticias.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isPaused, noticias])

  const nextSlide = () => {
    if (noticias.length > 0) setCurrentIndex((prev) => (prev + 1) % noticias.length)
  }

  const prevSlide = () => {
    if (noticias.length > 0) setCurrentIndex((prev) => (prev - 1 + noticias.length) % noticias.length)
  }

  const togglePause = () => setIsPaused(!isPaused)

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowImageModal(true)
  }

  // Formatear fecha en español
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-BO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Imagen por defecto si no hay imagen en el aviso
  const obtenerImagen = (imagen?: string) => {
    return imagen ? `${process.env.NEXT_PUBLIC_API_URL}${imagen}` : '/imagenes/imagenDefault.jpg'
  }

  return (
    <div className="p-6">
      <h3 className="text-3xl font-bold text-sky-800 mb-8 text-center">
        Últimas Noticias y Avisos
      </h3>

      {noticias.length === 0 ? (
        <div className="text-center text-gray-500 bg-white shadow-lg rounded-xl p-10">
          No hay noticias disponibles por el momento.
        </div>
      ) : (
        <div className="relative max-w-[80%] mx-auto">
          <div
            className={`bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 ${
              isPaused ? 'ring-4 ring-cyan-400 ring-offset-2' : ''
            }`}
            onClick={togglePause}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <img
                    src={obtenerImagen(noticias[currentIndex].imagen)}
                    alt={noticias[currentIndex].titulo}
                    className="w-full h-[500px] object-cover cursor-zoom-in hover:opacity-90 transition-opacity"
                    onClick={handleImageClick}
                  />
                  {isPaused ? (
                    <div className="absolute top-4 right-4 bg-cyan-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                      <Pause className="w-4 h-4" />
                      Pausado
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4" />
                      Click para pausar
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h4 className="text-2xl font-bold text-sky-800 mb-2">
                    {noticias[currentIndex].titulo}
                  </h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Fecha de publicación: {formatearFecha(noticias[currentIndex].fechaPublicacion)}
                  </p>
                  <p className="text-gray-600">{noticias[currentIndex].descripcion}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Botones de navegación */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevSlide()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition"
          >
            <ChevronLeft className="w-6 h-6 text-sky-800" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextSlide()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition"
          >
            <ChevronRight className="w-6 h-6 text-sky-800" />
          </button>

          {/* Indicadores */}
          <div className="flex justify-center gap-2 mt-6">
            {noticias.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(index)
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-8 bg-sky-600' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showImageModal && noticias.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-6xl max-h-[90vh]">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-4xl font-bold"
            >
              ×
            </button>
            <img
              src={obtenerImagen(noticias[currentIndex].imagen)}
              alt={noticias[currentIndex].titulo}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default NoticiasAvisosCarrusel
