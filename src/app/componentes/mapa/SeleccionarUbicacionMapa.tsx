'use client'

import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import ruta from '@/api/axios'

interface UbicacionSelectorProps {
  ubicacionActual?: {
    idMedidor?: number
    latitud: number
    longitud: number
  }
  onSelect?: (lat: number, lng: number) => void
  referencia?: { lat: number; lng: number; nombre?: string }
}

interface Medidor {
  idMedidor: number
  nombreSocio: string
  direccion: string
  latitud: number
  longitud: number
  idUbicacion?: number
}

const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const socioIcon = new L.Icon({
  iconUrl: '/imagenes/ubicacionSocio.png',
  iconSize: [30, 45],
  iconAnchor: [15, 45],
})

const referenciaIcon = new L.Icon({
  iconUrl: '/imagenes/oficina.png',
  iconSize: [40, 50],
  iconAnchor: [20, 50],
})

const UbicacionSelector: React.FC<UbicacionSelectorProps> = ({
  ubicacionActual,
  onSelect,
  referencia,
}) => {
  const defaultCenter = { lat: -17.40935, lng: -65.983899 }

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    ubicacionActual?.latitud && ubicacionActual?.longitud
      ? { lat: ubicacionActual.latitud, lng: ubicacionActual.longitud }
      : null
  )

  const [medidores, setMedidores] = useState<Medidor[]>([])

  // Cargar medidores (excepto el del medidor actual)
  useEffect(() => {
    const fetchMedidores = async () => {
      try {
        const { data } = await ruta.get(`/mapa/ubicaciones/${ubicacionActual?.idMedidor}`)
        setMedidores(data)
      } catch (error) {
        console.error('Error al cargar los medidores:', error)
      }
    }
    fetchMedidores()
  }, [ubicacionActual?.idMedidor])

  // Actualizar marcador cuando cambian props
  useEffect(() => {
    if (ubicacionActual?.latitud && ubicacionActual?.longitud) {
      setPosition({ lat: ubicacionActual.latitud, lng: ubicacionActual.longitud })
    }
  }, [ubicacionActual])

  // Click en mapa para seleccionar ubicación nueva
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng
        setPosition({ lat, lng })
        onSelect?.(lat, lng)
      },
    })

    return position ? (
      <Marker position={position} icon={markerIcon}>
        <Popup>Ubicación seleccionada</Popup>
      </Marker>
    ) : null
  }

  return (
    <MapContainer
      center={[
        position?.lat || referencia?.lat || defaultCenter.lat,
        position?.lng || referencia?.lng || defaultCenter.lng,
      ]}
      zoom={15}
      className="w-full h-full min-h-[300px] rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Oficina de referencia */}
      {referencia && (
        <Marker position={[referencia.lat, referencia.lng]} icon={referenciaIcon}>
          <Popup>{referencia.nombre || 'Oficina central'}</Popup>
        </Marker>
      )}

      {/* Marcadores de otros medidores */}
      {medidores.map((m) => (
        <Marker key={m.idMedidor} position={[m.latitud, m.longitud]} icon={socioIcon}>
          <Popup>
            <p className="font-semibold">Medidor #{m.idMedidor}</p>
            <p>Socio: {m.nombreSocio}</p>
            <p>Dirección: {m.direccion}</p>
          </Popup>
        </Marker>
      ))}

      {/* Marcador del medidor actual o seleccionado */}
      <LocationMarker />
    </MapContainer>
  )
}

export default UbicacionSelector
