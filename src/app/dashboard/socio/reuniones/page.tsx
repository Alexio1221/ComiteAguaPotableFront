'use client'

import React, { useState } from 'react'
import { Users, Calendar, CheckCircle, XCircle, FileText } from 'lucide-react'

interface Reunion {
  id: number
  fecha: string
  hora: string
  motivo: string
  lugar: string
  estado: 'Realizada' | 'Programada' | 'Cancelada'
  asistio?: boolean
  acta?: string
}

const ReunionesSocio: React.FC = () => {
  const [reuniones] = useState<Reunion[]>([
    {
      id: 1,
      fecha: '10/10/2025',
      hora: '19:00',
      motivo: 'Planificación de presupuesto 2026',
      lugar: 'Salón Comunal',
      estado: 'Programada',
    },
    {
      id: 2,
      fecha: '20/09/2025',
      hora: '18:00',
      motivo: 'Revisión de proyectos de ampliación de red',
      lugar: 'Sede del Comité',
      estado: 'Realizada',
      asistio: true,
      acta: '/docs/acta-20-09-2025.pdf',
    },
    {
      id: 3,
      fecha: '05/08/2025',
      hora: '17:00',
      motivo: 'Elección de nueva directiva',
      lugar: 'Sede del Comité',
      estado: 'Realizada',
      asistio: false,
      acta: '/docs/acta-05-08-2025.pdf',
    },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Reuniones</h2>
              <p className="text-blue-100">Historial y próximos encuentros del comité</p>
            </div>
          </div>
        </div>

        {/* Historial de reuniones */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-blue-700">Historial de Reuniones</h3>
          
          {reuniones.length === 0 ? (
            <p className="text-gray-500">No tienes reuniones registradas.</p>
          ) : (
            <div className="space-y-3">
              {reuniones.map((r) => (
                <div 
                  key={r.id} 
                  className="bg-gray-50 border rounded-xl p-4 hover:bg-gray-100 transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{r.motivo}</p>
                      <p className="text-sm text-gray-600">
                        <Calendar className="inline w-4 h-4 mr-1 text-blue-500" />
                        {r.fecha} – {r.hora} | {r.lugar}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Estado: {r.estado}</p>
                      
                      {r.estado === 'Realizada' && (
                        <p className="text-sm mt-1">
                          Asistencia: {r.asistio ? (
                            <span className="text-green-600 font-semibold flex items-center gap-1">
                              <CheckCircle className="w-4 h-4"/> Sí asistió
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold flex items-center gap-1">
                              <XCircle className="w-4 h-4"/> No asistió
                            </span>
                          )}
                        </p>
                      )}
                      
                      {r.acta && (
                        <a 
                          href={r.acta} 
                          target="_blank" 
                          className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          <FileText className="w-4 h-4"/> Ver Acta
                        </a>
                      )}
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      r.estado === 'Programada' 
                        ? 'bg-blue-100 text-blue-700' 
                        : r.estado === 'Cancelada' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                    }`}>
                      {r.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReunionesSocio
