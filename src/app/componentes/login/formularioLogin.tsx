"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ruta from "../../../api/axios";
import RecuperarPasswordModal from "../../modals/verificacionModal";
import CambiarPasswordModal from "../../modals/cambiarPasswordModal"; 
import { toast } from "react-hot-toast"

export function FormularioLogin() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalRecuperar, setModalRecuperar] = useState(false);
  const [modalCambiarPassword, setModalCambiarPassword] = useState(false);
  const [usuarioVerificado, setUsuarioVerificado] = useState<string | null>(null);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await ruta.post(
        "/sesion/login",
        { usuario, contraseña }
      );

      if (response.status === 200) {
        router.push("/dashboard");
        toast.success("Bienvenido " + response.data.usuario.nombre);
      }
    } catch (err: any) {
      if (err.response?.data?.mensaje) setError(err.response.data.mensaje);
      else setError("Error de conexión, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Callback que ejecuta el modal de recuperación cuando se verifica el código
  const handleCodigoVerificado = (usuario: string) => {
    setModalRecuperar(false);         // cerramos modal de recuperación
    setUsuarioVerificado(usuario);    // guardamos usuario
    setModalCambiarPassword(true);    // abrimos modal de cambio de contraseña
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center space-y-4 max-w-md mx-auto"
    >
      <input
        type="text"
        placeholder="Usuario"
        className="w-full px-4 py-2 rounded-full text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-opacity-85"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="w-full px-4 py-2 rounded-full text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-opacity-85"
        value={contraseña}
        onChange={(e) => setContraseña(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700 bg-opacity-85 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Cargando..." : "INGRESAR"}
      </button>

      {error && (
        <p className="mt-2 text-gray-100 text-sm text-center">{error}</p>
      )}

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setModalRecuperar(true);
        }}
        className="text-sm underline text-white hover:text-blue-300"
      >
        ¿Olvidaste tu contraseña?
      </a>

      {/* Modal de recuperación verificacion de codigo*/}
      <RecuperarPasswordModal
        isOpen={modalRecuperar}
        setIsOpen={setModalRecuperar}
        onVerificado={handleCodigoVerificado} // <-- le pasamos la callback
      />

      {/* Modal de cambio de contraseña */}
      <CambiarPasswordModal
        isOpen={modalCambiarPassword}
        setIsOpen={setModalCambiarPassword}
        usuario={usuarioVerificado}
      />
    </form>
  );
}
