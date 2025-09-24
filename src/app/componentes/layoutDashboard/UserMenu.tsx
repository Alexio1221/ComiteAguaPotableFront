import Dropdown from "@/app/componentes/layoutDashboard/componenteDropdown"
import { Menu } from "lucide-react"
import ruta from "@/api/axios"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

export default function UserMenu() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await ruta.post("/sesion/cerrar-sesion")
      router.push("/")
      toast.success("Sesión cerrada correctamente")
    } catch (error: any) {
      //console.error(error)
      toast.error("No se pudo cerrar sesión")
    }
  }

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
        { label: "Cerrar sesión", onClick: handleLogout },
      ]}
    />
  )
}
