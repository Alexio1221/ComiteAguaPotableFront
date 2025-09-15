"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { UserPlus, Download, Upload, RefreshCw } from "lucide-react"
import TablaUsuarios from "./components/TablaUsuarios"
import FiltrosUsuarios from "./components/FiltroUsuarios"
import ModalUsuario from "./components/ModalUsuario"
import { Usuario, Rol, FiltrosUsuario, UsuarioFormData } from "./types/usuario"
import ruta from "@/api/axios";
import toast from 'react-hot-toast'

export default function UsuariosPage() {
    // Estados
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [roles, setRoles] = useState<Rol[]>([])
    const [filtros, setFiltros] = useState<FiltrosUsuario>({
        busqueda: '',
        rol: '',
        estado: 'todos',
    })
    const [modalAbierto, setModalAbierto] = useState(false)
    const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null)
    const [loading, setLoading] = useState(true)
    const [loadingModal, setLoadingModal] = useState(false)

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const resUsuarios = await ruta.get("/auth/usuarios");
                const resRoles = await ruta.get("/auth/roles");
                setUsuarios(resUsuarios.data.usuarios);
                setRoles(resRoles.data.roles);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            } finally {
                setLoading(false)
            }
        };

        fetchUsuarios();
    }, []);

    // Filtrar usuarios según los filtros aplicados
    const usuariosFiltrados = useMemo(() => {
        return usuarios.filter(usuario => {
            // Filtro por búsqueda
            if (filtros.busqueda) {
                const busqueda = filtros.busqueda.toLowerCase()
                const coincide =
                    usuario.nombre.toLowerCase().includes(busqueda) ||
                    usuario.apellido.toLowerCase().includes(busqueda) ||
                    usuario.usuario.toLowerCase().includes(busqueda)
                if (!coincide) return false
            }

            // Filtro por rol
            if (filtros.rol) {
                const tieneRol = usuario.roles.some(rol => rol.nombreRol === filtros.rol)
                if (!tieneRol) return false
            }

            // Filtro por estado
            if (filtros.estado !== 'todos') {
                const estadoFiltro = filtros.estado === 'activo'
                if (usuario.activo !== estadoFiltro) return false
            }

            // Filtro por fecha (si se implementa)
            // if (filtros.fechaDesde || filtros.fechaHasta) {
            //   // Implementar lógica de filtro por fecha
            // }

            return true
        })
    }, [usuarios, filtros])

    // Estadísticas
    const estadisticas = useMemo(() => {
        return {
            total: usuarios.length,
            activos: usuarios.filter(u => u.activo).length,
            inactivos: usuarios.filter(u => !u.activo).length
        }
    }, [usuarios])

    // Handlers
    const handleNuevoUsuario = () => {
        setUsuarioEditando(null)
        setModalAbierto(true)
    }

    const handleEditarUsuario = (usuario: Usuario) => {
        setUsuarioEditando(usuario)
        setModalAbierto(true)
    }

    const handleVerDetalles = (usuario: Usuario) => {
        // Implementar modal de detalles o navegación
        console.log('Ver detalles de:', usuario)
        alert(`Detalles de ${usuario.nombre} ${usuario.apellido}`)
    }

    const handleGuardarUsuario = async (data: UsuarioFormData) => {
        setLoadingModal(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)) // Simular request

            if (usuarioEditando) {
                const response = await ruta.put(`/auth/usuario/${usuarioEditando.idUsuario}`, data);

                setUsuarios((prev) =>
                    prev.map((u) =>
                        u.idUsuario === usuarioEditando.idUsuario ? response.data : u
                    )
                );
                toast.success('Usuario actualizado correctamente ✅', {
                    duration: 4000, // 4 segundos
                    style: {
                        background: '#24A3E3',
                        color: '#fff',
                    },
                })
                //alert("Usuario actualizado correctamente");
            } else {
                const response = await ruta.post("/auth/usuario", data);

                setUsuarios((prev) => [...prev, response.data]);
                toast.success('Usuario creado correctamente 🎉')
                //alert("Usuario creado correctamente");
            }

            setModalAbierto(false)
            setUsuarioEditando(null)
        } catch (err: any) {
            // si es un error de axios, tendrá err.response
            const mensajeBackend =
                err.response?.data?.mensaje || // campo "mensaje"
                err.response?.data?.error ||   // el campo "error"
                err.message;                   // el mensaje genérico de JS

            toast.error(mensajeBackend, {
                duration: 4000,
                style: {
                    background: '#e02424',
                    color: '#fff'
                }
            });
        } finally {
            setLoadingModal(false)
        }
    }

    const handleRefresh = () => {
        setLoading(true)
        // Recargar datos
        setTimeout(() => setLoading(false), 1000)
    }

    const handleExportarUsuarios = () => {
        // Implementar exportación
        console.log('Exportar usuarios:', usuariosFiltrados)
        alert('Funcionalidad de exportación - próximamente')
    }

    const handleImportarUsuarios = () => {
        // Implementar importación
        console.log('Importar usuarios')
        alert('Funcionalidad de importación - próximamente')
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                    <p className="text-gray-600 mt-1">
                        Administra los usuarios del sistema y sus permisos
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Actualizar
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleImportarUsuarios}
                        className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                        <Upload className="w-4 h-4" />
                        Importar
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleExportarUsuarios}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Exportar
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNuevoUsuario}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-colors"
                    >
                        <UserPlus className="w-4 h-4" />
                        Nuevo Usuario
                    </motion.button>
                </div>
            </motion.div>

            {/* Filtros y estadísticas */}
            <FiltrosUsuarios
                filtros={filtros}
                onFiltrosChange={setFiltros}
                roles={roles}
                totalUsuarios={estadisticas.total}
                usuariosActivos={estadisticas.activos}
            />

            {/* Tabla de usuarios */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <TablaUsuarios
                    usuarios={usuariosFiltrados}
                    onEditarUsuario={handleEditarUsuario}
                    onVerDetalles={handleVerDetalles}
                    loading={loading}
                />
            </motion.div>

            {/* Información adicional */}
            {!loading && usuariosFiltrados.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-sm text-gray-500 text-center"
                >
                    Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
                </motion.div>
            )}

            {/* Modal de usuario */}
            <ModalUsuario
                isOpen={modalAbierto}
                onClose={() => {
                    setModalAbierto(false)
                    setUsuarioEditando(null)
                }}
                usuario={usuarioEditando}
                roles={roles}
                onSave={handleGuardarUsuario}
                loading={loadingModal}
            />
        </div>
    )
}