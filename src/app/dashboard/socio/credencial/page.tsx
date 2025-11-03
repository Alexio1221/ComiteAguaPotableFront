'use client'

import React, { useRef } from 'react'
import html2canvas from 'html2canvas'
import CredencialSocio from './CredencialSocio'

export default function Page() {
  const credencialRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!credencialRef.current) return
    const canvas = await html2canvas(credencialRef.current, { scale: 3 })
    const imgData = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = imgData
    link.download = 'credencial_socio.png'
    link.click()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100 p-6">
      <h1 className="text-xl font-bold text-gray-700">
        Credencial del Socio
      </h1>

      <CredencialSocio
        ref={credencialRef}
        nombre="Juan"
        apellidos="Perez"
        idSocio="SOC-045"
        direccion="Av. Central N° 123"
      />

      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-blue-700 text-white rounded-md font-semibold hover:bg-blue-800"
      >
        Descargar como imagen
      </button>
    </div>
  )
}
