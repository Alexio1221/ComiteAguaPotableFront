"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

const bounds: [[number, number], [number, number]] = [
  [-17.41546, -65.99998], // suroeste
  [-17.40097, -65.96821], // noreste
];

// Componente para crear la máscara roja fuera del área permitida
function RestrictedAreaMask() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Coordenadas del área permitida
    const [[minLat, minLng], [maxLat, maxLng]] = bounds;
    
    // Crear un polígono que cubra todo el mundo menos el área permitida
    // Usamos coordenadas extremas para asegurar cobertura total
    const worldBounds: [number, number][] = [
      [-90, -180],  // Polo sur, oeste extremo
      [-90, 180],   // Polo sur, este extremo  
      [90, 180],    // Polo norte, este extremo
      [90, -180],   // Polo norte, oeste extremo
      [-90, -180]   // Cerrar el polígono
    ];

    // Área permitida (como un "agujero" en el polígono mundial)
    const allowedArea: [number, number][] = [
      [minLat, minLng],
      [minLat, maxLng], 
      [maxLat, maxLng],
      [maxLat, minLng],
      [minLat, minLng] // Cerrar el polígono
    ];

    // Crear polígono con agujero (mundo completo menos área permitida)
    const restrictedPolygon = L.polygon([worldBounds, allowedArea] as L.LatLngExpression[][], {
      color: 'red',
      fillColor: 'red',
      fillOpacity: 0.3,
      weight: 0, // Sin borde
      interactive: false // No interfiere con las interacciones del usuario
    });

    // Agregar al mapa
    restrictedPolygon.addTo(map);

    // Opcional: Agregar un borde al área permitida para mayor claridad
    const allowedAreaBorder = L.rectangle([[minLat, minLng], [maxLat, maxLng]] as L.LatLngBoundsExpression, {
      color: 'green',
      fillOpacity: 0,
      weight: 3,
      dashArray: '10, 5',
      interactive: false
    });

    allowedAreaBorder.addTo(map);

    // Cleanup
    return () => {
      map.removeLayer(restrictedPolygon);
      map.removeLayer(allowedAreaBorder);
    };
  }, [map]);

  return null;
}

