import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js'
import postReducer from '../features/post/postSlice.js'
import repostReducer from '../features/repost/repostSlice.js'
import commentReducer from '../features/comments/commentSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    repost: repostReducer,
    comment: commentReducer,
  },
});
