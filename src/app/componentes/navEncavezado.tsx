export function NavLinks({ mode = "mobile"}) {
  const baseLinks = (
    <>
      <a href="#inicio" className="block py-2 hover:text-gray-200">Inicio</a>
      <a href="#nosotros" className="block py-2 hover:text-gray-200">Nosotros</a>
      <a href="#ubicacion" className="block py-2 hover:text-gray-200">Ubicación</a>
      <a href="#mision-vision" className="block py-2 hover:text-gray-200">Misión y Visión</a>
      <a href="#noticias" className="block py-2 hover:text-gray-200">Noticias</a>
    </>
  );

  if (mode === "desktop") {
    return (
      <nav className={`hidden md:flex space-x-6`}>
        {baseLinks}
      </nav>
    );
  }

  // Mobile version
  return (
    <div className={`md:hidden bg-blue-600 px-4 pb-4 text-white`}>
      {baseLinks}
    </div>
  );
}
