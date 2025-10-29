'use client'

import React from 'react';

export default function PagoDetalleModal({
  pago,
  onClose
}: {
  pago: any;
  onClose: () => void;
}) {
  if (!pago) return null;

  const total = pago.comprobantes.reduce((acc: number, c: any) => acc + Number(c.totalPagar), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-">
      <div className="bg-white p-6 rounded-lg w-11/12 md:w-2/3 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Detalle del pago #{pago.idPago}</h2>
        <p className="mb-2">Cajero: {pago.cajero.nombre}</p>
        <p className="mb-4">Fecha: {new Date(pago.fechaPago).toLocaleString()}</p>

        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-2 py-1">Comprobante</th>
              <th className="px-2 py-1">Socio</th>
              <th className="px-2 py-1">Medidor</th>
              <th className="px-2 py-1">Total</th>
              <th className="px-2 py-1">Estado</th>
            </tr>
          </thead>
          <tbody>
            {pago.comprobantes.map((c: any) => (
              <tr key={c.idComprobante} className="border-t">
                <td className="px-2 py-1">{`COMP-${c.idComprobante}`}</td>
                <td className="px-2 py-1">{c.lectura.medidor.socio.nombre}</td>
                <td className="px-2 py-1">{c.lectura.medidor.idMedidor}</td>
                <td className="px-2 py-1">Bs. {Number(c.totalPagar).toFixed(2)}</td>
                <td className="px-2 py-1">{c.estadoPago}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between items-center">
          <span className="font-bold">Total del pago: Bs. {total.toFixed(2)}</span>
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
