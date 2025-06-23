import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = 'https://searchvault-middleware.ast-lb.com/';

const token =
   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJkYW5pbGVvbmFyZG9lbGJhbm5hQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJUZW5hbnRJZCI6IjdkNDQ0ODQwLTlkYzAtNDA4Yy04OTk0LWFjYzUxYjAxMzE4OCIsImV4cCI6MTc1MDY5MTQxOSwiaXNzIjoiU2VhcmNoVmF1bHQiLCJhdWQiOiJTZWFyY2hWYXVsdFVzZXJzIn0.FL6VJamWrQQG0acmyknRHuLxLzzHsBy1UpkEJX59E9A';

export const chatApi = createApi({
   reducerPath: 'chatApi',
   baseQuery: fetchBaseQuery({
      baseUrl: API_URL,
      headers: {
         Authorization: `Bearer ${token}`,
      },
   }),
   endpoints: (builder) => ({
      streamChat: builder.query<string, void>({
         async onCacheEntryAdded(_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
            await cacheDataLoaded;

            const eventSource = new EventSource(`${API_URL}/Chat`);

            eventSource.onmessage = (event) => {
               const data = event.data;
               updateCachedData((_draft) => {
                  return data;
               });
            };

            eventSource.onerror = (error) => {
               console.error('SSE error:', error);
               eventSource.close();
            };

            await cacheEntryRemoved;
            eventSource.close();
         },
         queryFn: () => ({ data: '' }),
      }),
   }),
});

export const { useStreamChatQuery } = chatApi;
