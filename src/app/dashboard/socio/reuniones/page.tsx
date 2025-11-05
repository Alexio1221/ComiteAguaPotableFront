'use client'

import React, { useEffect, useState } from 'react'
import { Users, Calendar, CheckCircle, XCircle, FileText, MapPin, Clock, AlertCircle, UserRoundCheck } from 'lucide-react'
import ruta from '@/api/axios'

interface Asistencia {
  idReunion: number
  estadoAsistencia: string
  registradoEn: string
  observacion?: string | null
  tipoReunion: string
  fechaReunion: string
  lugar: string
  motivo: string
  descripcion?: string
  estadoReunion: string
  documentoAsamblea: string
}

const ReunionesSocio: React.FC = () => {
  const [reuniones, setReuniones] = useState<Asistencia[]>([])

  useEffect(() => {
    const fetchConsumos = async () => {
      try {
        const { data } = await ruta.get("/avisos/reuniones-socio");

        setReuniones(data);
      } catch (error) {
        console.error("Error al obtener consumos:", error);
      }
    };

    fetchConsumos();
  }, []);

  const formatFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO)
    return fecha.toLocaleDateString('es-BO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatHora = (fechaISO: string) => {
    const fecha = new Date(fechaISO)
    return fecha.toLocaleTimeString('es-BO', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getEstadoAsistenciaConfig = (estado: string) => {
    switch (estado) {
      case 'PRESENTE':
        return {
          icon: CheckCircle,
          text: 'Presente',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
          iconColor: 'text-green-500',
        }
      case 'AUSENTE':
        return {
          icon: XCircle,
          text: 'Ausente',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          iconColor: 'text-red-500',
        }
      case 'JUSTIFICADO':
        return {
          icon: AlertCircle,
          text: 'Justificado',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-500',
        }
      default:
        return {
          icon: AlertCircle,
          text: estado,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-500',
        }
    }
  }

  const getEstadoReunionBadge = (estado: string) => {
    switch (estado) {
      case 'EN_PROCESO':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'FINALIZADA':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'PROGRAMADA':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  // Estadísticas
  const stats = {
    total: reuniones.length,
    presentes: reuniones.filter(r => r.estadoAsistencia === 'PRESENTE').length,
    ausentes: reuniones.filter(r => r.estadoAsistencia === 'AUSENTE').length,
    justificados: reuniones.filter(r => r.estadoAsistencia === 'JUSTIFICADO').length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header con estadísticas */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-xl p-6 md:p-8 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <Users className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Historial de Reuniones</h1>
              <p className="text-blue-100 mt-1">Tu participación en las asambleas</p>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-blue-100 text-sm">Total</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-green-100 text-sm">Presente</p>
              <p className="text-3xl font-bold mt-1">{stats.presentes}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-red-100 text-sm">Ausente</p>
              <p className="text-3xl font-bold mt-1">{stats.ausentes}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-yellow-100 text-sm">Justificado</p>
              <p className="text-3xl font-bold mt-1">{stats.justificados}</p>
            </div>
          </div>
        </div>

        {/* Lista de reuniones */}
        {reuniones.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tienes reuniones registradas</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reuniones.map((r) => {
              const asistenciaConfig = getEstadoAsistenciaConfig(r.estadoAsistencia)
              const IconoAsistencia = asistenciaConfig.icon

              return (
                <div
                  key={r.idReunion}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Header de la tarjeta */}
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-500 p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg mt-1">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-50 mb-1">
                              {r.motivo}
                            </h3>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoReunionBadge(r.estadoReunion)}`}>
                              {r.estadoReunion.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Badge de asistencia */}
                      <div className={`${asistenciaConfig.bgColor} ${asistenciaConfig.borderColor} border-2 rounded-xl p-3 flex items-center gap-2 self-start`}>
                        <IconoAsistencia className={`w-5 h-5 ${asistenciaConfig.iconColor}`} />
                        <span className={`font-semibold ${asistenciaConfig.textColor}`}>
                          {asistenciaConfig.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contenido de la tarjeta */}
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Información de la reunión */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-500 mb-2">Tipo de Reunión</p>
                          <p className="text-gray-800 font-medium">{r.tipoReunion}</p>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-gray-500">Fecha y Hora</p>
                            <p className="text-gray-800 font-medium">
                              {formatFecha(r.fechaReunion)}
                            </p>
                            <p className="text-gray-600 text-sm">{formatHora(r.fechaReunion)}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-gray-500">Lugar</p>
                            <p className="text-gray-800 font-medium">{r.lugar}</p>
                          </div>
                        </div>

                        {r.registradoEn && (
                          <div className="flex items-start gap-3">
                            <UserRoundCheck className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-gray-500">Hora de registro</p>
                              <p className="text-gray-800 font-medium">
                                {formatHora(r.registradoEn)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Descripción y documentos */}
                      <div className="space-y-4">
                        {r.descripcion && (
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <p className="text-sm font-semibold text-gray-500 mb-2">Descripción</p>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {r.descripcion}
                            </p>
                          </div>
                        )}

                        {r.observacion && (
                          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                            <p className="text-sm font-semibold text-yellow-700 mb-2">Observación</p>
                            <p className="text-yellow-800 text-sm italic">
                              {r.observacion}
                            </p>
                          </div>
                        )}

                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL}${r.documentoAsamblea}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 rounded-xl p-4 border border-blue-200 transition-colors group"
                        >
                          <div className="bg-blue-100 group-hover:bg-blue-200 p-2 rounded-lg transition-colors">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-blue-900">Ver Acta de Reunión</p>
                            <p className="text-xs text-blue-600">{r.documentoAsamblea}</p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReunionesSocio