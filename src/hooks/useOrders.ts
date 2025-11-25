import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import type { Order } from '../types';

export const useOrders = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: orders = [], isLoading, error } = useQuery<Order[]>({
        queryKey: ['orders', user?.id],
        queryFn: () => orderService.getOrdersByCustomer(user?.id || 0),
        enabled: !!user?.id,
    });

    const updateOrderStatusMutation = useMutation({
        mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
            orderService.updateOrderStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });

    const deleteOrderMutation = useMutation({
        mutationFn: orderService.deleteOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });

    return {
        orders,
        isLoading,
        error: error ? (error as Error).message : null,
        updateOrderStatus: updateOrderStatusMutation.mutateAsync,
        deleteOrder: deleteOrderMutation.mutateAsync,
        isUpdating: updateOrderStatusMutation.isPending,
        isDeleting: deleteOrderMutation.isPending,
    };
};

export const useOrdersByCustomer = (customerId: number) => {
    const { data: orders = [], isLoading, error } = useQuery<Order[]>({
        queryKey: ['orders', customerId],
        queryFn: () => orderService.getOrdersByCustomer(customerId),
        enabled: !!customerId,
    });

    return {
        orders,
        isLoading,
        error: error ? (error as Error).message : null,
    };
};

export const useOrder = (orderId: number) => {
    const { data: order, isLoading, error } = useQuery<Order>({
        queryKey: ['order', orderId],
        queryFn: () => orderService.getOrderById(orderId),
        enabled: !!orderId,
    });

    return {
        order,
        isLoading,
        error: error ? (error as Error).message : null,
    };
};

export const useAllOrders = () => {
    const queryClient = useQueryClient();

    const { data: orders = [], isLoading, error } = useQuery<Order[]>({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            const allOrders = await orderService.getMyOrders();
            return allOrders;
        },
    });

    const deleteOrderMutation = useMutation({
        mutationFn: orderService.deleteOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
        },
    });

    return {
        orders,
        isLoading,
        error: error ? (error as Error).message : null,
        deleteOrder: deleteOrderMutation.mutateAsync,
        isDeleting: deleteOrderMutation.isPending,
    };
};
