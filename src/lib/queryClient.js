import { QueryClient } from '@tanstack/react-query'

export default function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60, // 1 min
                refetchOnWindowFocus: false,
            },
        },
    })
}