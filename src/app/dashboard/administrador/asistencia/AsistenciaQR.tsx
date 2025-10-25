'use client'
import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode'
import toast from 'react-hot-toast'
import axios from 'axios'

type Props = {
  meetingId: string
  fecha: string
  onSuccess?: (res: any) => void
  onCameraError?: (error: string) => void
}

export default function AsistenciaQR({ meetingId, fecha, onSuccess, onCameraError }: Props) {
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const divId = `qr-reader-${meetingId}`
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      #${divId} video {
        transform: scaleX(-1);
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
      if (html5QrcodeRef.current) html5QrcodeRef.current.stop().catch(() => { })
    }
  }, [divId])

  const startScanner = async () => {
    setError(null)
    try {
      const config: Html5QrcodeCameraScanConfig = { fps: 10, qrbox: { width: 280, height: 280 } }
      const html5Qr = new Html5Qrcode(divId)
      html5QrcodeRef.current = html5Qr
      setScanning(true)

      const cameras = await Html5Qrcode.getCameras()
      if (!cameras.length) throw new Error('No se detectó ninguna cámara.')
      const backCamera = cameras.find(c => /back|rear|environment/i.test(c.label)) || cameras[0]

      await html5Qr.start(
        backCamera.id,
        config,
        async (decodedText) => {
          try {
            if ((html5Qr as any).lastScanned === decodedText) return;
            (html5Qr as any).lastScanned = decodedText;

            //  Llamada al backend
            const { data } = await axios.post('/api/asistencia/registrar', {
              socioId: decodedText,
              fecha,
              idReunion: meetingId
            })

            toast.success(data?.mensaje || 'Registro exitoso', { position: 'top-center' })
            onSuccess?.(data)
          } catch (err: any) {
            const mensaje = err?.response?.data?.mensaje || 'Error al registrar asistencia.'
            toast.error(mensaje, { position: 'top-center' })
          }
          setTimeout(() => {
            (html5Qr as any).lastScanned = null
          }, 5000)
        },
        () => { }
      )
    } catch (err: any) {
      const msg = err?.message || 'Error al iniciar la cámara.'
      setError(msg)
      onCameraError?.(msg)
      setScanning(false)
    }
  }

  const stopScanner = async () => {
    if (html5QrcodeRef.current) {
      try { await html5QrcodeRef.current.stop() } catch { }
      setScanning(false)
    }
  }

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg flex flex-col items-center border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Escanear Código QR</h2>
      <div id={divId} className="w-full max-w-[500px]" />
      <div className="mt-4 flex gap-4">
        {!scanning ? (
          <button
            onClick={startScanner}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow transition-transform hover:scale-105"
          >
            Iniciar cámara
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl shadow transition-transform hover:scale-105"
          >
            Detener cámara
          </button>
        )}
      </div>
      {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
    </div>
  )
}