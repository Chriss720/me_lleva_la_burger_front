import React from 'react';

interface StatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'success' | 'error';
    title: string;
    message: string;
    imageSrc?: string; // Optional image (e.g., for success)
}

export const StatusModal: React.FC<StatusModalProps> = ({ isOpen, onClose, type, title, message, imageSrc }) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';
    const borderColor = isSuccess ? 'border-[#FFC72C]' : 'border-red-600';
    const titleColor = isSuccess ? 'text-[#FFC72C]' : 'text-red-500';
    const buttonColor = isSuccess ? 'bg-[#FFC72C] text-black hover:bg-yellow-400' : 'bg-red-600 text-white hover:bg-red-700';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm p-4 animate-fade-in">
            <div className={`bg-[#1a1a1a] border-2 ${borderColor} rounded-xl shadow-2xl max-w-md w-full overflow-hidden text-center p-8 transform transition-all scale-100 animate-bounce-in`}>

                <h2 className={`text-3xl font-extrabold ${titleColor} mb-4`}>{title}</h2>

                {imageSrc && (
                    <div className="flex justify-center mb-6">
                        <img
                            src={imageSrc}
                            alt="Status"
                            className="rounded-lg max-h-64 object-cover border-4 border-white/10"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                    </div>
                )}

                {!imageSrc && !isSuccess && (
                    <div className="flex justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                )}

                <p className="text-xl text-white font-bold mb-2">{isSuccess ? '¡Gracias por tu compra!' : '¡Ups! Algo salió mal'}</p>
                <p className="text-gray-400 mb-6">{message}</p>

                <button
                    onClick={onClose}
                    className={`${buttonColor} px-8 py-3 rounded-full font-bold transition w-full`}
                >
                    {isSuccess ? 'Volver al Inicio' : 'Intentar de Nuevo'}
                </button>
            </div>
        </div>
    );
};
