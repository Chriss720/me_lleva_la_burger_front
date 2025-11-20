export const Footer = () => {
  return (
    <footer className="bg-[#111] border-t-4 border-[#FFC72C] p-8 text-center mt-16">
      <nav>
        <ul className="flex justify-center gap-6 list-none mb-4">
          <li>
            <a href="#" className="text-white hover:text-[#FFC72C]">
              Contacto
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-[#FFC72C]">
              Ubicación
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-[#FFC72C]">
              Blog
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-[#FFC72C]">
              Términos y Condiciones
            </a>
          </li>
        </ul>
      </nav>
      <p className="text-gray-300">&copy; 2025 Me Lleva la Burger. Todos los derechos reservados.</p>
    </footer>
  );
};
