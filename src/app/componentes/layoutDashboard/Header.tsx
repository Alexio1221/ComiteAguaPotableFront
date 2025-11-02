"use client"

import UserMenu from "./UserMenu"
import { useState, useEffect } from "react"
import ruta from "@/api/axios"
import { ChevronDown, User, Menu, X } from "lucide-react"
import { motion } from "framer-motion"
import Dropdown from "@/app/componentes/layoutDashboard/componenteDropdown"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

interface HeaderProps {
  rol: string
  setRol: (rol: string) => void
  visible: boolean
  setVisible: (visible: boolean) => void
}

interface Rol {
  nombreRol: string
  descripcion: string
}

export default function Header({ rol, setRol, visible, setVisible }: HeaderProps) {
  const router = useRouter();
  const [roles, setRoles] = useState<Rol[]>([])

  useEffect(() => {
    const fetchFunciones = async () => {
      try {
        const response = await ruta.get(`/auth/roles-usuario-actual`);
        setRoles(response.data.roles);

        // Revisar si hay rol guardado
        const savedRol = localStorage.getItem("rolUsuario");
        if (savedRol) {
          setRol(savedRol);
        } else {
          setRol(response.data.roles[0].nombreRol);
          localStorage.setItem("rolUsuario", response.data.roles[0].nombreRol);
        }
      } catch (error) {
        router.push("/");
        toast.error("Inicie sesión para continuar");
      }
    };

    fetchFunciones();
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-16 w-full max-w-full shadow-lg bg-gradient-to-r from-blue-800 to-blue-400 flex items-center justify-between px-4 sm:px-6 text-white relative z-[100]"
    >
      <div className="flex items-center gap-3">
        {/* Botón de sidebar */}
        <button
          onClick={() => setVisible(!visible)}
          className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
        >
          {visible ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Título */}
        <h1 className="font-bold text-xl tracking-wide truncate">Dashboard</h1>
      </div>

      {/* Controles derecha */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Select de roles */}
        <motion.div
          whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0,0,0,0.2)" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Dropdown
            trigger={
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white text-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200 sm:px-4 relative z-50">
                <span className="hidden sm:inline truncate max-w-[100px]">{rol}</span>
                <User className="sm:hidden w-5 h-5 text-gray-600" />
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </div>
            }
            items={roles.map((r) => ({
              label: r.nombreRol,
              onClick: () => {
                setRol(r.nombreRol);
                localStorage.setItem("rolUsuario", r.nombreRol);
                router.push("/dashboard");
              },
            }))}
          />
        </motion.div>

        {/* UserMenu */}
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
