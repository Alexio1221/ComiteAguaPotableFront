"use client"

import { useState, useEffect } from "react"
import iconMap, { IconName } from "@/iconos/iconos"
import NavLinks from "./NavLinks"
import ruta from "@/api/axios"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from 'next/navigation'

interface SidebarProps {
  rol: string
  visible: boolean 
  onClose?: () => void 
}

interface Funcion {
  nombreFuncion: string
  icono: IconName
}

export default function Sidebar({ rol, visible, onClose }: SidebarProps) {
  const router = useRouter()
  const [funciones, setFunciones] = useState<Funcion[]>([])
  const DropletIcon = iconMap["Droplet"]

  useEffect(() => {
    const fetchFunciones = async () => {
      try {
        const response = await ruta.get(`/auth/funciones/${rol}`)
        setFunciones(response.data.funciones)
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 400) {
          router.push('/')
        }
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
    <AnimatePresence>
      {visible && (
        <>
          {/* Fondo semitransparente (solo visible en móviles) */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 z-[99] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} // cierra al hacer clic fuera
          />

          {/* Sidebar */}
          <motion.aside
            key="sidebar"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="
              fixed md:static top-0 left-0
              z-50 md:z-[51]
              min-h-screen w-64
              bg-gradient-to-b from-blue-800 to-blue-400
              text-white shadow-xl flex flex-col
            "
          >
            {/* Logo / título */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DropletIcon className="w-6 h-6" />
                <h2 className="text-lg font-bold tracking-wide">Sistema Agua</h2>
              </div>

              {/* Botón cerrar solo en móviles */}
              <button
                onClick={onClose}
                className="md:hidden bg-white/20 hover:bg-white/30 rounded-full p-1"
              >
                ✕
              </button>
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
                    {link.label}
                  </NavLinks>
                </motion.div>
              ))}
            </nav>

            {/* Footer */}
            <div className="mt-auto p-4 text-xs opacity-70">
              © {new Date().getFullYear()} Sistema Agua
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
