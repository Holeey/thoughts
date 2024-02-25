import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postService  from "./postService";

const initialState = {
    posts: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: '',
    editingPost: null,
    searchPosts: []
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
export const updatePost = createAsyncThunk('post/update', async (updatedPost, thunkAPI) => {
    const { id, postTitle, postBody } = updatedPost;
    const updatedPostData = { postTitle, postBody };
    try {
        const token = thunkAPI.getState().auth.user.token
        return await postService.updatePost(id, updatedPostData, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message) 
    }
})
export const deletePost = createAsyncThunk('post/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await postService.deletePost(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message) 
    }
})
export const searchPost = createAsyncThunk('post/search', async (payload, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await postService.searchPost(payload, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message) 
    }
})
export const upvotes = createAsyncThunk('post/upvote', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        console.log('upvotes-slice:', token)
        return await postService.upvotes(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)  
    }
})
export const downvotes = createAsyncThunk('post/downvote', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await postService.downvotes(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)  
    }
})
export const unUpvoted = createAsyncThunk('post/unUpvoted', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await postService.unUpvoted(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)  
    }
})
export const unDownvoted = createAsyncThunk('post/unDownvoted', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await postService.unDownvoted(id, token)
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
        },
        resetSearchPosts: (state) =>{
            state.searchPosts = []
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
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
        state.posts[index] = action.payload 
        }  
       })
        .addCase(updatePost.rejected, (state, action) => {
            state.isError = true
            state.message = action.payload
        })
        .addCase(deletePost.pending, (state) => {
            state.isLoading = true
        })
        .addCase(deletePost.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.posts = state.posts.filter(post => post._id !== action.payload.id);
       })
        .addCase(deletePost.rejected, (state, action) => {
            state.isError = true
            state.message = action.payload
        })
        .addCase(searchPost.pending, (state) => {
            state.isLoading = true
        })
        .addCase(searchPost.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.searchPosts = action.payload
       })
        .addCase(searchPost.rejected, (state, action) => {
            state.isError = true
            state.message = action.payload
        })
        .addCase(upvotes.pending, (state) => {
            state.isLoading = true
        })
        .addCase(upvotes.fulfilled, (state, action) => {
            state.isSuccess = true
            const index = state.posts.findIndex(post => post._id === action.payload._id)
            if (index !== -1) {
            state.posts[index] = action.payload 
            } 
        })
        .addCase(upvotes.rejected, (state, action) => {
            state.isSuccess = false
            state.posts = action.payload
        })
        .addCase(downvotes.pending, (state) => {
            state.isLoading = true
        })
        .addCase(downvotes.fulfilled, (state, action) => {
            state.isSuccess = true
            const index = state.posts.findIndex(post => post._id === action.payload._id)
            if (index !== -1) {
            state.posts[index] = action.payload 
            } 
        })
        .addCase(downvotes.rejected, (state, action) => {
            state.isSuccess = false
            state.posts = action.payload
        })
        .addCase(unUpvoted.pending, (state) => {
            state.isLoading =true
        })
        .addCase(unUpvoted.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            const index = state.posts.findIndex(post => post._id === action.payload._id)
            if (index !== -1) {
            state.posts[index] = action.payload 
            }
        })
        .addCase(unUpvoted.rejected, (state, action) => {
            state.isSuccess = false
            state.message = action.payload
        })
        .addCase(unDownvoted.pending, (state) => {
            state.isLoading = true
        })
        .addCase(unDownvoted.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            const index = state.posts.findIndex(post => post._id === action.payload._id)
            if (index !== -1) {
            state.posts[index] = action.payload 
            }
        })
        .addCase(unDownvoted.rejected, (state, action) => {
            state.isSuccess = false
            state.message = action.payload
        })
    }
})

export const { reset, resetEditingPost, editPost, resetSearchPosts } = postSlice.actions
export default postSlice.reducer 