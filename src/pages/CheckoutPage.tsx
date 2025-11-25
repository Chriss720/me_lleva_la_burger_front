import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks';
import { Header } from '../components/layout/Header';
import { StatusModal } from '../components/common/StatusModal';

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { items, getTotal, checkout, addItem, removeItem, isLoading } = useCart();
    const [paymentMethod, setPaymentMethod] = useState<'Tarjeta' | 'Efectivo'>('Tarjeta');
    const [isProcessing, setIsProcessing] = useState(false);
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        title: string;
        message: string;
        imageSrc?: string;
    }>({
        isOpen: false,
        type: 'success',
        title: '',
        message: '',
    });

    const handleQuantityChange = async (product: any, change: number) => {
        if (change > 0) {
            await addItem(product, 1);
        } else {
            await removeItem(product.id_producto || product.id);
        }
    };

    const handleCheckout = async () => {
        try {
            setIsProcessing(true);
            await checkout(paymentMethod);
            setModalState({
                isOpen: true,
                type: 'success',
                title: '¡Pedido Recibido!',
                message: 'Tu pedido ha sido procesado exitosamente y pronto estará en camino.',
                imageSrc: '/static/images/RemGracias.gif'
            });
        } catch (error) {
            console.error('Error processing checkout:', error);
            setModalState({
                isOpen: true,
                type: 'error',
                title: 'Error de Pago',
                message: 'Hubo un error al procesar tu pago. Por favor verifica tu conexión o intenta más tarde.',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCloseModal = () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
        if (modalState.type === 'success') {
            navigate('/');
        }
    };

    if (items.length === 0 && !modalState.isOpen) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Header />
                <div className="container mx-auto px-4 py-12 text-center">
                    <h2 className="text-3xl font-bold text-[#FFC72C] mb-4">Tu carrito está vacío</h2>
                    <p className="text-gray-300 mb-8">Agrega algunas deliciosas hamburguesas para continuar.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-[#DA291C] text-white px-8 py-3 rounded-full font-bold hover:bg-[#b91c1c] transition"
                    >
                        Volver al Menú
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <Header />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex items-center mb-8">
                    <button onClick={() => navigate('/')} className="text-[#FFC72C] mr-4 hover:text-yellow-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold text-white">Resumen de Pedido</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Order Items */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333]">
                            <h2 className="text-xl font-bold text-[#FFC72C] mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Tus Productos
                            </h2>

                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between bg-[#222] p-4 rounded-lg border border-[#333]">
                                        <div className="flex items-center gap-4">
                                            {item.producto?.foto && (
                                                <img
                                                    src={item.producto.foto}
                                                    alt={item.producto.nombre_producto}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                            )}
                                            <div>
                                                <h3 className="font-bold text-white">{item.producto?.nombre_producto}</h3>
                                                <p className="text-[#FFC72C] font-bold">${Number(item.precio_unitario).toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 bg-[#111] rounded-full px-3 py-1">
                                            <button
                                                onClick={() => handleQuantityChange(item.producto, -1)}
                                                className="text-gray-400 hover:text-white font-bold text-lg w-6 h-6 flex items-center justify-center"
                                                disabled={isLoading}
                                            >
                                                -
                                            </button>
                                            <span className="font-bold w-4 text-center">{item.cantidad}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.producto, 1)}
                                                className="text-[#FFC72C] hover:text-yellow-300 font-bold text-lg w-6 h-6 flex items-center justify-center"
                                                disabled={isLoading}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333]">
                            <h2 className="text-xl font-bold text-[#FFC72C] mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                Método de Pago
                            </h2>

                            <div className="space-y-3">
                                <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'Tarjeta' ? 'bg-[#2a2a2a] border-[#FFC72C]' : 'bg-[#222] border-[#333] hover:bg-[#2a2a2a]'}`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="Tarjeta"
                                            checked={paymentMethod === 'Tarjeta'}
                                            onChange={() => setPaymentMethod('Tarjeta')}
                                            className="text-[#FFC72C] focus:ring-[#FFC72C]"
                                        />
                                        <span className="font-bold">Tarjeta de Crédito/Débito</span>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </label>

                                <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'Efectivo' ? 'bg-[#2a2a2a] border-[#FFC72C]' : 'bg-[#222] border-[#333] hover:bg-[#2a2a2a]'}`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="Efectivo"
                                            checked={paymentMethod === 'Efectivo'}
                                            onChange={() => setPaymentMethod('Efectivo')}
                                            className="text-[#FFC72C] focus:ring-[#FFC72C]"
                                        />
                                        <span className="font-bold">Efectivo</span>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333] sticky top-24">
                            <h2 className="text-xl font-bold text-[#FFC72C] mb-6">Resumen de Pago</h2>

                            <div className="space-y-3 mb-6 text-gray-300">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${getTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Envío</span>
                                    <span className="text-[#FFC72C]">Gratis</span>
                                </div>
                                <div className="border-t border-gray-700 my-2 pt-2 flex justify-between text-white font-bold text-xl">
                                    <span>Total</span>
                                    <span>${getTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing || items.length === 0}
                                className="w-full bg-[#DA291C] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#b91c1c] transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Procesando...
                                    </>
                                ) : (
                                    'Realizar Pedido'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <StatusModal
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                type={modalState.type}
                title={modalState.title}
                message={modalState.message}
                imageSrc={modalState.imageSrc}
            />
        </div>
    );
};

export default CheckoutPage;