// Componente separado para manejar los controles de dibujo
function DrawControl({ onDibujos }: { onDibujos: (dibujos: any[]) => void }) {
  const map = useMap();
  const [drawnItems] = useState(() => new L.FeatureGroup());
  const [dibujos, setDibujos] = useState<any[]>([]);

  useEffect(() => {
    if (!map) return;

    // Configurar iconos de marcadores
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    // Agregar el grupo de elementos dibujados al mapa
    map.addLayer(drawnItems);

    // Configurar control de dibujo
    const drawControl = new L.Control.Draw({
      edit: { 
        featureGroup: drawnItems,
        remove: true
      },
      draw: {
        polygon: {  //poligono
          allowIntersection: false,
          drawError: {
            color: '#000000',
            message: '<strong>Error:</strong> Las líneas no pueden cruzarse!'
          },
          shapeOptions: {
            color: '#040B69'
          }
        },
        rectangle: {
          shapeOptions: {
            color: '#00FF15'
          }
        },
        circle: {
          shapeOptions: {
            color: '#FF0000'
          }
        },
        marker: true,
        polyline: {   //linea
          shapeOptions: {
            color: '#00FBFF',
            weight: 3
          }
        },
        circlemarker: false,
      },
    });

    map.addControl(drawControl);

    // Event listeners para dibujo
    const handleDrawCreated = (event: any) => {
      const layer = event.layer;
      const layerType = event.layerType;

      // Función auxiliar para validar si un punto está dentro de los bounds
      const isPointInBounds = (lat: number, lng: number) => {
        const [[minLat, minLng], [maxLat, maxLng]] = bounds;
        return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
      };

      // Validación según el tipo de geometría
      let isValid = true;
      let errorMessage = "";

      switch (layerType) {
        case 'circle':
          const center = layer.getLatLng();
          const radius = layer.getRadius();
          
          // Calcular bounds aproximados del círculo
          const radiusInDegrees = radius / 111320; // Conversión aproximada metros a grados
          const circleBounds = {
            north: center.lat + radiusInDegrees,
            south: center.lat - radiusInDegrees,
            east: center.lng + radiusInDegrees,
            west: center.lng - radiusInDegrees
          };

          const [[minLat, minLng], [maxLat, maxLng]] = bounds;
          
          if (circleBounds.south < minLat || circleBounds.north > maxLat || 
              circleBounds.west < minLng || circleBounds.east > maxLng) {
            isValid = false;
            errorMessage = "El círculo excede el área permitida";
          }
          break;

        case 'marker':
          const markerPosition = layer.getLatLng();
          if (!isPointInBounds(markerPosition.lat, markerPosition.lng)) {
            isValid = false;
            errorMessage = "Marcador fuera del área permitida";
          }
          break;

        case 'polygon':
        case 'rectangle':
        case 'polyline':
          // Para elementos con getBounds
          if (layer.getBounds) {
            const layerBounds = layer.getBounds();
            const [[minLat, minLng], [maxLat, maxLng]] = bounds;

            if (layerBounds.getSouth() < minLat || layerBounds.getNorth() > maxLat || 
                layerBounds.getWest() < minLng || layerBounds.getEast() > maxLng) {
              isValid = false;
              errorMessage = `${layerType} fuera del área permitida`;
            }
          }
          // Para polyline, también validar cada punto
          else if (layerType === 'polyline' && layer.getLatLngs) {
            const points = layer.getLatLngs();
            for (const point of points) {
              if (!isPointInBounds(point.lat, point.lng)) {
                isValid = false;
                errorMessage = "Línea fuera del área permitida";
                break;
              }
            }
          }
          break;

        default:
          console.log("Tipo de geometría no reconocido:", layerType);
      }

      if (!isValid) {
        alert(errorMessage);
        return;
      }

      drawnItems.addLayer(layer);
      const geoJSON = layer.toGeoJSON();
      
      // Agregar información adicional del tipo de geometría
      (geoJSON as any).layerType = layerType;
      if (layerType === 'circle') {
        (geoJSON as any).radius = layer.getRadius();
      }
      
      const nuevosDibujos = [...dibujos, geoJSON];
      setDibujos(nuevosDibujos);
      onDibujos(nuevosDibujos);
      console.log(`Nuevo ${layerType} creado:`, geoJSON);
    };

    const handleDrawEdited = (event: any) => {
      console.log("Dibujos editados:", event);
    };

    const handleDrawDeleted = (event: any) => {
      console.log("Dibujos eliminados:", event);
      // Actualizar el estado eliminando los elementos borrados
      const deletedLayers = event.layers;
      let dibujosActualizados = [...dibujos];
      
      deletedLayers.eachLayer(() => {
        // Aquí podrías implementar lógica más específica para eliminar del estado
        dibujosActualizados = dibujosActualizados.slice(0, -1); // Simplificado
      });
      
      setDibujos(dibujosActualizados);
      onDibujos(dibujosActualizados);
    };

    map.on('draw:created', handleDrawCreated);
    map.on('draw:edited', handleDrawEdited);
    map.on('draw:deleted', handleDrawDeleted);

    // Cleanup
    return () => {
      map.off('draw:created', handleDrawCreated);
      map.off('draw:edited', handleDrawEdited);
      map.off('draw:deleted', handleDrawDeleted);
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, drawnItems, dibujos, onDibujos]);

  return null; // Este componente no renderiza nada visible
}

export default function MapaDelimitado() {
  const [dibujos, setDibujos] = useState<any[]>([]);

  const handleDibujos = (nuevosDibujos: any[]) => {
    setDibujos(nuevosDibujos);
  };

  return (
    <div className="relative z-0">
      <MapContainer
        center={[-17.408, -65.985]}
        zoom={15}
        scrollWheelZoom
        maxBounds={bounds}
        minZoom={15}
        maxZoom={18}
        className="h-[500px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Agregar la máscara roja */}
        <RestrictedAreaMask />
        
        <DrawControl onDibujos={handleDibujos} />
      </MapContainer>
      
      {/* Panel de información */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <div className="mb-3 text-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 bg-red-500 bg-opacity-30 border border-red-500"></div>
            <span>Área restringida (no se puede dibujar)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-green-500 border-dashed"></div>
            <span>Área permitida para dibujar</span>
          </div>
        </div>
        
        {dibujos.length > 0 && (
          <>
            <h3 className="font-semibold mb-2">
              Dibujos realizados: {dibujos.length}
            </h3>
            <div className="flex gap-2 mb-2 flex-wrap">
              <button 
                onClick={() => console.log("Todos los dibujos:", dibujos)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Ver en Console
              </button>
              <button 
                onClick={() => {
                  const jsonString = JSON.stringify(dibujos, null, 2);
                  navigator.clipboard.writeText(jsonString);
                  alert("Datos copiados al portapapeles!");
                }}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Copiar JSON
              </button>
              <button 
                onClick={() => {
                  setDibujos([]);
                  window.location.reload();
                }}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Limpiar Todo
              </button>
            </div>
            <div className="mb-2 text-sm text-gray-600">
              Tipos: {dibujos.map((d, i) => (
                <span key={i} className="inline-block bg-gray-200 rounded px-2 py-1 mr-1 mb-1">
                  {(d as any).layerType || d.geometry?.type || 'unknown'}
                  {(d as any).radius && ` (${Math.round((d as any).radius)}m)`}
                </span>
              ))}
            </div>
            <details className="text-xs">
              <summary className="cursor-pointer font-medium">
                Ver datos JSON (click para expandir)
              </summary>
              <pre className="mt-2 p-2 bg-gray-200 rounded overflow-auto max-h-32">
                {JSON.stringify(dibujos, null, 2)}
              </pre>
            </details>
          </>
        )}
      </div>
    </div>
  );
}