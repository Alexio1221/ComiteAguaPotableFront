"use client"; // Para habilitar hooks y estado

import { useState } from "react";
import { useRouter } from "next/navigation";
import ruta from "../../api/axios"; //Archivo configurado para las peticiones

export function FormularioLogin() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await ruta.post(
        "/auth/login",
        { usuario, contraseña }
      );

      if (response.status === 200) {
        router.push("/dashboard");
      }
    } catch (err: any) {
      // Si el backend devuelve error, mostrar mensaje en rojo
      if (err.response && err.response.data && err.response.data.mensaje) {
        setError(err.response.data.mensaje);
      } else {
        setError("Error de conexión, intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
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
        <p className="mt-2 text-red-500 text-sm text-center">{error}</p>
      )}

      <a
        href="#"
        className="text-sm underline text-white hover:text-blue-300"
      >
        ¿Olvidaste tu contraseña?
      </a>
    </form>
  );
}
