'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ruta from '@/api/axios';
import PagoItem from './PagoItem';
import PagoDetalleModal from './PagoDetalleModal';
import { PagoHistorial } from '../tipos';
import { Search, Calendar, User, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function HistorialPage() {
  const [pagos, setPagos] = useState<PagoHistorial[]>([]);
  const [detallePago, setDetallePago] = useState<PagoHistorial | null>(null);
  const [rutaComprobante, setRutaComprobante] = useState<string | null>(null);

  const [socioFiltro, setSocioFiltro] = useState('');
  const [cajeroFiltro, setCajeroFiltro] = useState('');
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await ruta.get('/servicios/historial-pagos');
        setPagos(res.data);
      } catch (error) {
        console.error("Error al obtener historial:", error);
      }
    };
    fetchHistorial();
  }, []);

  useEffect(() => {
    if (rutaComprobante) {
      window.open(rutaComprobante, "_blank");
      setRutaComprobante(null);
    }
  }, [rutaComprobante]);

  const pagosFiltrados = pagos.filter((pago) => {
    const fechaPago = new Date(
      new Date(pago.fechaPago).toLocaleString('en-US', { timeZone: 'America/La_Paz' })
    );

    const coincideSocio =
      !socioFiltro ||
      pago.comprobantes[0].lectura.medidor.socio.nombre
        .toLowerCase()
        .includes(socioFiltro.toLowerCase());

    const coincideCajero = !cajeroFiltro || pago.cajero.nombre.toLowerCase().includes(cajeroFiltro.toLowerCase());

    const coincideMes = !mes || fechaPago.getMonth() + 1 === Number(mes);
    const coincideAnio = !anio || fechaPago.getFullYear() === Number(anio);

    return (
      coincideSocio &&
      coincideCajero &&
      coincideMes &&
      coincideAnio
    );
  });

  const generarReporte = async () => {
    try {
      const res = await ruta.post('servicios/pagos-reporte', {
        socio: socioFiltro,
        cajero: cajeroFiltro,
        mes: mes,
        anio: anio,
      }, {
        responseType: 'blob',
      });

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte_pagos.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('No se pudo generar el reporte.');
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Historial de Pagos</h1>
            <p className="text-gray-600">Gestiona y consulta todos los pagos registrados</p>
          </div>

          {/* Botón de descargar reporte */}
          <button
            onClick={generarReporte}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
          >
            Descargar reporte
          </button>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-md p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filtros de búsqueda</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Filtrar por socio"
                value={socioFiltro}
                onChange={(e) => setSocioFiltro(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Filtrar por cajero"
                value={cajeroFiltro}
                onChange={(e) => setCajeroFiltro(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="">Todos los meses</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('es-ES', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={anio}
                onChange={(e) => setAnio(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="">Todos los años</option>
                {[2020, 2021, 2022, 2023, 2024, 2025].map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Tabla */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                  <th className="w-[15%] px-6 py-4 text-left font-semibold">Fecha</th>
                  <th className="w-[15%] px-6 py-4 text-left font-semibold">Cajero</th>
                  <th className="w-[15%] px-6 py-4 text-left font-semibold">Socio</th>
                  <th className="w-[15%] px-6 py-4 text-left font-semibold">Total</th>
                  <th className="w-[20%] px-6 py-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pagosFiltrados.length > 0 ? (
                  pagosFiltrados.map((pago, index) => (
                    <motion.tr
                      key={pago.idPago}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <PagoItem
                        pago={pago}
                        onVerDetalle={setDetallePago}
                        rutaComprobante={`${process.env.NEXT_PUBLIC_API_URL}${pago.comprobanteArchivo || ''}`}
                        verComprobante={setRutaComprobante}
                      />
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <DollarSign className="w-12 h-12 text-gray-300" />
                        <p className="text-lg font-medium">No se encontraron pagos</p>
                        <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Total de resultados */}
        {pagosFiltrados.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-center text-gray-600"
          >
            Mostrando {pagosFiltrados.length} {pagosFiltrados.length === 1 ? 'pago' : 'pagos'}
          </motion.div>
        )}
      </div>

      {detallePago && (
        <PagoDetalleModal pago={detallePago} onClose={() => setDetallePago(null)} />
      )}
    </motion.div>
  );
}