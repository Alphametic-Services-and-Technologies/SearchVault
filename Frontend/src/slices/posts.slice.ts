import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { CreatePostBody, Post } from '../types/posts.type';
import { createPost } from '../services/posts.service';

export const createPostAction = createAsyncThunk(
   'posts/createPostAction',
   async (data: CreatePostBody) => {
      const newPost = await createPost(data);

      // await dispatch(fetchPostsAction()).unwrap();

      return newPost;
   }
);

interface initialState {
   data: Post[];
}

const initialState: initialState = {
   data: [],
};

const postsSlice = createSlice({
   name: 'posts',
   initialState,
   reducers: {},
   extraReducers: () => {
      // builder.addCase(fetchPostsAction.fulfilled, (state, action) => {
      //    state.data = action.payload;
      // });
   },
});

export default postsSlice.reducer;
