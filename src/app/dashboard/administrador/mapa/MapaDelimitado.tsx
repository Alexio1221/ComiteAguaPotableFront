"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from "react-leaflet";
const { BaseLayer } = LayersControl;
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import ruta from "@/api/axios";
import { toast } from "react-hot-toast";

const bounds: [[number, number], [number, number]] = [
  [-17.41546, -65.99998],
  [-17.40097, -65.96821],
];

// Icono para la oficina
const referenciaIcon = new L.Icon({
  iconUrl: '/imagenes/oficina.png',
  iconSize: [40, 50],
  iconAnchor: [20, 50],
})
//Iconos para los marcadores
const tanqueIcon = new L.Icon({
  iconUrl: '/imagenes/tanqueAgua.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
const valvulaIcon = new L.Icon({
  iconUrl: '/imagenes/valvula.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
const bombaDeAguaIcon = new L.Icon({
  iconUrl: '/imagenes/bombaDeAgua.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const obtenerIcono = (tipo: string) => {
  switch (tipo) {
    case "tanque":
      return tanqueIcon;
    case "valvula":
      return valvulaIcon;
    case "bomba":
      return bombaDeAguaIcon;
    default:
      return tanqueIcon;
  }
};

// Modal simple para guardar figuras
function ModalGuardar({ visible, onClose, onGuardar, figuraTemporal }: any) {
  const [nombre, setNombre] = useState("");
  const [subtipo, setSubtipo] = useState("tanque");

  if (!visible) return null;

  const esMarcador = figuraTemporal?.layerType === "marker";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[1000]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Guardar Componente</h2>
        <label className="text-sm text-gray-700">Descripcion del componente:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-1 mt-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: Tanque principal"
        />
        {esMarcador && (
          <>
            <label className="text-sm text-gray-700">Tipo de equipo hidráulico:</label>
            <select
              value={subtipo}
              onChange={(e) => setSubtipo(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-1 mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tanque">Tanque</option>
              <option value="valvula">Válvula</option>
              <option value="bomba">Bomba de agua</option>
            </select>
          </>
        )}
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
                toast.error("Ingresa un nombre antes de guardar");
                return;
              }
              console.log("Subtipo", subtipo);
              onGuardar(nombre, subtipo); // enviamos también el subtipo
              setNombre("");
              setSubtipo("tanque");
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
  const guardarFigura = async (nombre: string, subtipo: string) => {
    if (!figuraTemporal) return;
    const { geoJSON, layerType, layer } = figuraTemporal;

    if (layerType === "marker") {
      geoJSON.properties = { ...geoJSON.properties, subtipo }; // agregamos el icono si es un marcador
    }

    try {
      const res = await ruta.post("/mapa", {
        nombre,
        tipo: layerType,
        geojson: geoJSON,
      });

      if (res.status === 201) {
        const nuevaFigura = res.data;
        // asignar icono si es marcador
        if (layerType === "marker") {
          layer.setIcon(obtenerIcono(subtipo));
        }
        drawnItems.addLayer(layer);
        layersRef.current.set(nuevaFigura.idFigura, layer);
        setFiguras([...figuras, nuevaFigura]);
      }
    } catch (err) {
      //console.error("Error al guardar figura:", err);
      toast.error("Error al guardar la figura");
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
      draw: {
        polygon: { allowIntersection: false, shapeOptions: { color: "#040B69" } },
        rectangle: { shapeOptions: { color: "#00FF15" } },
        circle: { shapeOptions: { color: "#00FBFF" } },
        polyline: { shapeOptions: { color: "#8C8D8F", weight: 3 } },
        marker: true,
        circlemarker: false,
      },
    });
    (L as any).drawLocal.draw.toolbar.buttons = {
      polygon: "Área de Incidente / Mantenimiento",
      rectangle: "Área de Incidente / Mantenimiento",
      circle: "Área de Incidente / Mantenimiento",
      polyline: "Tuberia",
      marker: "Equipo Hidráulico",
    };

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

      if (f.tipo === "marker") {
        const [lng, lat] = f.geojson.geometry.coordinates;
        layer = L.marker([lat, lng], { icon: obtenerIcono(f.geojson.properties.subtipo) }) // <-- aquí usamos subtipo
          .bindPopup(f.nombre);
      } else if (f.tipo === "circle" && f.geojson.radius) {
        const [lng, lat] = f.geojson.geometry.coordinates;
        layer = L.circle([lat, lng], {
          radius: f.geojson.radius,
          color: f.idFigura === figuraSeleccionada ? "red" : "#FFAE00",
          weight: 3,
        }).bindPopup(f.nombre);
      } else if (f.tipo === "polyline") {
        layer = L.geoJSON(f.geojson, {
          style: () => ({
            color: f.idFigura === figuraSeleccionada ? "red" : "#8C8D8F",
            weight: 3,
          }),
        }).bindPopup(f.nombre);
      } else {
        layer = L.geoJSON(f.geojson, {
          style: () => ({
            color: f.idFigura === figuraSeleccionada ? "red" : "#FFAE00",
            weight: 3,
          }),
        }).bindPopup(f.nombre);
      }

      layer.addTo(map);
      layersRef.current.set(f.idFigura, layer);
    });
  }, [figuras, figuraSeleccionada, map]);

  return (
    <ModalGuardar
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      onGuardar={guardarFigura}
      figuraTemporal={figuraTemporal}
    />
  );
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
      minZoom={16}
      maxZoom={18}
      className="w-full h-[400px] lg:h-[750px]"
    >
      <LayersControl position="topright">
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
        <RestrictedAreaMask />
        <DrawControl
          figuras={figuras}
          setFiguras={setFiguras}
          figuraSeleccionada={figuraSeleccionada}
          setFiguraSeleccionada={setFiguraSeleccionada}
        />
        <Marker position={[-17.405066347785226, -65.98441004854527]} icon={referenciaIcon}>
          <Popup>{"Oficina central"}</Popup>
        </Marker>
      </LayersControl>
    </MapContainer>
  );
}
