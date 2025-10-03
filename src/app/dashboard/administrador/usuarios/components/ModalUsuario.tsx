"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, User, Phone, Lock, Shield, Save, Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"
import { Usuario, Rol, UsuarioFormData } from "../types/usuario"
import { toast } from "react-hot-toast"

interface ModalUsuarioProps {
    isOpen: boolean
    onClose: () => void
    usuario?: Usuario | null
    roles: Rol[]
    onSave: (data: UsuarioFormData) => void
    loading: boolean
}

const initialFormData: UsuarioFormData = {
    usuario: '',
    nombre: '',
    apellidos: '',
    telefono: '',
    contraseña: '',
    rolesIds: [4], // Socio por defecto
    estadosRoles: {}
}

export default function ModalUsuario({
    isOpen,
    onClose,
    usuario,
    roles,
    onSave,
    loading
}: ModalUsuarioProps) {
    const [formData, setFormData] = useState<UsuarioFormData>(initialFormData)
    const [errors, setErrors] = useState<Partial<UsuarioFormData>>({})
    const [showPassword, setShowPassword] = useState(false)
    const [step, setStep] = useState(1)

    const isEditing = !!usuario  //si usuario es null es falso caso contrario verdadero
    const modalTitle = isEditing ? 'Editar Usuario' : 'Crear Nuevo Socio'

    useEffect(() => {
        if (!isOpen) return; // sólo cuando se abre

        if (usuario) {
            const estados: { [idRol: number]: boolean } = {};
            usuario.roles.forEach((rol) => {
                estados[rol.idRol] = rol.estado;
            });
            setFormData({
                usuario: usuario.usuario,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                telefono: usuario.telefono || '',
                contraseña: '',
                rolesIds: usuario.roles.map(r => r.idRol),
                estadosRoles: estados,
            })
        } else {
            setFormData(initialFormData)
        }

        setErrors({})
        setStep(1)
    }, [isOpen])

    const handleInputChange = (field: keyof UsuarioFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const handleRoleToggle = (roleId: number) => {
        setFormData(prev => ({
            ...prev,
            rolesIds: prev.rolesIds.includes(roleId)
                ? prev.rolesIds.filter(id => id !== roleId)
                : [...prev.rolesIds, roleId]
        }))
    }

    const validateForm = () => {
        const newErrors: Partial<UsuarioFormData> = {}

        if (!formData.usuario.trim()) newErrors.usuario = 'El usuario es requerido'
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido'
        if (!formData.apellidos.trim()) newErrors.apellidos = 'El apellido es requerido'
        if (!isEditing && !formData.contraseña) {
            newErrors.contraseña = 'La contraseña es requerida'
        }
        if (formData.rolesIds.length === 0) {
            toast.error('Debe seleccionar al menos un rol')
            newErrors.rolesIds = [] as any // Para indicar error en roles
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            onSave(formData)
        }else{
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

                        {/* Progress indicator */}
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
                                        Información Personal
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nombre *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.nombre}
                                                onChange={(e) => handleInputChange('nombre', e.target.value)}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${errors.nombre ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="Ingresa el nombre"
                                            />
                                            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Apellido *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.apellidos}
                                                onChange={(e) => handleInputChange('apellidos', e.target.value)}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${errors.apellidos ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="Ingresa el apellido"
                                            />
                                            {errors.apellidos && <p className="mt-1 text-sm text-red-600">{errors.apellidos}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <User className="inline w-4 h-4 mr-1" />
                                                Usuario *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.usuario}
                                                onChange={(e) => handleInputChange('usuario', e.target.value)}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${errors.usuario ? 'border-red-300' : 'border-gray-300'
                                                    }`}
                                                placeholder="nombre_usuario"
                                            />
                                            {errors.usuario && <p className="mt-1 text-sm text-red-600">{errors.usuario}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Phone className="inline w-4 h-4 mr-1" />
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.telefono}
                                                onChange={(e) => handleInputChange('telefono', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                placeholder="+591 12345678"
                                            />
                                        </div>
                                    </div>

                                    {!isEditing && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Lock className="inline w-4 h-4 mr-1" />
                                                Contraseña *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.contraseña}
                                                    onChange={(e) => handleInputChange('contraseña', e.target.value)}
                                                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${errors.contraseña ? 'border-red-300' : 'border-gray-300'
                                                        }`}
                                                    placeholder="Ingresa una contraseña segura"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                            {errors.contraseña && <p className="mt-1 text-sm text-red-600">{errors.contraseña}</p>}
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="activo"
                                            checked={formData.estadosRoles?.[4] ?? false} // 4 id del socio
                                            onChange={(e) =>
                                                handleInputChange("estadosRoles", {
                                                    ...formData.estadosRoles,
                                                    4: e.target.checked, // actualiza solo el rol Socio
                                                })
                                            }
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="activo" className="ml-2 text-sm text-gray-700">
                                            Usuario activo
                                        </label>
                                    </div>

                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-blue-600" />
                                        Asignación de Roles
                                    </h3>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-800">
                                            Selecciona los roles que tendrá el usuario. Puedes asignar múltiples roles según las necesidades.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {roles.map((rol) => (
                                            <motion.div
                                                key={rol.idRol}
                                                whileHover={{ scale: 1.02 }}
                                                className={`border rounded-lg p-4 cursor-pointer transition-all ${formData.estadosRoles?.[rol.idRol]
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={rol.idRol === 4 ? true : formData.estadosRoles?.[rol.idRol] ?? false}  //checked={formData.estadosRoles?.[rol.idRol] ?? false}
                                                        onChange={(e) => {
                                                            if (rol.idRol !== 4) handleRoleToggle(rol.idRol);
                                                            handleInputChange("estadosRoles", {
                                                                ...formData.estadosRoles,
                                                                [rol.idRol]: e.target.checked,
                                                            })
                                                        }}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{rol.nombreRol}</h4>
                                                        <p className="text-sm text-gray-600">{rol.descripcion}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                        
                                        {errors.rolesIds && (
                                            <p className="text-sm text-red-600">Debe seleccionar al menos un rol</p>
                                        )}*
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
                                                    {isEditing ? 'Actualizar' : 'Crear Usuario'}
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