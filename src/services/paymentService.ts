import api from './api';

export interface CreatePaymentDto {
    id_pedido: number;
    metodo: string;
    monto: number;
    estado: string;
}

export const paymentService = {
    createPayment: async (paymentData: CreatePaymentDto) => {
        const response = await api.post('/payment', paymentData);
        return response.data;
    },
};
