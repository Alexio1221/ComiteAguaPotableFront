import Dropdown from "@/app/componentes/componenteDropdown"
import { Menu } from "lucide-react"

export default function UserMenu() {
  return (
    <Dropdown
      trigger={
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200">
          <Menu className="w-5 h-5" />
          <span>Usuario</span>
        </div>
      }
      items={[
        { label: "Perfil", onClick: () => console.log("Perfil") },
        { label: "Configuración", onClick: () => console.log("Configuración") },
        { label: "Cerrar sesión", onClick: () => console.log("Cerrar sesión") },
      ]}
    />
  )
}
