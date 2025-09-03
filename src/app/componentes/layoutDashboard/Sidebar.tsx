"use client"

import { useState, useEffect } from "react"
import {
  Home,
  Users,
  Wrench,
  CreditCard,
  Droplet,
  Book,
  Bell,
  Map,
  AlertCircle,
  Calendar,
} from "lucide-react"
import NavLinks from "./NavLinks"
import ruta from "@/api/axios"

const iconMap = {
  Home,
  Users,
  Wrench,
  CreditCard,
  Droplet,
  Map,
  Book,
  Bell,
  AlertCircle,
  Calendar,
} as const

// Definimos las props que recibe Sidebar
interface SidebarProps {
  rol: string
}

interface Funcion {
  nombreFuncion: string
  icono: keyof typeof iconMap
}

export default function Sidebar({ rol }: SidebarProps) {
  const [funciones, setFunciones] = useState<Funcion[]>([])

  useEffect(() => {
    const fetchFunciones = async () => {
      try {
        const response = await ruta.get(`/auth/funciones/${rol}`)
        setFunciones(response.data.funciones)
      } catch (error) {
        console.error("Error al obtener funciones:", error)
        setFunciones([]) // limpiamos si falla
      }
    }

    fetchFunciones()
  }, [rol])

  const links = [
    { href: "/dashboard", label: "Inicio", icon: Home },
    ...funciones.map((func) => ({
      href: `/dashboard/${rol.toLowerCase()}/${func.nombreFuncion.toLowerCase()}`,
      label: func.nombreFuncion,
      icon: iconMap[func.icono] || Home,
    })),
  ]

  return (
    <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6">💧 Sistema Agua</h2>
      <nav className="flex flex-col gap-2">
        {links.map((link, idx) => (
          <NavLinks key={idx} href={link.href} icon={link.icon}>
            {link.label}
          </NavLinks>
        ))}
      </nav>
    </aside>
  )
}
