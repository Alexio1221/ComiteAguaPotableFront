'use client'

import React from 'react'
import { Bell, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
import NoticiasAvisosCarrusel from '@/app/componentes/homePage/noticiasYavisos'

interface Aviso {
  id: number
  titulo: string
  descripcion: string
  fecha: string
  tipo: 'pago' | 'personal'
}

const AvisosSocio: React.FC = () => {
  // Ejemplo: avisos específicos del socio
  const avisosSocio: Aviso[] = [
    {
      id: 1,
      titulo: 'Recordatorio de Pago',
      descripcion: 'Tienes facturas pendientes, evita recargos pagando antes del 10 de Octubre.',
      fecha: '01/10/2025',
      tipo: 'pago',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <Bell className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Avisos del Socio</h2>
                <p className="text-blue-100">Revisa recordatorios y notificaciones personales</p>
              </div>
            </div>
          </div>
        </div>

        {/* Avisos del socio */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          {avisosSocio.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-500 py-10">
              <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
              <p className="text-lg font-semibold">No tienes avisos pendientes</p>
              <p className="text-sm">Todo está al día 👍</p>
            </div>
          ) : (
            <div className="space-y-4">
              {avisosSocio.map((aviso, index) => (
                <div
                  key={aviso.id}
                  className="bg-gray-50 border-l-4 border-orange-400 rounded-xl p-4 hover:bg-gray-100 hover:shadow-md transition-all duration-300"
                  style={{ animation: `fadeInUp 0.5s ease-out ${0.1 * index}s both` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{aviso.titulo}</h3>
                      <p className="text-sm text-gray-600 mt-1">{aviso.descripcion}</p>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={14} /> {aviso.fecha}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avisos generales del comité */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-blue-700 mb-4">
            <AlertCircle /> Avisos Generales del Comité
          </h2>
          <NoticiasAvisosCarrusel />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default AvisosSocio
