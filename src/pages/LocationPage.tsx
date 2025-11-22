import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const LocationPage = () => {
    return (
        <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-[#FFC72C] mb-8 text-center uppercase tracking-wider">
                        Nuestra Ubicación
                    </h1>

                    <div className="bg-black border-2 border-[#FFC72C] rounded-lg p-6 shadow-xl">
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="text-white">
                                <h2 className="text-2xl font-bold text-[#DA291C] mb-4">Visítanos</h2>
                                <p className="text-lg mb-2">Morelia, Michoacán</p>
                                <p className="text-gray-400 mb-6">
                                    ¡Ven a probar las mejores hamburguesas de la ciudad!
                                    Estamos ubicados en el corazón de Morelia.
                                </p>

                                <h3 className="text-xl font-bold text-[#FFC72C] mb-2">Horario</h3>
                                <ul className="text-gray-300 space-y-1">
                                    <li>Lunes a Jueves: 12:00 PM - 10:00 PM</li>
                                    <li>Viernes y Sábado: 12:00 PM - 11:00 PM</li>
                                    <li>Domingo: 1:00 PM - 9:00 PM</li>
                                </ul>
                            </div>

                            <div className="h-64 md:h-auto bg-gray-800 rounded-lg overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60087.37666424526!2d-101.24707766875002!3d19.702423200000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842d0ba2d2985609%3A0x714d722a2b07202!2sCatedral%20de%20Morelia!5e0!3m2!1sen!2smx!4v1700000000000!5m2!1sen!2smx"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Mapa de Ubicación"
                                ></iframe>
                            </div>
                        </div>

                        <div className="text-center">
                            <a
                                href="https://maps.google.com/?q=Morelia,Michoacan"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-[#DA291C] text-white font-bold py-3 px-8 rounded-full hover:bg-[#b91c1c] transition-colors duration-300 uppercase tracking-wide"
                            >
                                Cómo llegar
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
