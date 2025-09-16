'use client'

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import axios from "axios";
import { toast } from "react-hot-toast";

interface VincularTelegramProps {
  usuarioPredeterminado?: string;
}

export default function VincularTelegram({ usuarioPredeterminado = "" }: VincularTelegramProps) {
  const [usuario, setUsuario] = useState("");

  useEffect(() => {
    setUsuario(usuarioPredeterminado);
  }, [usuarioPredeterminado]);

  const [link, setLink] = useState("");
  const [cargando, setCargando] = useState(false);

  const generarLink = async () => {
    // Si el input esta vacio
    if (!usuario.trim()) {
      toast.error("Ingresa un nombre de usuario válido");
      return;
    }

    setCargando(true);
    try {
      const res = await axios.post("http://localhost:5000/api/generar-link-telegram", {
        usuario,
      });
      setLink(res.data.link);
    } catch (error: any) {
      setLink("");
      setLink("");

      toast.error(
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        "Error al generar link fron"
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <input
        type="text"
        placeholder="Ingrese el usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        className="border rounded px-3 py-2 w-48"
      />

      <button
        onClick={generarLink}
        disabled={cargando}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {cargando ? "Generando..." : "Generar link de Telegram"}
      </button>

      {link && (
        <div className="flex flex-col items-center mt-4 gap-2">
          <QRCode value={link} size={180} />

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline"
          >
            Abrir en Telegram
          </a>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={link}
              readOnly
              className="border rounded px-2 py-1 w-64 text-sm"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast.success("Link copiado al portapapeles");
              }}
              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm"
            >
              Copiar
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Si no puedes escanear el código QR, copia y abre este enlace en tu dispositivo.
          </p>
        </div>
      )}
    </div>
  );
}
