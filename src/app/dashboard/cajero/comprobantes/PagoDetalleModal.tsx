'use client'

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, CreditCard, DollarSign, Droplet } from 'lucide-react';

export default function PagoDetalleModal({
  pago,
  onClose
}: {
  pago: any;
  onClose: () => void;
}) {
  useEffect(() => {
    // Bloquear scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!pago) return null;

  const total = pago.comprobantes.reduce((acc: number, c: any) => acc + Number(c.totalPagar), 0);

  const getEstadoBadge = (estado: string) => {
    const estilos = {
      PAGADO: 'bg-green-100 text-green-700 border-green-200',
      PENDIENTE: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      VENCIDO: 'bg-red-100 text-red-700 border-red-200'
    };
    return estilos[estado as keyof typeof estilos] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-5 flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                Detalle del Pago #{pago.idPago}
              </h2>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-blue-50">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Cajero: <span className="font-semibold">{pago.cajero.nombre}</span></span>
                </div>
                <div className="flex items-center gap-2 text-blue-50">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Fecha: <span className="font-semibold">{new Date(pago.fechaPago).toLocaleString('es-BO', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span></span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Contenido scrolleable */}
          <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-600" />
              Comprobantes incluidos ({pago.comprobantes.length})
            </h3>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Comprobante</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Socio</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Medidor</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Total</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pago.comprobantes.map((c: any) => (
                    <tr key={c.idComprobante} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 text-gray-700 font-medium">
                        COMP-{c.idComprobante}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {c.lectura.medidor.socio.nombre}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {c.lectura.medidor.idMedidor}
                      </td>
                      <td className="px-4 py-3 text-green-600 font-bold">
                        Bs. {Number(c.totalPagar).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoBadge(c.estadoPago)}`}>
                          {c.estadoPago}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-800">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-lg">
                <span className="font-medium">Total del pago:</span>
                <span className="font-bold text-green-600 ml-2 text-xl">Bs. {total.toFixed(2)}</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}