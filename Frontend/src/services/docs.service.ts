import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../consts/apiUrl';
import type { RootState } from '../utils/store';

export interface DocInputModal {
   file: File;
   language: string;
   tags: string[];
}

export interface Doc {
   fileName: string;
   id: string;
   language: string;
   title: string;
   uploadedAt: Date;
}

export const docsApi = createApi({
   reducerPath: 'docsApi',
   baseQuery: fetchBaseQuery({
      baseUrl: API_URL,
      prepareHeaders: (headers, { getState }) => {
         const token = (getState() as RootState).auth.token;
         if (token) headers.set('authorization', `Bearer ${token}`);
         return headers;
      },
   }),
   tagTypes: ['doc'],
   endpoints: (builder) => ({
      getDocs: builder.query<Doc[], void>({
         query: () => ({
            method: 'GET',
            url: '/Docs',
         }),
         providesTags: ['doc'],
      }),
      uploadDoc: builder.mutation<void, FormData>({
         query: (data) => ({ url: '/Docs/upload', method: 'POST', body: data }),
         invalidatesTags: ['doc'],
      }),
      deleteDoc: builder.mutation<void, { documentID: string }>({
         query: (params) => ({ method: 'DELETE', url: `/Docs`, params }),
         invalidatesTags: ['doc'],
      }),
   }),
});

export const { useGetDocsQuery, useDeleteDocMutation, useUploadDocMutation } = docsApi;
