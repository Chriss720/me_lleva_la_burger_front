export const Footer = () => {
  return (
    <footer className="bg-[#111] border-t-4 border-[#FFC72C] pt-16 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* About Section */}
          <div>
            <h3 className="text-[#FFC72C] font-bold text-2xl mb-6 uppercase font-oswald">Me Lleva la Burger</h3>
            <p className="text-gray-400 leading-relaxed">
              Las mejores hamburguesas de la ciudad, preparadas con pasión y los mejores ingredientes. ¡El sabor que te lleva!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#FFC72C] font-bold text-xl mb-6 uppercase">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-[#FFC72C] transition-colors flex items-center gap-2">
                  <span className="text-[#FFC72C]">›</span> Inicio
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#FFC72C] transition-colors flex items-center gap-2">
                  <span className="text-[#FFC72C]">›</span> Menú
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#FFC72C] transition-colors flex items-center gap-2">
                  <span className="text-[#FFC72C]">›</span> Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#FFC72C] transition-colors flex items-center gap-2">
                  <span className="text-[#FFC72C]">›</span> Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[#FFC72C] font-bold text-xl mb-6 uppercase">Contáctanos</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FFC72C] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-300">Av. Principal 123, Ciudad Burger</span>
              </li>
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FFC72C] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-300">+52 55 1234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FFC72C] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-300">hola@mellevalaburger.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; 2025 Me Lleva la Burger. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-[#FFC72C] text-sm transition-colors">Términos y Condiciones</a>
            <a href="#" className="text-gray-500 hover:text-[#FFC72C] text-sm transition-colors">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
