'use client'
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import React, { useRef, useState, useEffect } from 'react'
import html2canvas from 'html2canvas'
import CredencialSocio from './CredencialSocio'
import CredencialPosterior from './CredencialPosterior'

export default function Page() {
  const [caraCredencial, setCaraCredencial] = useState<"Anverso" | "Reverso">("Anverso")
  const credencialRef = useRef<HTMLDivElement>(null)
  const [usuario, setUsuario] = useState<{
    idUsuario: string
    nombre: string
    apellidos: string
    direcciones: string[]
  } | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const dataParam = params.get('data')
    if (dataParam) {
      try {
        setUsuario(JSON.parse(dataParam))
      } catch {
        setUsuario({
          idUsuario: '9999',
          nombre: 'Nombre',
          apellidos: 'Apellido',
          direcciones: ['Sin dirección']
        })
      }
    } else {
      setUsuario({
        idUsuario: '9999',
        nombre: 'Nombre',
        apellidos: 'Apellido',
        direcciones: ['Sin dirección']
      })
    }
  }, [])

  const handleDownload = async () => {
    if (!credencialRef.current || !usuario) return
    const canvas = await html2canvas(credencialRef.current, { scale: 3 })
    const imgData = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = imgData
    link.download = `Credencial_${caraCredencial}_${usuario.nombre}.png`
    link.click()
  }

  if (!usuario) return null // espera a que se setee usuario

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
