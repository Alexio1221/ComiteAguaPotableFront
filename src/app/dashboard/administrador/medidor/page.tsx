"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { CircleGauge, Download, Gauge, RefreshCw, Send } from "lucide-react"
import TablaMedidores from "./components/TablaMedidor"
import FiltrosMedidores from "./components/FiltroMedidores"
import ModalMedidor from "./components/ModalMedidor"
import { Medidor, FiltrosMedidor, MedidorFormData } from "./types/medidor"
import ruta from "@/api/axios";
import toast from 'react-hot-toast'

export default function MedidoresPage() {
    // Estados
    const [medidores, setMedidores] = useState<Medidor[]>([])
    const [filtros, setFiltros] = useState<FiltrosMedidor>({
        busqueda: '',
        estado: 'todos',
    })
    const [modalAbierto, setModalAbierto] = useState(false)
    const [medidorEditando, setMedidorEditando] = useState<Medidor | null>(null)
    const [loading, setLoading] = useState(true)
    const [loadingModal, setLoadingModal] = useState(false)
    const [socios, setSocios] = useState<any[]>([])
    const [categorias, setCategorias] = useState<any[]>([])


    useEffect(() => {
        // Datos de medidores (mock)
        const dummyMedidores: Medidor[] = [
            {
                idMedidor: 1,
                nombre: 'Juan',
                apellido: 'Pérez',
                categoria: 'Residencial',
                estado: 'ACTIVO',
                direccion: 'Av. Siempre Viva 123',
                fechaRegistro: '2023-01-01'
            },
            {
                idMedidor: 2,
                nombre: 'Ana',
                apellido: 'Gómez',
                categoria: 'Comercial',
                estado: 'INACTIVO',
                direccion: 'Calle Falsa 456',
                fechaRegistro: '2023-02-01'
            },
        ];
        setMedidores(dummyMedidores);

        // Datos de socios (mock)
        const dummySocios = [
            { idUsuario: 1, nombre: 'Luis', apellido: 'Martínez' },
            { idUsuario: 2, nombre: 'María', apellido: 'Rodríguez' },
            { idUsuario: 3, nombre: 'Carlos', apellido: 'González' },
        ];
        setSocios(dummySocios);

        // Datos de categorías (mock)
        const dummyCategorias = [
            { idCategoria: 1, nombre: 'Residencial' },
            { idCategoria: 2, nombre: 'Comercial' },
            { idCategoria: 3, nombre: 'Industrial' },
        ];
        setCategorias(dummyCategorias);

        setLoading(false);
    }, []);



    // Filtrar medidores según los filtros aplicados
    const medidoresFiltrados = useMemo(() => {
        return medidores.filter(medidor => {
            // Filtro por búsqueda
            if (filtros.busqueda) {
                const busqueda = filtros.busqueda.toLowerCase()
                const coincide =
                    medidor.nombre.toLowerCase().includes(busqueda) ||
                    medidor.apellido.toLowerCase().includes(busqueda) ||
                    medidor.categoria.toLowerCase().includes(busqueda)
                if (!coincide) return false
            }

            // Filtro por estado
            if (filtros.estado !== 'todos' && medidor.estado !== filtros.estado.toUpperCase()) {
                return false;
            }

            // Filtro por fecha (si se implementa)
            // if (filtros.fechaDesde || filtros.fechaHasta) {
            //   // Implementar lógica de filtro por fecha
            // }

            return true
        })
    }, [medidores, filtros])

    // Estadísticas
    const estadisticas = useMemo(() => {
        return {
            total: medidores.length,
            activos: medidores.filter(u => u.estado === 'ACTIVO').length,
            inactivos: medidores.filter(u => u.estado === 'INACTIVO').length,
            suspendidos: medidores.filter(u => u.estado === 'SUSPENDIDO').length
        }
    }, [medidores])

    // Handlers
    const handleNuevoMedidor = () => {
        setMedidorEditando(null)
        setModalAbierto(true)
    }

    const handleEditarMedidor = (medidor: Medidor) => {
        setMedidorEditando(medidor)
        setModalAbierto(true)
    }

    const handleVerDetalles = (medidor: Medidor) => {
        // Implementar modal de detalles o navegación
        console.log('Ver detalles de:', medidor)
        alert(`Detalles de ${medidor.nombre} ${medidor.apellido}`)
    }

    const handleGuardarMedidor = async (data: MedidorFormData) => {
        setLoadingModal(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)) // Simular request

            if (medidorEditando) {
                const response = await ruta.put(`/auth/usuario/${medidorEditando.idMedidor}`, data);

                setMedidores((prev) =>
                    prev.map((u) =>
                        u.idMedidor === medidorEditando.idMedidor ? response.data : u
                    )
                );
                toast.success('Medidor actualizado correctamente ✅', {
                    duration: 4000, // 4 segundos
                    style: {
                        background: '#24A3E3',
                        color: '#fff',
                    },
                })

                //alert("Usuario actualizado correctamente");
            } else {
                const response = await ruta.post("/auth/usuario", data);

                setMedidores((prev) => [...prev, response.data]);
                toast.success('Medidor creado correctamente 🎉')
                //alert("Usuario creado correctamente");
            }

            setModalAbierto(false)
            setMedidorEditando(null)
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

    const handleExportarMedidores = () => {
        // Implementar exportación
        //console.log('Exportar medidores:', medidoresFiltrados)
        alert('Funcionalidad de exportación - próximamente')
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
                    <h1 className="text-3xl font-bold text-gray-900">Registro de Medidores</h1>
                    <p className="text-gray-600 mt-1">
                        Administra los medidores del sistema
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
                        onClick={handleExportarMedidores}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Exportar
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNuevoMedidor}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-colors"
                    >
                        <CircleGauge className="w-4 h-4" />
                        Registrar Medidor
                    </motion.button>
                </div>
            </motion.div>

            {/* Filtros y estadísticas */}
            <FiltrosMedidores
                filtros={filtros}
                onFiltrosChange={setFiltros}
                totalMedidores={estadisticas.total}
                medidoresActivos={estadisticas.activos}
            />

            {/* Tabla de usuarios */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <TablaMedidores
                    medidores={medidoresFiltrados}
                    onEditarMedidor={handleEditarMedidor}
                    onVerDetalles={handleVerDetalles}
                    loading={loading}
                />
            </motion.div>

            {/* Información adicional */}
            {!loading && medidoresFiltrados.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-sm text-gray-500 text-center"
                >
                    Mostrando {medidoresFiltrados.length} de {medidores.length} medidores
                </motion.div>
            )}

            {/* Modal de medidor */}
            <ModalMedidor
                isOpen={modalAbierto}
                onClose={() => {
                    setModalAbierto(false)
                    setMedidorEditando(null)
                }}
                medidor={medidorEditando}
                socios={socios}           // <-- lista de socios
                categorias={categorias}
                onSave={handleGuardarMedidor}
                loading={loadingModal}
            />
        </div>
    )
}