'use client'

import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import ruta from '@/api/axios'

interface UbicacionSelectorProps {
  lat?: number
  lng?: number
  onSelect?: (lat: number, lng: number) => void
  referencia?: { lat: number; lng: number; nombre?: string }
}

interface Medidor {
  idMedidor: number
  nombreSocio: string
  direccion: string
  latitud: number
  longitud: number
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

const UbicacionSelector: React.FC<UbicacionSelectorProps> = ({ lat, lng, onSelect, referencia }) => {
  const defaultCenter = { lat: -17.40935, lng: -65.983899 }

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    lat && lng ? { lat, lng } : null
  )
  const [medidores, setMedidores] = useState<Medidor[]>([])

  // Cargar medidores con su ubicación
  useEffect(() => {
    const fetchMedidores = async () => {
      try {
        const { data } = await ruta.get('/mapa/ubicaciones')
        setMedidores(data)
      } catch (error) {
        console.error('Error al cargar los medidores:', error)
      }
    }
    fetchMedidores()
  }, [])

  // Actualizar marcador de selección cuando cambian props lat/lng
  useEffect(() => {
    if (lat && lng) setPosition({ lat, lng })
  }, [lat, lng])

  // Manejar clicks en el mapa
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
      center={[position?.lat || defaultCenter.lat, position?.lng || defaultCenter.lng]}
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

      {/* Marcadores de todos los medidores */}
      {medidores.map(m =>
        <Marker
          key={m.idMedidor}
          position={[m.latitud, m.longitud]}
          icon={socioIcon}
        >
          <Popup>
            <p className="font-semibold">Medidor #{m.idMedidor}</p>
            <p>Socio: {m.nombreSocio}</p>
            <p>Dirección: {m.direccion}</p>
            <p>Lat: {m.latitud.toFixed(5)} <br /> Lng: {m.longitud.toFixed(5)}</p>
          </Popup>
        </Marker>
      )}

      {/* Marcador de selección */}
      <LocationMarker />
    </MapContainer>
  )
}

export default UbicacionSelector
