"use client"

import UserMenu from "./UserMenu"
import { useState, useEffect } from "react"
import ruta from "@/api/axios"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import Dropdown from "@/app/componentes/componenteDropdown"

interface HeaderProps {
  rol: string
  setRol: (rol: string) => void
}

interface Rol {
  nombreRol: string
  descripcion: string
}

export default function Header({ rol, setRol }: HeaderProps) {
  const [roles, setRoles] = useState<Rol[]>([])

  useEffect(() => {
    const fetchFunciones = async () => {
      try {
        const response = await ruta.get(`/auth/roles-usuario-actual`)
        setRoles(response.data.roles)
      } catch (error) {
        return;
      }
    }

    fetchFunciones()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRol(e.target.value)
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-16 shadow-lg bg-gradient-to-r from-blue-800 to-blue-400 flex items-center justify-between px-6 text-white"
    >
      {/* Título */}
      <h1 className="font-bold text-xl tracking-wide">Dashboard</h1>

      {/* Controles derecha: select de rol + UserMenu */}
      <div className="flex items-center gap-4">
        {/* Select de roles */}
        <motion.div
          whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0,0,0,0.2)" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Dropdown
            trigger={
              <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-white text-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200">
                <span>{rol}</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </div>
            }
            items={roles.map((r) => ({
              label: r.nombreRol,
              onClick: () => setRol(r.nombreRol),
            }))}
          />
        </motion.div>
        {/* UserMenu animado */}
        <motion.div
          whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0,0,0,0.2)" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <UserMenu />
        </motion.div>
      </div>
    </motion.header>

  )
}
