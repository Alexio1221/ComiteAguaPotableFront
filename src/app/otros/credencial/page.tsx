'use client'

import React, { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import CredencialSocio from './CredencialSocio'
import CredencialPosterior from './CredencialPosterior'
import { useSearchParams } from 'next/navigation'

export default function Page() {
  const [caraCredencial, setCaraCredencial] = useState<"Anverso" | "Reverso">("Anverso")
  const searchParams = useSearchParams()
  const credencialRef = useRef<HTMLDivElement>(null)

  const dataParam = searchParams.get('data')
  const usuario = dataParam
    ? JSON.parse(dataParam)
    : {
      idUsuario: '9999',
      nombre: 'Nombre',
      apellidos: 'Apellido',
      direcciones: ['Sin dirección']
    }

  const handleDownload = async () => {
    if (!credencialRef.current) return
    const canvas = await html2canvas(credencialRef.current, { scale: 3 })
    const imgData = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = imgData
    link.download = `Credencial_${caraCredencial}_${usuario.nombre}.png`
    link.click()
  }

  return (
    <div className="flex flex-col justify-center gap-2 bg-gray-100 p-3">
      <div className="mx-auto">
        {caraCredencial === "Anverso" ? (
          <CredencialSocio
            ref={credencialRef}
            nombre={usuario.nombre}
            apellidos={usuario.apellidos}
            idSocio={usuario.idUsuario.toString()}
            direcciones={usuario.direcciones || []}
          />
        ) : (
          <CredencialPosterior ref={credencialRef} />
        )}
      </div>

      {/* Botones separados */}
      <div className="flex gap-4 justify-center mt-4">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-700 text-white rounded-md font-semibold hover:bg-blue-800"
        >
          Descargar
        </button>
        <button
          onClick={() => setCaraCredencial(caraCredencial === "Anverso" ? "Reverso" : "Anverso")}
          className="px-4 py-2 bg-blue-700 text-white rounded-md font-semibold hover:bg-blue-800"
        >
          {caraCredencial === "Anverso" ? "Ver Reverso" : "Ver Anverso"}
        </button>

      </div>
    </div>
  )
}
