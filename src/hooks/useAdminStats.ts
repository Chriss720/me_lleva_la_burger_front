import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface AdminStats {
    totalOrders: number;
    pendingOrders: number;
    totalProducts: number;
}

export const useAdminStats = () => {
    const { data: stats, isLoading, error } = useQuery<AdminStats>({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await api.get('/admin/stats');
            const data = res.data.data || res.data;
            return {
                totalOrders: data.totalOrders || 0,
                pendingOrders: data.pendingOrders || 0,
                totalProducts: data.totalProducts || 0,
            };
        },
    });

    return {
        stats: stats || { totalOrders: 0, pendingOrders: 0, totalProducts: 0 },
        isLoading,
        error: error ? (error as Error).message : null,
    };
};
