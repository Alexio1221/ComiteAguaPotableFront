'use client'

import React, { useEffect, useState } from 'react'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ruta from '@/api/axios'

interface Comprobante {
    idComprobante: number
    montoBasico: number
    montoAdicional: number
    moraAcumulada: number
    totalPagar: number
    estadoPago: string
    fechaEmision: string
    fechaLimite: string
    operadorNombre: string
}

interface Lectura {
    idLectura: number
    idMedidor: number
    numeroMedidor: string
    ubicacionMedidor: string
    lecturaActual: number
    lecturaAnterior: number
    consumo: number
    fechaLectura: string
    observaciones: string
    estado: string
    comprobante: Comprobante | null
    nombreSocio: string
    apellidosSocio: string
}

const RevisionesOperador: React.FC = () => {
    const [lecturas, setLecturas] = useState<Lectura[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchLecturas = async () => {
            setLoading(true)
            try {
                const res = await ruta.get('servicios/lecturas/historial')
                setLecturas(res.data)
            } catch {
                toast.error('Error al cargar el historial de lecturas')
            } finally {
                setLoading(false)
            }
        }
        fetchLecturas()
    }, [])

    const getEstadoConfig = (estado: string) => {
        switch (estado) {
            case 'PENDIENTE':
                return { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Clock className="w-5 h-5 text-blue-500" /> }
            case 'PROCESADA':
                return { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle className="w-5 h-5 text-green-500" /> }
            case 'REVISADA':
                return { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: <CheckCircle className="w-5 h-5 text-indigo-500" /> }
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700', icon: <XCircle className="w-5 h-5 text-gray-500" /> }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
                    <h2 className="text-3xl font-bold">Historial de Lecturas</h2>
                    <p className="text-blue-100">Consulta todas las lecturas registradas y sus comprobantes</p>
                </div>

                {loading ? (
                    <p className="text-gray-500">Cargando lecturas...</p>
                ) : lecturas.length === 0 ? (
                    <p className="text-gray-500">No hay lecturas registradas.</p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {lecturas.map((l) => {
                            const estadoConfig = getEstadoConfig(l.estado)
                            return (
                                <div key={l.idLectura} className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200 hover:shadow-2xl transition-all">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-bold text-lg">{l.numeroMedidor} - {l.ubicacionMedidor}</h3>
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${estadoConfig.bg} ${estadoConfig.text} font-bold text-sm`}>
                                            {estadoConfig.icon} {l.estado}
                                        </div>
                                    </div>
                                    <p><strong>Socio:</strong> {l.nombreSocio} {l.apellidosSocio}</p>
                                    <p><strong>Lectura anterior:</strong> {l.lecturaAnterior}</p>
                                    <p><strong>Lectura actual:</strong> {l.lecturaActual}</p>
                                    <p><strong>Consumo:</strong> {l.consumo}</p>
                                    <p>
                                        <strong>Fecha de lectura:</strong>{' '}
                                        {new Date(l.fechaLectura).toLocaleDateString('es-BO', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            timeZone: 'America/La_Paz'
                                        })}
                                    </p>
                                    {l.observaciones && <p><strong>Observaciones:</strong> {l.observaciones}</p>}

                                    {l.comprobante && (
                                        <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                                            <p className="font-semibold">Comprobante</p>
                                            <p><strong>Operador:</strong> {l.comprobante.operadorNombre}</p>
                                            <p><strong>Monto Básico:</strong> {l.comprobante.montoBasico}</p>
                                            <p><strong>Monto Adicional:</strong> {l.comprobante.montoAdicional}</p>
                                            <p><strong>Mora:</strong> {l.comprobante.moraAcumulada}</p>
                                            <p><strong>Total a pagar:</strong> {l.comprobante.totalPagar}</p>
                                            <p><strong>Estado de pago:</strong> {l.comprobante.estadoPago}</p>
                                            <p>
                                                <strong>Fecha de lectura:</strong>{' '}
                                                {new Date(l.comprobante.fechaLimite).toLocaleDateString('es-BO', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    timeZone: 'America/La_Paz'
                                                })}
                                            </p>

                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default RevisionesOperador
