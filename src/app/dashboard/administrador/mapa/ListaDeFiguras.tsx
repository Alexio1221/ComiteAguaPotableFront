'use client'

interface Figura{
  idFigura: number;
  nombre: string;
}

interface ListaProps {
  figuras: Figura[];
  figuraSeleccionada: number | null;
  setFiguraSeleccionada: (id: number) => void;
  eliminarFigura: (id: number) => void;
}

export default function ListaDeFiguras({ figuras, figuraSeleccionada, setFiguraSeleccionada, eliminarFigura }: ListaProps) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Figuras guardadas</h3>
      <ul>
        {figuras.map(f => (
          <li key={f.idFigura} className="flex justify-between items-center mb-2 p-1 rounded hover:bg-gray-200">
            <span
              className={`cursor-pointer ${f.idFigura === figuraSeleccionada ? "font-bold text-red-600" : ""}`}
              onClick={() => setFiguraSeleccionada(f.idFigura)}
            >
              {f.nombre}
            </span>
            <button
              onClick={() => eliminarFigura(f.idFigura)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
