'use client'

import React from 'react'
import QRCode from 'react-qr-code'
import Image from "next/image";

interface Props {
  nombre: string
  apellidos: string
  idSocio: string
  direcciones: string[]
}

const CredencialSocio = React.forwardRef<HTMLDivElement, Props>(
  ({ nombre, apellidos, idSocio, direcciones }, ref) => {
    return (
      <div
        ref={ref}
        className="w-[1004px] h-[650px] bg-gradient-to-r from-sky-600 to-blue-800 text-white rounded-xl shadow-2xl p-8 relative font-sans flex flex-col"
      >
        <div className="absolute top-4 left-4 w-32 h-32">
          <Image
            src="/imagenes/logoCatachilla.png"
            alt="Logo"
            fill
            className="object-contain border-2 border-white shadow-lg"
          />
        </div>

        <div className="text-center mt-2">
          <h1 className="text-3xl font-semibold leading-tight">COMITÉ DE AGUA POTABLE &quot;CATACHILLA ALTA&quot;</h1>
          <p className="text-2xl font-semibold">Fundado el 29 de febrero de 2016</p>
          <p className="text-2xl font-serif">Provincia Chapare - Sacaba - Cochabamba, Bolivia</p>
          <h2 className="text-5xl font-bold text-red-500 mt-6 tracking-widest">Credencial</h2>
        </div>

        <div className="flex-1 rounded-lg p-8 flex justify-between items-center">

          <div className="space-y-3 flex-1">
            <div>
              <p className="text-2xl font-semibold text-orange-300 mb-2">Nombre:</p>
              <p className="text-3xl font-bold text-white">{nombre} {apellidos}</p>
            </div>

            <div>
              <p className="text-2xl font-semibold text-orange-300 mb-2">Direcciones:</p>
              <div className="space-y-1">
                {direcciones?.map((dir: string, index: number) => (
                  <p key={index} className="text-xl font-medium text-white">
                    {dir}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center mr-15">
            <div className="bg-white p-6 rounded-2xl shadow-2xl">
              <QRCode
                value={idSocio}
                size={250}
              />
            </div>
            <p className="text-lg text-white text-center font-bold mt-2">
              N° Socio: {idSocio}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 text-center">
          <p className="text-lg text-white font-bold mb-2">
            El agua limpia es un derecho, no un lujo.
          </p>
          <div className="h-4 bg-gradient-to-r from-blue-700 via-cyan-500 to-green-400 rounded-b-xl"></div>
        </div>

      </div>
    )
  }
)

CredencialSocio.displayName = 'CredencialSocio'
export default CredencialSocio