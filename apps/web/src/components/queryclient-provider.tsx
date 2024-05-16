"use client";
import { QueryClient, QueryClientProvider, QueryClientProviderProps } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export function QueryClientProviderComponent({ children, ...props }: QueryClientProviderProps) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
