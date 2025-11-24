import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
                    <div className="max-w-2xl w-full bg-[#1a1a1a] border-2 border-[#DA291C] rounded-xl p-8 shadow-2xl">
                        <h1 className="text-4xl text-[#FFC72C] font-oswald font-bold mb-6 uppercase">
                            ¡Ups! Algo salió mal
                        </h1>
                        <div className="bg-[#222] p-4 rounded-lg mb-6 overflow-auto max-h-60 border border-gray-700">
                            <p className="text-red-400 font-mono text-lg mb-2">
                                {this.state.error?.toString()}
                            </p>
                            {this.state.errorInfo && (
                                <pre className="text-gray-400 text-sm font-mono whitespace-pre-wrap">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 bg-[#FFC72C] text-black font-bold py-3 px-6 rounded-full hover:bg-yellow-400 transition-colors uppercase"
                            >
                                Recargar Página
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.href = '/';
                                }}
                                className="flex-1 bg-[#DA291C] text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 transition-colors uppercase"
                            >
                                Borrar Datos y Reiniciar
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
