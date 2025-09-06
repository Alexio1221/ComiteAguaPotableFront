"use client"

import UserMenu from "./UserMenu"
import { useState, useEffect } from 'react'
import ruta from '@/api/axios'

interface HeaderProps {
  rol: string
  setRol: (rol: string) => void
}

interface Rol {
  nombreRol: string
  descripcion: string
}

export default function Header({ rol, setRol }: HeaderProps) {

  const [roles, setRoles] = useState<Rol[]>([]);

  useEffect(() => {
    const fetchFunciones = async () => {
      try {
        const response = await ruta.get(`/auth/roles`)
        setRoles(response.data.roles)
      } catch (error) {
        console.error("Error al obtener roles:", error)
        setRoles([{ nombreRol: "Socio", descripcion: "Rol por defecto" }]) // limpiamos si falla
      }
    }

    fetchFunciones()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRol(e.target.value);
  }

  return (
    <header className="h-16 shadow bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-lg">Dashboard</h1>

        {/* Desplegable de roles */}
        <select
          value={rol}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        >
          {roles.map(r => (
            <option key={r.nombreRol} value={r.nombreRol}>
              {r.nombreRol}
            </option>
          ))}
        </select>
      </div>

      <UserMenu />
    </header>
  )
}
