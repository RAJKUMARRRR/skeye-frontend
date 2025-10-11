import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query keys for organized cache management
export const queryKeys = {
  trips: {
    all: ['trips'] as const,
    list: () => [...queryKeys.trips.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.trips.all, 'detail', id] as const,
    active: () => [...queryKeys.trips.all, 'active'] as const,
  },
  alerts: {
    all: ['alerts'] as const,
    list: () => [...queryKeys.alerts.all, 'list'] as const,
    unread: () => [...queryKeys.alerts.all, 'unread'] as const,
  },
  checklists: {
    all: ['checklists'] as const,
    list: () => [...queryKeys.checklists.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.checklists.all, 'detail', id] as const,
    pending: () => [...queryKeys.checklists.all, 'pending'] as const,
  },
  profile: {
    all: ['profile'] as const,
    me: () => [...queryKeys.profile.all, 'me'] as const,
    scorecard: () => [...queryKeys.profile.all, 'scorecard'] as const,
  },
};
