import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postService  from "./postService";

const post_local_State = JSON.parse(localStorage.getItem('post')) || {}

const initialState = {
    post: post_local_State,
    isError: false,
    isSuccess: false,
    errorMessage: '',
    successMessage: ''
}

export const createPost = createAsyncThunk('/createPost', async(payload, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await postService.createPost(payload, token)
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
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
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
            state.post = action.payload
            state.successMessage = action.payload
        })
        .addCase(createPost.rejected, (state, action) => {
            state.isError = true
            state.errorMessage = action.payload
        })
    }
})

export const { reset } = postSlice.actions
export default postSlice.reducer 