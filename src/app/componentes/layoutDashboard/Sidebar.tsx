"use client"

import { Home, Users, Wrench, CreditCard, Droplets } from "lucide-react"
import NavLinks from "./NavLinks"

const links = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/dashboard/usuarios", label: "Usuarios", icon: Users },
  { href: "/dashboard/tecnico", label: "Técnico", icon: Wrench },
  { href: "/dashboard/pagos", label: "Pagos", icon: CreditCard },
  { href: "/dashboard/consumo", label: "Consumo", icon: Droplets },
]

export default function Sidebar() {
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
