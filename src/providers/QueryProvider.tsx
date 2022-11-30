import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

const { VITE_QUERY_STALE_TIME: STALE_TIME = 5 } = import.meta.env;

const queryClient = new QueryClient({
	defaultOptions: {
		queries: { staleTime: 1000 * 60 * STALE_TIME },
	},
});

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};
