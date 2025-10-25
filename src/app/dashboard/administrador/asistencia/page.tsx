'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ruta from '@/api/axios'
import toast from 'react-hot-toast'
import AsistenciaQR from './AsistenciaQR'
import TablaAsistencia from './TablaAsistencia'

interface Reunion {
    id: string
    titulo: string
    descripcion?: string
    fecha: string
    hora: string
}

export default function Page() {
    const [cameraAvailable, setCameraAvailable] = useState<boolean | null>(null)
    const [fecha, setFecha] = useState('')
    const [reunion, setReunion] = useState<Reunion | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const hoy = new Date()
        const formato = hoy.toLocaleDateString('es-BO', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        setFecha(formato)

        verificarCamara()
        obtenerReunionHoy()
    }, [])

    const verificarCamara = async () => {
        try {
            if (!navigator.mediaDevices?.enumerateDevices) throw new Error('No hay cámara disponible')
            const devices = await navigator.mediaDevices.enumerateDevices()
            setCameraAvailable(devices.some((d) => d.kind === 'videoinput'))
        } catch {
            setCameraAvailable(false)
        }
    }

    const obtenerReunionHoy = async () => {
        try {
            setLoading(true)
            const { data } = await ruta.get('/avisos/reuniones/hoy')
            setReunion(data?.reuniones || null)
        } catch (err) {
            toast.error('Error al obtener la reunión de hoy.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6 flex flex-col items-center"
        >
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 w-full max-w-4xl mb-6"
            >
                <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Control de Asistencia</h1>
                <p className="text-center text-gray-600">Fecha actual: {fecha}</p>
            </motion.div>

            {loading ? (
                <div className="text-gray-500 mt-6 animate-pulse">Cargando reunión...</div>
            ) : reunion ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full max-w-4xl space-y-6"
                >
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl shadow-lg p-5">
                        <h2 className="text-xl font-semibold">{reunion.titulo}</h2>
                        <p className="text-sm text-blue-100">{reunion.descripcion}</p>
                        <p className="mt-2 text-blue-50 text-sm">
                            📅 {reunion.fecha} ⏰ {reunion.hora}
                        </p>
                    </div>

                    {cameraAvailable ? (
                        <AsistenciaQR
                            meetingId={reunion.id}
                            fecha={fecha}
                            onCameraError={() => setCameraAvailable(false)}
                            onSuccess={() => obtenerReunionHoy()}
                        />
                    ) : (
                        <div className="text-center text-red-500 font-medium bg-white rounded-xl p-4 shadow-md">
                            ⚠️ No se pudo acceder a la cámara.
                            <br />
                            Habilita el permiso y recarga la página.
                        </div>
                    )}

                    <TablaAsistencia fecha={fecha} reunionId={reunion.id} />
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-700"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-2">No hay reunión programada para hoy</h2>
                    <p className="text-gray-500">Aún no se han programado reuniones para hoy.</p>
                </motion.div>
            )}
        </motion.div>
    )
}
