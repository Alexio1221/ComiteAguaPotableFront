'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Calendar, Clock, MapPin, FileText, Image, Upload, Save } from 'lucide-react'
import ruta from '@/api/axios'
import { Reunion, TipoReunion } from './tipos'

interface Props {
    onCreated: (reunion: Reunion) => void
}

const ReunionForm: React.FC<Props> = ({ onCreated }) => {
    const [tipoReunion, setTipoReunion] = useState<TipoReunion[]>([])
    const [tipoReunionSeleccionado, setTipoReunionSeleccionado] = useState<number | "">("");
    const [fecha, setFecha] = useState('')
    const [hora, setHora] = useState('')
    const [lugar, setLugar] = useState('')
    const [motivo, setMotivo] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [documento, setDocumento] = useState<File | null>(null)
    const [imagenAviso, setImagenAviso] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchReuniones = async () => {
            try {
                const tipoReunion = await ruta.get('/servicios/tarifas-reunion')
                setTipoReunion(tipoReunion.data)
            } catch {
                toast.error('No se pudieron cargar las reuniones.')
            } finally {
                setLoading(false)
            }
        }
        fetchReuniones()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!fecha || !hora || !lugar || !motivo || !descripcion) {
            toast.error('Completa todos los campos obligatorios')
            return
        }

        setLoading(true)
        try {
            const formDataReuniones = new FormData()
            formDataReuniones.append('tipoReunion', tipoReunionSeleccionado.toString())
            formDataReuniones.append('fecha', fecha)
            formDataReuniones.append('hora', hora)
            formDataReuniones.append('lugar', lugar)
            formDataReuniones.append('motivo', motivo)
            formDataReuniones.append('descripcion', descripcion)
            if (documento) formDataReuniones.append('documentoAsamblea', documento)

            const formDataAvisos = new FormData()
            formDataAvisos.append('titulo', motivo)
            formDataAvisos.append('descripcion', descripcion)
            formDataAvisos.append('fechaVigencia', fecha)
            if (imagenAviso) formDataAvisos.append('imagen', imagenAviso)

            const resReunion = await ruta.post('/avisos/reunion', formDataReuniones)
            await ruta.post('/avisos', formDataAvisos),

                onCreated(resReunion.data)
            toast.success('Reunión y aviso creados correctamente.')

            setTipoReunionSeleccionado("")
            setFecha('')
            setHora('')
            setLugar('')
            setMotivo('')
            setDescripcion('')
            setDocumento(null)
            setImagenAviso(null)
        } catch (error: any) {
            toast.error(error.response?.data?.mensaje || 'Error al crear reunión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tipo de reunión */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Reunión *
                </label>
                <select
                    value={tipoReunionSeleccionado}
                    onChange={(e) => setTipoReunionSeleccionado(Number(e.target.value))}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                >
                    <option value="">Seleccionar tipo de reunión</option>
                    {tipoReunion.map((t) => (
                        <option key={t.idTarifaReunion} value={t.idTarifaReunion}>
                            {t.nombreReunion}
                        </option>
                    ))}
                </select>
            </div>

            {/* Grid para Fecha y Hora */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="inline mr-1" size={16} /> Fecha *
                    </label>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        min={new Date().toLocaleDateString('en-CA')}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Clock className="inline mr-1" size={16} /> Hora *
                    </label>
                    <input
                        type="time"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                    />
                </div>
            </div>

            {/* Lugar */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="inline mr-1" size={16} /> Lugar *
                </label>
                <input
                    type="text"
                    value={lugar}
                    onChange={(e) => setLugar(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                    placeholder="Ej: Oficinas principales, Salón comunal..."
                />
            </div>

            {/* Motivo */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="inline mr-1" size={16} /> Motivo *
                </label>
                <input
                    type="text"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="Ej: Aprobación presupuesto, coordinación de mantenimiento..."
                />
            </div>

            {/* Descripción */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción *
                </label>
                <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                    placeholder="Detalles de la reunión/asamblea..."
                    rows={4}
                />
            </div>

            {/* Archivos opcionales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Upload className="inline mr-1" size={16} /> Documento (opcional)
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            onChange={(e) => setDocumento(e.target.files?.[0] || null)}
                            className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 file:font-semibold hover:file:bg-blue-200"
                        />
                    </div>
                    {documento && (
                        <p className="text-xs text-green-600 mt-1">✓ {documento.name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Image className="inline mr-1" size={16} /> Imagen aviso (opcional)
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImagenAviso(e.target.files?.[0] || null)}
                            className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-100 file:text-cyan-700 file:font-semibold hover:file:bg-cyan-200"
                        />
                    </div>
                    {imagenAviso && (
                        <p className="text-xs text-green-600 mt-1">✓ {imagenAviso.name}</p>
                    )}
                </div>
            </div>

            {/* Botón de envío */}
            <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creando...
                    </>
                ) : (
                    <>
                        <Save size={20} />
                        Crear Reunión
                    </>
                )}
            </motion.button>
        </form>
    )
}

export default ReunionForm