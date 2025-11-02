"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import ruta from "@/api/axios";

const bounds: [[number, number], [number, number]] = [
  [-17.41546, -65.99998],
  [-17.40097, -65.96821],
];

// Modal simple para guardar figuras
function ModalGuardar({ visible, onClose, onGuardar }: any) {
  const [nombre, setNombre] = useState("");
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[1000]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Guardar figura</h2>
        <label className="text-sm text-gray-700">Nombre de la figura:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-1 mt-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: Tanque principal"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setNombre("");
              onClose();
            }}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!nombre.trim()) {
                alert("Ingresa un nombre antes de guardar");
                return;
              }
              onGuardar(nombre);
              setNombre("");
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

// Zona restringida del mapa
function RestrictedAreaMask() {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const [[minLat, minLng], [maxLat, maxLng]] = bounds;
    const worldBounds: [number, number][] = [
      [-90, -180], [-90, 180], [90, 180], [90, -180], [-90, -180],
    ];
    const allowedArea: [number, number][] = [
      [minLat, minLng], [minLat, maxLng], [maxLat, maxLng], [maxLat, minLng], [minLat, minLng],
    ];

    const restrictedPolygon = L.polygon([worldBounds, allowedArea] as any, {
      color: "red", fillColor: "red", fillOpacity: 0.3, weight: 0, interactive: false,
    });
    restrictedPolygon.addTo(map);

    const allowedAreaBorder = L.rectangle([[minLat, minLng], [maxLat, maxLng]] as any, {
      color: "green", fillOpacity: 0, weight: 3, dashArray: "10, 5", interactive: false,
    });
    allowedAreaBorder.addTo(map);

    return () => {
      map.removeLayer(restrictedPolygon);
      map.removeLayer(allowedAreaBorder);
    };
  }, [map]);
  return null;
}

// Control de dibujo y CRUD
function DrawControl({
  figuras,
  setFiguras,
  figuraSeleccionada,
  setFiguraSeleccionada
}: {
  figuras: any[],
  setFiguras: any,
  figuraSeleccionada: number | null,
  setFiguraSeleccionada: any
}) {
  const map = useMap();
  const [drawnItems] = useState(() => new L.FeatureGroup());
  const [modalVisible, setModalVisible] = useState(false);
  const [figuraTemporal, setFiguraTemporal] = useState<any>(null);
  const layersRef = useRef<Map<number, L.Layer>>(new Map());

  // Guardar figura
  const guardarFigura = async (nombre: string) => {
    if (!figuraTemporal) return;
    const { geoJSON, layerType, layer } = figuraTemporal;

    try {
      const res = await ruta.post("/mapa", { nombre, tipo: layerType, geojson: geoJSON });
      if (res.status === 201) {
        const nuevaFigura = res.data;
        drawnItems.addLayer(layer);
        layersRef.current.set(nuevaFigura.idFigura, layer);
        setFiguras([...figuras, nuevaFigura]);
      }
    } catch (err) {
      console.error("Error al guardar figura:", err);
      alert("Error al guardar la figura");
    } finally {
      setFiguraTemporal(null);
      setModalVisible(false);
    }
  };

  // Configurar Leaflet.Draw
  useEffect(() => {
    if (!map) return;

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    const drawControl = new L.Control.Draw({
      edit: { featureGroup: drawnItems, remove: false }, // deshabilitamos eliminar por Leaflet
      draw: {
        polygon: { allowIntersection: false, shapeOptions: { color: "#040B69" } },
        rectangle: { shapeOptions: { color: "#00FF15" } },
        circle: { shapeOptions: { color: "#00FBFF" } },
        polyline: { shapeOptions: { color: "#00FBFF", weight: 3 } },
        marker: true,
        circlemarker: false,
      },
    });
    map.addControl(drawControl);
    map.addLayer(drawnItems);

    map.on("draw:created", (e: any) => {
      const layer = e.layer;
      const layerType = e.layerType;
      const geoJSON = layer.toGeoJSON();
      (geoJSON as any).layerType = layerType;
      if (layerType === "circle") (geoJSON as any).radius = layer.getRadius();
      setFiguraTemporal({ layer, geoJSON, layerType });
      setModalVisible(true);
    });

    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map]);

  // Renderizar figuras existentes + selección
  useEffect(() => {
    if (!map) return;

    // limpiar layers
    layersRef.current.forEach(layer => map.removeLayer(layer));
    layersRef.current.clear();

    figuras.forEach(f => {
      let layer: L.Layer;

      if (f.tipo === "circle" && f.geojson.radius) {
        const [lng, lat] = f.geojson.geometry.coordinates;
        layer = L.circle([lat, lng], {
          radius: f.geojson.radius,
          color: f.idFigura === figuraSeleccionada ? "red" : "#FF0000",
          weight: 3,
        }).bindPopup(f.nombre);
      } else {
        layer = L.geoJSON(f.geojson, {
          style: () => ({
            color: f.idFigura === figuraSeleccionada ? "red" : "#040B69",
            weight: 3,
          }),
        }).bindPopup(f.nombre);
      }

      layer.addTo(map);
      layersRef.current.set(f.idFigura, layer);

      if (f.idFigura === figuraSeleccionada) layer.openPopup();
    });
  }, [figuras, figuraSeleccionada, map]);

  return <ModalGuardar visible={modalVisible} onClose={() => setModalVisible(false)} onGuardar={guardarFigura} />;
}

// Componente principal
export default function MapaDelimitado({
  figuras,
  setFiguras,
  figuraSeleccionada,
  setFiguraSeleccionada
}: {
  figuras: any[],
  setFiguras: any,
  figuraSeleccionada: number | null,
  setFiguraSeleccionada: any
}) {
  return (
    <MapContainer
      center={[-17.408, -65.985]}
      zoom={16}
      scrollWheelZoom
      maxBounds={bounds}
      minZoom={14}
      maxZoom={18}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RestrictedAreaMask />
      <DrawControl
        figuras={figuras}
        setFiguras={setFiguras}
        figuraSeleccionada={figuraSeleccionada}
        setFiguraSeleccionada={setFiguraSeleccionada}
      />
    </MapContainer>
  );
}
