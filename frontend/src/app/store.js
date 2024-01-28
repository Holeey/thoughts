import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js'
import postReducer from '../features/post/postSlice.js'
import commentReducer from '../features/comments/commentSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    comment: commentReducer,
  },
});
