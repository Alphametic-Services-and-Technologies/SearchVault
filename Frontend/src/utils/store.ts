import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../slices/posts.slice';
import authReducer from '../slices/auth.slice';
import { postsApi } from '../services/posts.service';
import { chatApi } from '../services/chat.service';
import { docsApi } from '../services/docs.service';

const store = configureStore({
   reducer: {
      [postsApi.reducerPath]: postsApi.reducer,
      [chatApi.reducerPath]: chatApi.reducer,
      [docsApi.reducerPath]: docsApi.reducer,
      posts: postsReducer,
      auth: authReducer,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([postsApi.middleware, chatApi.middleware, docsApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
