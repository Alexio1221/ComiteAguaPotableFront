'use client'

import React from 'react';
import { Comprobante } from '../datos/comprobantes';
import ComprobanteItem from './ComprobanteCard';

export default function ComprobantesPendientes({
  comprobantes,
  onAddToPayment
}: {
  comprobantes: Comprobante[];
  onAddToPayment: (comprobante: Comprobante) => void;
}) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>📋</span>
          <span>Comprobantes Pendientes</span>
        </h2>
        <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm px-4 py-2 rounded-full font-bold shadow-md">
          {comprobantes.length} disponibles
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {comprobantes.map(c => (
          <ComprobanteItem
            key={c.idComprobante}
            comprobante={c}
            isInPaymentBox={false}
            onAddToPayment={onAddToPayment}
          />
        ))}
      </div>

      {comprobantes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✓</div>
          <p className="text-gray-600 text-lg">Todos los comprobantes están en el carrito de pago</p>
        </div>
      )}
    </div>
  );
}
