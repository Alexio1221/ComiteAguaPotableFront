"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, User, Phone, Lock, Shield, Save, Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"
import { Medidor, MedidorFormData } from "../types/medidor"
import { toast } from "react-hot-toast"
import Select from 'react-select';
import dynamic from "next/dynamic";

const MapaDelimitado = dynamic(() => import("../../mapa/MapaDelimitado"), { ssr: false });

interface ModalMedidorProps {
    isOpen: boolean
    onClose: () => void
    medidor?: Medidor | null
    onSave: (data: MedidorFormData) => void
    loading: boolean
    socios: { idUsuario: number; nombre: string; apellido: string }[]
    categorias: { idCategoria: number; nombre: string }[]
}

const initialFormData: MedidorFormData = {
    idUsuario: 0,
    idCategoria: 0,
    direccion: '',
    ubicacion: {
        latitud: 0,
        longitud: 0,
        descripcion: ''
    },
    estado: 'ACTIVO'
}

export default function ModalUsuario({
    isOpen,
    onClose,
    medidor,
    onSave,
    loading,
    socios,
    categorias
}: ModalMedidorProps) {
    const [formData, setFormData] = useState<MedidorFormData>(initialFormData)
    const [errors, setErrors] = useState<Partial<MedidorFormData>>({})
    const [step, setStep] = useState(1)
    const [showMap, setShowMap] = useState(false);

    const isEditing = !!medidor  //si usuario es null es falso caso contrario verdadero
    const modalTitle = isEditing ? 'Editar Medidor' : 'Crear Nuevo Medidor'

    useEffect(() => {
        if (step === 2) {
            const timeout = setTimeout(() => setShowMap(true), 150); // espera animación del modal
            return () => clearTimeout(timeout);
        } else {
            setShowMap(false);
        }
    }, [step]);

    useEffect(() => {
        if (!isOpen) return; // sólo cuando se abre

        if (medidor) {
            setFormData({
                idUsuario: medidor.idUsuario ?? 0,
                idCategoria: medidor.idCategoria ?? 0,
                direccion: medidor.direccion,
                ubicacion: medidor.ubicacion || { latitud: 0, longitud: 0, descripcion: '' },
                estado: medidor.estado
            })
        } else {
            setFormData(initialFormData)
        }

        setErrors({})
        setStep(1)
    }, [isOpen])

    const handleInputChange = (field: keyof MedidorFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const validateForm = () => {
        const newErrors: Partial<MedidorFormData> = {}
        if (formData.idUsuario <= 0) newErrors.idUsuario = 'El usuario es requerido';
        if (formData.idCategoria <= 0) newErrors.idCategoria = 'La categoría es requerida';
        if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            onSave(formData)
        } else {
            toast.error('Verifica los datos ingresados antes de enviar')
        }
    }

    const handleClose = () => {
        setFormData(initialFormData)
        setErrors({})
        setStep(1)
        onClose()
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black bg-opacity-50"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 50 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{modalTitle}</h2>
                                    <p className="text-blue-100 text-sm">
                                        {isEditing ? 'Modifica la información del usuario' : 'Completa los datos para crear un nuevo usuario'}
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleClose}
                                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </motion.button>
                        </div>

                        {/* Progress indicator  barra de progreso*/}
                        <div className="mt-4 flex space-x-2">
                            <div className={`flex-1 h-2 rounded-full transition-all ${step >= 1 ? 'bg-white bg-opacity-60' : 'bg-white bg-opacity-20'}`} />
                            <div className={`flex-1 h-2 rounded-full transition-all ${step >= 2 ? 'bg-white bg-opacity-60' : 'bg-white bg-opacity-20'}`} />
                        </div>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                        <div className="p-6 space-y-6">
                            {step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <User className="w-5 h-5 text-blue-600" />
                                        Información del Medidor
                                    </h3>

                                    {/* Socio y Categoria */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Socio *
                                            </label>
                                            <Select
                                                options={socios.map(s => ({
                                                    value: s.idUsuario,
                                                    label: `${s.idUsuario} - ${s.nombre} ${s.apellido}`
                                                }))}
                                                value={
                                                    formData.idUsuario
                                                        ? {
                                                            value: formData.idUsuario,
                                                            label: `${formData.idUsuario} - ${socios.find(s => s.idUsuario === formData.idUsuario)?.nombre || ''
                                                                } ${socios.find(s => s.idUsuario === formData.idUsuario)?.apellido || ''}`
                                                        }
                                                        : null
                                                }
                                                onChange={(option) => handleInputChange('idUsuario', option?.value ?? 0)}
                                                isClearable
                                                placeholder="Selecciona un socio"
                                            />
                                            {errors.idUsuario && <p className="mt-1 text-sm text-red-600">{errors.idUsuario}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Categoría *
                                            </label>
                                            <select
                                                value={formData.idCategoria}
                                                onChange={(e) => handleInputChange('idCategoria', Number(e.target.value))}
                                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            >
                                                <option value="">Selecciona una categoría</option>
                                                {categorias.map((cat) => (
                                                    <option key={cat.idCategoria} value={cat.idCategoria}>
                                                        {cat.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.idCategoria && <p className="mt-1 text-sm text-red-600">{errors.idCategoria}</p>}
                                        </div>
                                    </div>

                                    {/* Dirección */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dirección *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.direccion}
                                            onChange={(e) => handleInputChange('direccion', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${errors.direccion ? 'border-red-300' : 'border-gray-300'}`}
                                            placeholder="Ingresa la dirección"
                                        />
                                        {errors.direccion && <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>}
                                    </div>

                                    {/* Estado */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Estado *
                                        </label>
                                        <select
                                            value={formData.estado}
                                            onChange={(e) => handleInputChange('estado', e.target.value as 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO')}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        >
                                            <option value="ACTIVO">Activo</option>
                                            <option value="INACTIVO">Inactivo</option>
                                            <option value="SUSPENDIDO">Suspendido</option>
                                        </select>
                                    </div>

                                    {/* Descripción */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Descripción
                                        </label>
                                        <textarea
                                            value={formData.ubicacion?.descripcion || ''}
                                            onChange={(e) => handleInputChange('ubicacion', { ...formData.ubicacion, descripcion: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Agrega alguna descripción"
                                            rows={3}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    initial={false} // evita transform inicial de framer-motion
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-blue-600" />
                                        Selección de Ubicación
                                    </h3>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-800">
                                            Selecciona el punto en el mapa. Las coordenadas se mostrarán debajo.
                                        </p>
                                    </div>

                                    {/* Contenedor del mapa */}
                                    {showMap && (
                                        <div className="border rounded-lg overflow-auto h-80">
                                            <MapaDelimitado
                                                onSelect={(lat: number, lng: number) =>
                                                    setFormData({
                                                        ...formData,
                                                        ubicacion: { ...formData.ubicacion, latitud: lat, longitud: lng },
                                                    })
                                                }
                                            />
                                        </div>
                                    )}

                                    {/* Labels de coordenadas */}
                                    <div className="flex gap-4 mt-2">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700">Latitud</label>
                                            <p className="px-4 py-2 border rounded bg-gray-100">
                                                {formData.ubicacion.latitud}
                                            </p>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700">Longitud</label>
                                            <p className="px-4 py-2 border rounded bg-gray-100">
                                                {formData.ubicacion.longitud}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t">
                            <div className="flex items-center justify-between">
                                <div>
                                    {step === 2 && (
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setStep(1)}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            Anterior
                                        </motion.button>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleClose}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </motion.button>

                                    {step === 1 ? (
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setStep(2)}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                        >
                                            Siguiente
                                            <motion.div
                                                animate={{ x: [0, 4, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            >
                                                →
                                            </motion.div>
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            whileHover={{ scale: loading ? 1 : 1.05 }}
                                            whileTap={{ scale: loading ? 1 : 0.95 }}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Guardando...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    {isEditing ? 'Actualizar' : 'Guardar'}
                                                </>
                                            )}
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}