'use client'

import React from 'react'
import QRCode from 'react-qr-code'

interface Props {
  nombre: string
  apellidos: string
  idSocio: string
  direccion: string
}

const CredencialSocio = React.forwardRef<HTMLDivElement, Props>(
  ({ nombre, apellidos, idSocio, direccion }, ref) => {
    return (
      <div
        ref={ref}
        className="w-[1004px] h-[650px] bg-gradient-to-r from-sky-600 to-blue-800 text-white rounded-xl shadow-2xl p-8 relative font-sans flex flex-col"
      >
        {/* Logos en las esquinas */}
        <div className="absolute top-4 left-4">
          <img
            src="/imagenes/logoCatachilla.png"
            alt="Logo"
            className="w-40 h-40 border-2 border-white shadow-lg"
          />
        </div>

        {/* Encabezado centrado */}
        <div className="text-center mb-8 mt-4">
          <h1 className="text-2xl font-bold leading-tight">COMITÉ DE AGUA POTABLE "CATACHILLA ALTA"</h1>
          <div className="text-sm space-y-1">
            <p>Fundado el 29 de febrero de 2016</p>
            <p>Provincia Chapare - Sacaba - Cochabamba, Bolivia</p>
          </div>
        </div>

        {/* Contenido principal sin fondo blanco */}
        <div className="flex-1 rounded-lg p-8 flex justify-between items-center">
          {/* Información del socio */}
          <div className="space-y-8 flex-1">
            <div>
              <p className="text-lg font-semibold text-blue-100 mb-2">Nombre:</p>
              <p className="text-3xl font-bold text-white">{nombre} {apellidos}</p>
            </div>
            
            <div>
              <p className="text-lg font-semibold text-blue-100 mb-2">N° Socio:</p>
              <p className="text-3xl font-bold text-yellow-300">{idSocio}</p>
            </div>
            
            <div>
              <p className="text-lg font-semibold text-blue-100 mb-2">Dirección:</p>
              <p className="text-2xl font-medium text-white">{direccion}</p>
            </div>
          </div>

          {/* QR más grande */}
          <div className="flex flex-col items-center mr-20">
            <div className="bg-white p-6 rounded-2xl shadow-2xl">
              <QRCode 
                value={`https://mi-sistema-agua.com/socio/${idSocio}`} 
                size={250}
              />
            </div>
            <p className="text-lg text-white mt-4 text-center font-bold">
              Escanea para verificar
            </p>
          </div>
        </div>

        {/* Pie de credencial */}
        <div className="text-center text-lg text-white font-bold mt-4">
          El agua limpia es un derecho, no un lujo.
        </div>

        {/* Franja decorativa inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-blue-700 via-cyan-500 to-green-400 rounded-b-xl"></div>
      </div>
    )
  }
)

CredencialSocio.displayName = 'CredencialSocio'
export default CredencialSocio