'use client'

import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
const { BaseLayer } = LayersControl;
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import ruta from '@/api/axios'

interface UbicacionSelectorProps {
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

const UbicacionSelector: React.FC<UbicacionSelectorProps> = ({ referencia }) => {
  const defaultCenter = { lat: -17.40935, lng: -65.983899 }
  const [medidores, setMedidores] = useState<Medidor[]>([])

  useEffect(() => {
    const fetchMedidores = async () => {
      try {
        const { data } = await ruta.get('/mapa/ubicaciones/99999')
        setMedidores(data)
      } catch (error) {
        console.error('Error al cargar los medidores:', error)
      }
    }
    fetchMedidores()
  }, [])

  return (
    <MapContainer
      center={[
        referencia?.lat || defaultCenter.lat,
        referencia?.lng || defaultCenter.lng,
      ]}
      zoom={15}
      className="w-full h-full min-h-[300px] rounded-lg z-0"
    >
      <LayersControl position="topright">
        {/* Capa base: OpenStreetMap */}
        <BaseLayer checked name="Mapa OSM">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>

        {/* Capa base: Satélite */}
        <BaseLayer name="Satélite (Esri)">
          <TileLayer
            attribution="Tiles © Esri"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </BaseLayer>

        {/* Oficina o referencia */}
        {referencia && (
          <Marker position={[referencia.lat, referencia.lng]} icon={referenciaIcon}>
            <Popup>{referencia.nombre || "Oficina central"}</Popup>
          </Marker>
        )}

        {/* Marcadores de medidores */}
        {medidores.map((m) => (
          <Marker key={m.idMedidor} position={[m.latitud, m.longitud]} icon={socioIcon}>
            <Popup>
              <p className="font-semibold">Medidor #{m.idMedidor}</p>
              <p>Socio: {m.nombreSocio}</p>
              <p>Dirección: {m.direccion}</p>
            </Popup>
          </Marker>
        ))}
      </LayersControl>
    </MapContainer>
  )
}

export default UbicacionSelector
