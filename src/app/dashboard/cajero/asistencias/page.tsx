'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ruta from '@/api/axios'
import toast from 'react-hot-toast'
import { CheckCircle, Clock, Search, CreditCard, Download } from 'lucide-react'

interface PagoPendiente {
  idPagoReunion: number
  idReunion: number
  idUsuario: number
  nombreSocio: string
  nombreReunion: string
  monto: number
  fechaReunion: string
  pagado: boolean
}

const CajeroReunionesPage: React.FC = () => {
  const [pagosPendientes, setPagosPendientes] = useState<PagoPendiente[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [mes, setMes] = useState('')
  const [anio, setAnio] = useState('')
  const [pagina, setPagina] = useState(1)
  const ITEMS_POR_PAGINA = 10

  useEffect(() => {
    cargarPagosPendientes()
  }, [])

  const cargarPagosPendientes = async () => {
    try {
      const res = await ruta.get('/avisos/cajero/pagos-reunion')
      setPagosPendientes(res.data)
    } catch {
      toast.error('Error al cargar pagos pendientes')
    }
  }

  const registrarPago = async (idPagoReunion: number) => {
    try {
      await ruta.put(`/avisos/cajero/pago-reunion/${idPagoReunion}`, { estado: true })
      toast.success('Pago registrado correctamente')
      cargarPagosPendientes()
    } catch {
      toast.error('Error al registrar el pago')
    }
  }

  const generarReporte = async () => {
    try {
      const res = await ruta.post(
        '/servicios/pagos-asistencia',
        { mes, anio, socio: busqueda, },
        { responseType: 'blob' }
      )
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'reporte_pagos.pdf')
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch {
      toast.error('No se pudo generar el reporte')
    }
  }
  
  const pagosFiltrados = pagosPendientes
    .filter(p => {
      const fecha = new Date(
        new Date(p.fechaReunion).toLocaleString('en-US', { timeZone: 'America/La_Paz' })
      )
      const coincideMes = !mes || fecha.getMonth() + 1 === Number(mes)
      const coincideAnio = !anio || fecha.getFullYear() === Number(anio)
      return coincideMes && coincideAnio
    })
    .filter(p => p.nombreSocio.toLowerCase().includes(busqueda.toLowerCase()))

  const totalPaginas = Math.ceil(pagosFiltrados.length / ITEMS_POR_PAGINA)
  const pagosPagina = pagosFiltrados.slice(
    (pagina - 1) * ITEMS_POR_PAGINA,
    pagina * ITEMS_POR_PAGINA
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CreditCard className="text-blue-600" /> Pagos de Reuniones
        </h2>
        <button
          onClick={generarReporte}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow"
        >
          <Download size={16} /> Descargar reporte
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Search className="text-gray-500" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar socio..."
            className="w-60 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <select
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Todos los meses</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString('es-ES', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Todos los años</option>
            {[2020, 2021, 2022, 2023, 2024, 2025].map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden border">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Socio</th>
              <th className="px-4 py-3">Reunión</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3 text-center">Monto (Bs)</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {pagosPagina.length > 0 ? (
              pagosPagina.map((pago) => (
                <tr key={pago.idPagoReunion} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-semibold">{pago.nombreSocio}</td>
                  <td className="px-4 py-3">{pago.nombreReunion}</td>
                  <td className="px-4 py-3">{new Date(pago.fechaReunion).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-center font-semibold text-blue-700">{pago.monto}</td>
                  <td className="px-4 py-3 text-center">
                    {pago.pagado ? (
                      <span className="flex items-center justify-center text-green-600 gap-1">
                        <CheckCircle size={16} /> Pagado
                      </span>
                    ) : (
                      <span className="flex items-center justify-center text-orange-600 gap-1">
                        <Clock size={16} /> Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {!pago.pagado && (
                      <button
                        onClick={() => registrarPago(pago.idPagoReunion)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Registrar Pago
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 italic">
                  No hay pagos pendientes o coincidencias.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="mt-4 flex justify-center items-center gap-3">
          <button
            onClick={() => setPagina(p => Math.max(p - 1, 1))}
            disabled={pagina === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <span>
            Página {pagina} de {totalPaginas}
          </span>
          <button
            onClick={() => setPagina(p => Math.min(p + 1, totalPaginas))}
            disabled={pagina === totalPaginas}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default CajeroReunionesPage
