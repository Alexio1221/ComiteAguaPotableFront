'use client'

import React, { useEffect, useState } from 'react'
import { FileText, Clock, MessageCircle, CheckCircle, XCircle, Upload, Send } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ruta from '@/api/axios'

interface Reclamo {
  idReclamo: number
  motivo: string
  descripcion: string
  imagenURL: string
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTO' | 'RECHAZADO'
  fechaCreacion: string
}

const ReclamosSocio: React.FC = () => {
  const [motivo, setMotivo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [imagen, setImagen] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [reclamos, setReclamos] = useState<Reclamo[]>([])
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null)

  useEffect(() => {
    const obtener = async () => {
      try {
        const res = await ruta.get('/reclamos/reclamos')
        setReclamos(res.data)
      } catch {
        toast.error('Error al cargar los reclamos')
      }
    }
    obtener()
  }, [])

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagen(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!motivo || !descripcion || !imagen) {
      toast.error('Completa todos los campos y selecciona una imagen')
      return
    }

    try {
      const formData = new FormData()
      formData.append('motivo', motivo)
      formData.append('descripcion', descripcion)
      formData.append('imagen', imagen)

      const res = await ruta.post('/reclamos/nuevo-reclamo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setReclamos([res.data, ...reclamos])
      setMotivo('')
      setDescripcion('')
      setImagen(null)
      setPreview(null)
      toast.success('Reclamo enviado correctamente')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al enviar el reclamo')
    }
  }

  const getEstadoConfig = (estado: Reclamo['estado']) => {
    switch (estado) {
      case 'PENDIENTE':
        return { icon: <Clock className="w-4 h-4" />, text: 'Pendiente', color: 'text-cyan-700', bg: 'bg-cyan-100' }
      case 'EN_PROCESO':
        return { icon: <MessageCircle className="w-4 h-4" />, text: 'En Proceso', color: 'text-blue-700', bg: 'bg-blue-100' }
      case 'RESUELTO':
        return { icon: <CheckCircle className="w-4 h-4" />, text: 'Resuelto', color: 'text-teal-700', bg: 'bg-teal-100' }
      case 'RECHAZADO':
        return { icon: <XCircle className="w-4 h-4" />, text: 'Rechazado', color: 'text-red-600', bg: 'bg-red-100' }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl shadow-xl p-6 flex items-center gap-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl"></div>
          <div className="relative bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <FileText className="w-8 h-8" />
          </div>
          <div className="relative">
            <h1 className="text-3xl font-bold">Reclamos</h1>
            <p className="text-cyan-100">Gestiona tus reclamos con evidencia fotográfica</p>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-100 p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 bg-gradient-to-b from-cyan-600 to-teal-600 rounded-full"></div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-700 to-teal-700 bg-clip-text text-transparent">
              Nuevo Reclamo
            </h2>
          </div>

          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Motivo del reclamo"
            className="w-full p-3 border-2 rounded-xl border-cyan-200 focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 focus:outline-none transition-all bg-gradient-to-br from-white to-cyan-50/30"
          />
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción detallada del problema"
            rows={3}
            className="w-full p-3 border-2 rounded-xl border-cyan-200 focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 focus:outline-none resize-none transition-all bg-gradient-to-br from-white to-cyan-50/30"
          />

          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-cyan-600 hover:to-teal-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
              <Upload className="w-5 h-5" /> {preview ? 'Cambiar Imagen' : 'Subir Imagen'}
              <input type="file" accept="image/*" onChange={handleImagenChange} className="hidden" />
            </label>
            {preview && (
              <img 
                src={preview} 
                alt="Preview" 
                className="w-24 h-24 object-cover rounded-xl border-2 border-cyan-300 shadow-md" 
              />
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 text-white px-4 py-3 rounded-xl hover:from-cyan-700 hover:via-blue-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" /> Enviar Reclamo
          </button>
        </div>

        {/* Historial */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-8 bg-gradient-to-b from-cyan-600 to-teal-600 rounded-full"></div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-700 to-teal-700 bg-clip-text text-transparent">
              Historial de Reclamos
            </h2>
          </div>
          
          {reclamos.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-full mb-4">
                <FileText className="w-8 h-8 text-cyan-600" />
              </div>
              <p className="text-gray-500 text-lg">No has realizado ningún reclamo todavía.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reclamos.map((r) => {
                const estado = getEstadoConfig(r.estado)
                return (
                  <div 
                    key={r.idReclamo} 
                    className="bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all border-2 border-cyan-100 hover:border-cyan-300"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold bg-gradient-to-r from-cyan-700 to-teal-700 bg-clip-text text-transparent">
                        {r.motivo}
                      </h3>
                      <div className={`${estado.bg} ${estado.color} px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 font-semibold shadow-sm`}>
                        {estado.icon} {estado.text}
                      </div>
                    </div>
                    <p className="text-sm text-cyan-800 mb-3 line-clamp-3">{r.descripcion}</p>
                    {r.imagenURL && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${r.imagenURL}`}
                        alt="Evidencia"
                        className="w-full h-40 object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300 border-2 border-cyan-200 shadow-md"
                        onClick={() => setImagenAmpliada(`${process.env.NEXT_PUBLIC_API_URL}${r.imagenURL}`)}
                      />
                    )}
                    <div className="flex items-center gap-2 mt-3 text-xs text-cyan-600 bg-white/50 px-3 py-1.5 rounded-full w-fit">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(r.fechaCreacion).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      {/* Modal imagen */}
      {imagenAmpliada && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-cyan-900/90 via-blue-900/90 to-teal-900/90 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
          onClick={() => setImagenAmpliada(null)}
        >
          <div className="relative">
            <img
              src={imagenAmpliada}
              alt="Vista ampliada"
              className="max-h-[90vh] w-auto object-contain rounded-2xl shadow-2xl border-4 border-white"
            />
            <button 
              className="absolute -top-4 -right-4 bg-white hover:bg-gray-100 text-cyan-700 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110"
              onClick={() => setImagenAmpliada(null)}
            >
              <XCircle className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReclamosSocio