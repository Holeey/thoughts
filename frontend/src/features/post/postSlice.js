import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postService  from "./postService";

const initialState = {
    posts: [],
    isError: false,
    isSuccess: false,
    message: '',
    editingPost: null
}

export const createPost = createAsyncThunk('post/create', async(payload, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await postService.createPost(payload, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})
export const getAllPosts = createAsyncThunk('post/getAll', async (_, thunkAPI) => {
    try {
        return await postService.getAllPosts()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})
export const updatePost = createAsyncThunk('post/update', async (payload, thunkAPI) => {
    const {id, updatedPost} = payload
    try {
        const token = thunkAPI.getState().auth.user.token
        return await postService.updatePost(id, updatedPost, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message) 
    }
})

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        reset: (state) => state.initialState,

        editPost: (state, action) => {
            state.editingPost = action.payload
        },
        resetEditingPost: (state) => {
            state.editingPost = null
        }
    },
    extraReducers:(builder) => {
        builder
        .addCase(createPost.pending, (state) => {
            state.isLoading = true
        })
        .addCase(createPost.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.posts.push(action.payload)
        })
        .addCase(createPost.rejected, (state, action) => {
            state.isError = true
            state.message = action.payload
        })
        .addCase(getAllPosts.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getAllPosts.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.posts = action.payload
        })
        .addCase(getAllPosts.rejected, (state, action) => {
            state.isError = true
            state.message = action.payload
        })
        .addCase(updatePost.pending, (state) => {
            state.isLoading = true
        })
        .addCase(updatePost.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            // const index = state.posts.findIndex(post => post._id === action.payload._id)
            // if (index !== -1) {
            //     state.posts[index] = action.payload
            // }
            state.posts = action.payload._id
        })
        .addCase(updatePost.rejected, (state, action) => {
            state.isError = true
            state.message = action.payload
        })
    }
})

export const { reset, resetEditingPost, editPost } = postSlice.actions
export default postSlice.reducer 