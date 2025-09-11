'use client'

import { useState } from "react";
import QRCode from "react-qr-code";
import axios from "axios";

export default function VincularTelegramPrueba() {
  const [idUsuario, setIdUsuario] = useState<number | "">("");
  const [link, setLink] = useState("");
  const [cargando, setCargando] = useState(false);

  const generarLink = async () => {
    if (!idUsuario) {
      alert("Ingresa un ID de usuario válido");
      return;
    }

    setCargando(true);
    try {
      const res = await axios.post("http://localhost:5000/api/generar-link-telegram", {
        idUsuario,
      });
      setLink(res.data.link);
    } catch (error) {
      console.error(error);
      alert("Error generando link");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <input
        type="number"
        placeholder="ID del usuario"
        value={idUsuario}
        onChange={(e) => setIdUsuario(Number(e.target.value))}
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
        </div>
      )}
    </div>
  );
}
