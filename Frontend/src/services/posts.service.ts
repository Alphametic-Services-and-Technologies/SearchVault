import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CreatePostBody, Post } from '../types/posts.type';
import axios from '../utils/axios';
import { API_URL } from '../consts/apiUrl';

export const createPost = async (data: CreatePostBody): Promise<Post> => {
   try {
      const response = await axios.post('/posts', data);

      return Promise.resolve(response.data as Post);
   } catch (e) {
      return Promise.reject(e);
   }
};

export const postsApi = createApi({
   reducerPath: 'postsApi',
   baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
   endpoints: (builder) => ({
      getPosts: builder.query<Post[], void>({
         query: () => ({
            method: 'GET',
            url: '/posts',
         }),
      }),
   }),
});

export const { useGetPostsQuery } = postsApi;
