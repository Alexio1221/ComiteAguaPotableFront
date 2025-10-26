'use client'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import ruta from '@/api/axios'
import toast from 'react-hot-toast'
import AsistenciaQR from './AsistenciaQR'
import TablaAsistencia from './TablaAsistencia'
import { PerroDurmiendo, PerroEsperando, Calendario, Cargando } from '@/animaciones/Animaciones'
import { Calendar, Clock } from 'lucide-react'
import HeaderReunion from './HeaderReunion'

interface Reunion {
    idReunion: string
    tipo: string
    descripcion?: string
    fechaReunion: string
    estado: string
}

export default function Page() {
    const [cameraAvailable, setCameraAvailable] = useState<boolean | null>(null)

    const [reunion, setReunion] = useState<Reunion | null>(null)
    const [loading, setLoading] = useState(true)
    const [tipoReunion, setTipoReunion] = useState('')
    const [tiempoParaInicio, setTiempoParaInicio] = useState(0)
    const [tiempoParaFin, setTiempoParaFin] = useState(0)
    const [enCurso, setEnCurso] = useState(false)
    const [fecha, setFecha] = useState('')
    const HORAS = 0.05  //Cuantas horas durara la reunion
    const DURACION_REUNION = HORAS * 60 * 60 * 1000

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
            if (!navigator.mediaDevices?.enumerateDevices)
                throw new Error('No hay cámara disponible')
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
            setReunion(data?.reuniones?.[0] || null)
            setTipoReunion(data?.tipo || 'ninguna')
        } catch {
            toast.error('Error al obtener la reunión de hoy.')
        } finally {
            setLoading(false)
        }
    }

    const estadoRef = useRef(reunion?.estado || 'PENDIENTE');

    useEffect(() => {
        if (!reunion) return;

        const inicio = new Date(reunion.fechaReunion).getTime();
        const fin = inicio + DURACION_REUNION;

        const interval = setInterval(async () => {
            const ahora = Date.now();
            const faltaInicio = inicio - ahora;
            const faltaFin = fin - ahora;

            setTiempoParaInicio(faltaInicio > 0 ? faltaInicio : 0);
            setTiempoParaFin(faltaFin > 0 && faltaInicio <= 0 ? faltaFin : 0);

            let nuevoEstado: string | null = null;

            if (faltaInicio <= 0 && faltaFin > 0 && estadoRef.current !== 'EN_PROCESO') {
                nuevoEstado = 'EN_PROCESO';
                setEnCurso(true);
            } else if (faltaFin <= 0 && estadoRef.current !== 'FINALIZADO') {
                nuevoEstado = 'FINALIZADO';
                setEnCurso(false);
            }

            if (nuevoEstado) {
                estadoRef.current = nuevoEstado;
                try {
                    const { data } = await ruta.put(`/avisos/reuniones/${reunion.idReunion}/estado`, { estado: nuevoEstado });
                    toast.success(data?.mensaje || 'Estado actualizado: ' + nuevoEstado);
                } catch (error: any) {
                    toast.error(error.response?.data?.mensaje || 'Error al actualizar estado front');
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [reunion]);

    const formatTime = (ms: number) => {
        const totalSeg = Math.floor(ms / 1000)
        const horas = Math.floor(totalSeg / 3600)
        const minutos = Math.floor((totalSeg % 3600) / 60)
        const segundos = totalSeg % 60
        return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6 flex flex-col items-center"
        >
            {/* Header */}
            <HeaderReunion reunion={reunion && enCurso ? reunion : reunion?.estado === 'FINALIZADO' ? reunion : undefined} fechaActual={fecha} />

            {loading ? (
                <div className="text-gray-500 mt-6 animate-pulse">Cargando reunión...</div>
            ) : tipoReunion === 'ninguna' ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-8 text-center text-gray-700"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                        No hay reunión programada para hoy
                    </h2>
                    <p className="text-gray-500">
                        Aún no se han programado reuniones para hoy.
                    </p>
                    <PerroDurmiendo className='max-w-sm mx-auto' />
                </motion.div>
            ) : tipoReunion === 'hoy' && reunion ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full max-w-4xl space-y-6"
                >
                    {/* cronómetro dinámico */}
                    <div className="text-center mt-4">
                        {tiempoParaInicio > 0 ? (
                            <div className="flex items-center gap-3 justify-center">
                                <Cargando className="w-16 h-16" />
                                <p className="text-lg font-medium text-gray-700">
                                    La reunión comenzara en: {formatTime(tiempoParaInicio)}
                                </p>
                            </div>
                        ) : tiempoParaFin > 0 ? (
                            <p className="text-lg font-medium text-green-600">
                                🟢 En curso — Tiempo restante: {formatTime(tiempoParaFin)}
                            </p>
                        ) : (
                            <p className="text-lg font-medium text-red-500">
                                🛑 Reunión finalizada
                            </p>
                        )}
                    </div>

                    {/* cámara y tabla solo si está en curso */}
                    {enCurso && cameraAvailable ? (
                        <>
                            <AsistenciaQR
                                meetingId={reunion.idReunion}
                                onCameraError={() => setCameraAvailable(false)}
                                onSuccess={() => obtenerReunionHoy()}
                            />
                            <TablaAsistencia reunionId={reunion.idReunion} />
                        </>
                    ) : !enCurso && tiempoParaInicio > 0 ? (
                        <div className="text-center text-gray-500 font-medium bg-white rounded-xl p-4 shadow-md">
                            La reunión aún no comienza.
                            <br />
                            La cámara se habilitará al iniciar.
                        </div>
                    ) : (
                        <PerroDurmiendo className="max-w-sm mx-auto" />
                    )}
                </motion.div>
            ) : tipoReunion === 'proxima' && reunion ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl shadow-md p-8 text-center items-center text-gray-700 max-w-4xl w-full"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                        Próxima reunión programada
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {reunion.tipo} — {reunion.descripcion}
                    </p>
                    <p className="text-blue-600 font-medium flex gap-2 justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        {new Date(reunion.fechaReunion).toLocaleDateString('es-BO', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        })}
                        <Clock className="w-4 h-4 text-blue-600" />
                        {new Date(reunion.fechaReunion).toLocaleTimeString('es-BO', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        })}
                    </p>
                    <PerroEsperando className="max-w-sm mx-auto" />
                    <p className="text-gray-500 mt-2">Aún no puedes registrar asistencia.</p>
                </motion.div>
            ) : (
                <div className="text-gray-500">Sin información disponible</div>
            )}
        </motion.div>
    )
}
