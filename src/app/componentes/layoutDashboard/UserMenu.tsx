"use client"

import { useState } from "react"
import { Menu } from "lucide-react"

export default function UserMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
        onClick={() => setOpen(!open)}
      >
        <Menu className="w-5 h-5" />
        <span>Usuario</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md p-2">
          <button className="block w-full text-left p-2 hover:bg-gray-100 rounded">
            Perfil
          </button>
          <button className="block w-full text-left p-2 hover:bg-gray-100 rounded">
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  )
}
