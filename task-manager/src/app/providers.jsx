'use client'

import { Provider } from 'react-redux';
import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import makeStore from './../redux/store';
import createQueryClient from './../lib/queryClient';

export default function Providers({ children }) {
    const [store] = useState(() => makeStore())
    const [queryClient] = useState(() => createQueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                {children}
            </Provider>
        </QueryClientProvider>
    )
}