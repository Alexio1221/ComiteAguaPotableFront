import Dropdown from "@/app/componentes/layoutDashboard/componenteDropdown"
import { Menu } from "lucide-react"
import { useState } from "react"
import ruta from "@/api/axios"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import PerfilUsuarioModal from "@/app/modals/perfilModal"

export default function UserMenu() {
  const [abrirModal, setPerfilModal] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await ruta.post("/sesion/cerrar-sesion")
      localStorage.removeItem("rolUsuario");
      router.push("/")
      toast.success("Sesión cerrada correctamente")
    } catch (error: any) {
      //console.error(error)
      toast.error("No se pudo cerrar sesión")
    }
  }

  return (
    <div>
      <Dropdown
        trigger={
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200">
            <Menu className="w-5 h-5" />
            <span>Usuario</span>
          </div>
        }
        items={[
          { label: "Perfil", onClick: () => setPerfilModal(true) },
          { label: "Configuración", onClick: () => console.log("Configuración") },
          { label: "Cerrar sesión", onClick: handleLogout },
        ]}
      />
      {abrirModal && (
        <PerfilUsuarioModal
          isOpen={abrirModal}
          onClose={() => setPerfilModal(false)}
        />
      )}
    </div>
  )
}
