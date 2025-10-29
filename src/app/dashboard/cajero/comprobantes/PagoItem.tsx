'use client'

import React from 'react';
import { PagoHistorial } from '../tipos';
import { Eye, FileText, Calendar, User } from 'lucide-react';

interface Props {
  pago: PagoHistorial;
  rutaComprobante: string;
  onVerDetalle: (pago: PagoHistorial) => void;
  verComprobante: (rutaComprobante: string) => void;
}

export default function PagoItem({ pago, rutaComprobante, onVerDetalle, verComprobante }: Props) {
  const total = pago.comprobantes.reduce((acc, c) => acc + Number(c.totalPagar), 0);

  return (
    <>
      <td className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="font-medium">{new Date(pago.fechaPago).toLocaleDateString('es-BO', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}</span>
        </div>
      </td>
      <td className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700">{pago.cajero.nombre}</span>
        </div>
      </td>
      <td className="px-6 py-4 border-b border-gray-100">
        <span className="text-gray-700 font-medium">{pago.comprobantes[0].lectura.medidor.socio.nombre}</span>
      </td>
      <td className="px-6 py-4 border-b border-gray-100">
        <span className="text-green-600 font-bold">Bs. {total.toFixed(2)}</span>
      </td>
      <td className="px-6 py-4 border-b border-gray-100">
        <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full text-xs">
          {pago.comprobantes.length} {pago.comprobantes.length === 1 ? 'comprobante' : 'comprobantes'}
        </span>
      </td>
      <td className="px-6 py-4 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onVerDetalle(pago)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg transform hover:scale-105"
          >
            <Eye className="w-4 h-4" />
            Ver detalle
          </button>
          {rutaComprobante && (
            <button
              onClick={() => verComprobante(rutaComprobante)}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all hover:shadow-lg transform hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              Ver PDF
            </button>
          )}
        </div>
      </td>
    </>
  );
}