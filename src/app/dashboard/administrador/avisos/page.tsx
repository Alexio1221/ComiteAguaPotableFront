'use client'

import React, { useState, useEffect } from 'react'
import { PlusCircle } from 'lucide-react'
import ruta from '@/api/axios'
import toast from 'react-hot-toast'
import FormularioAvisos from './FormularioAvisos'
import AvisosNoticias from './AvisosNoticias'

interface Aviso {
  idNoticiaAviso: number
  titulo: string
  descripcion: string
  fechaVigencia: string
  fechaPublicacion: string
  imagen?: string
}

const AvisosAdmin: React.FC = () => {
  const [avisos, setAvisos] = useState<Aviso[]>([])

  // Cargar avisos
  useEffect(() => {
    const fetchAvisos = async () => {
      try {
        const res = await ruta.get('/avisos')
        setAvisos(res.data)
      } catch (error) {
        //console.error('Error al obtener avisos:', error)
        toast.error('No se pudieron cargar los avisos.')
      }
    }
    fetchAvisos()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <PlusCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Avisos / Noticias</h2>
              <p className="text-blue-100">Crea y gestiona los avisos o noticias de tu comité</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <FormularioAvisos avisos={avisos} setAvisos={setAvisos} />

        {/* Avisos Vigentes */}
        <AvisosNoticias avisos={avisos} setAvisos={setAvisos} />
      </div>
    </div>
  )
}

export default AvisosAdmin
