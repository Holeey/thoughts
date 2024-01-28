import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import commentService from "./commentService.js"


const initialState = {
    comments: [],
    isloading: false,
    isError: false,
    isSuccess: false,
    message: ''
}

export const postComment = createAsyncThunk ( async (id, comment, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await commentService.postComment(id, comment, token)
    } catch (error) {
        const message = error.response.data
        return thunkAPI.rejectWithValue(message)
    }
})


const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        resetComment: (state) => {
        state.isError = false
        state.isSuccess = false
        state.isloading = false
        state.message = ''
    },
    extraReducers: (builder) => {
        builder
        .addCase(postComment.pending, (state) => {
            state.isloading = true
        })
        .addCase(postComment.fulfilled, (state, action) => {
            state.isloading = false
            state.isSuccess = true
            state.comments.push(action.payload)
        })
        .addCase(postComment.rejected, (state, action) =>{
            state.isSuccess = false
            state.isError = true
            state.message = action.payload
        })
    }
}
})

export const {resetComment} = commentSlice.actions
export default commentSlice.reducer