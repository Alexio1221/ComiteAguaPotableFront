"use client"

import { useState, useEffect } from "react"
import iconMap, { IconName } from "@/iconos/iconos"
import NavLinks from "./NavLinks"
import ruta from "@/api/axios"
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'

interface SidebarProps {
  rol: string
}

interface Funcion {
  nombreFuncion: string
  icono: IconName
}

export default function Sidebar({ rol }: SidebarProps) {
  const router = useRouter();

  const [funciones, setFunciones] = useState<Funcion[]>([])
  const [isCollapsed, setIsCollapsed] = useState(true) // estado comprimido
  const [isPinned, setIsPinned] = useState(false) // estado fijado expandido
  const ChevronIcon = isPinned ? iconMap["ChevronLeft"] : iconMap["ChevronDown"]
  const DropletIcon = iconMap["Droplet"]

  useEffect(() => {
    const fetchFunciones = async () => {
      try {
        const response = await ruta.get(`/auth/funciones/${rol}`)
        setFunciones(response.data.funciones)
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 400) {
          router.push('/');
          return;
        }
        //setFunciones([])
      }
    }

    fetchFunciones()
  }, [rol])

  const links = [
    { href: "/dashboard", label: "Inicio", icon: iconMap["Home"] },
    ...funciones.map((func) => ({
      href: `/dashboard/${rol.toLowerCase()}/${func.nombreFuncion.toLowerCase()}`,
      label: func.nombreFuncion,
      icon: iconMap[func.icono] || iconMap["Home"],
    })),
  ]

  return (
    <motion.aside
      initial={{ width: 64 }}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => {
        if (isCollapsed && !isPinned) setIsCollapsed(false)
      }}
      onMouseLeave={() => {
        if (!isPinned) setIsCollapsed(true)
      }}
      className="relative min-h-screen bg-gradient-to-b from-blue-800 to-blue-400 text-white shadow-xl flex flex-col"
    >
      {/* Botón toggle */}
      <button
        onClick={() => {
          setIsPinned(!isPinned)
          setIsCollapsed(!isPinned ? false : true)
        }}
        className="absolute -right-3 top-6 bg-white text-blue-600 rounded-full shadow-md p-1 hover:bg-gray-200 transition"
      >
        <ChevronIcon size={18} />
      </button>

      {/* Logo / título */}
      <div className="p-4 flex items-center gap-2">
        <DropletIcon className="w-6 h-6" />
        {!isCollapsed && (
          <h2 className="text-lg font-bold tracking-wide">Sistema Agua</h2>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-2 px-2 mt-4">
        {links.map((link, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05, x: 6 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <NavLinks href={link.href} icon={link.icon}>
              {!isCollapsed && link.label} {/* 👈 Solo texto si no está colapsado */}
            </NavLinks>
          </motion.div>
        ))}
      </nav>

      {/* Footer opcional */}
      {!isCollapsed && (
        <div className="mt-auto p-4 text-xs opacity-70">
          © {new Date().getFullYear()} Sistema Agua
        </div>
      )}
    </motion.aside>
  )
}
