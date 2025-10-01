export function NavLinks({ mode = "mobile" }) {
  const baseLinks = (
    <>
      <a href="#" className={`${mode === "desktop" ? "relative group" : "block"} py-2 hover:text-blue-100 transition-colors font-medium`}>
        Inicio
        {mode === "desktop" && <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>}
      </a>
      <a href="#nosotros" className={`${mode === "desktop" ? "relative group" : "block"} py-2 hover:text-blue-100 transition-colors font-medium`}>
        Nosotros
        {mode === "desktop" && <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>}
      </a>
      <a href="#ubicacion" className={`${mode === "desktop" ? "relative group" : "block"} py-2 hover:text-blue-100 transition-colors font-medium`}>
        Ubicación
        {mode === "desktop" && <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>}
      </a>
      <a href="#mision-vision" className={`${mode === "desktop" ? "relative group" : "block"} py-2 hover:text-blue-100 transition-colors font-medium`}>
        Misión y Visión
        {mode === "desktop" && <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>}
      </a>
      <a href="#noticias-avisos" className={`${mode === "desktop" ? "relative group" : "block"} py-2 hover:text-blue-100 transition-colors font-medium`}>
        Noticias y Avisos
        {mode === "desktop" && <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>}
      </a>
    </>
  );

  if (mode === "desktop") {
    return (
      <nav className="hidden md:flex items-center gap-8 text-white">
        {baseLinks}
      </nav>
    );
  }

  // Mobile version
  return (
    <div className="space-y-2">
      {baseLinks}
    </div>
  );
}