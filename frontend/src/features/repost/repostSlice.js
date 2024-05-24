import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import repostService  from "./repostService";


const initialState = {
    reposts: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: '',
    editingPost: null,
    searchPosts: []
};

export const createRepost = createAsyncThunk('repost/create', async (payload, thunkAPI) => {
    const {id, repostComment} = payload;
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await repostService.createRepost(id, repostComment, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const getAllReposts = createAsyncThunk('repost/getAll', async (_, thunkAPI) => {
    try {
        return await repostService.getAllReposts();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const updatePost = createAsyncThunk('post/update', async (updatedPost, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const id = updatedPost.get('id');
        updatedPost.delete('id');       
        return await repostService.updatePost(id, updatedPost, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message) 
    }
})
export const deletePost = createAsyncThunk('post/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await repostService.deletePost(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message) 
    }
})
export const upvotes = createAsyncThunk('post/upvote', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await repostService.upvotes(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)  
    }
})
export const downvotes = createAsyncThunk('post/downvote', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await repostService.downvotes(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)  
    }
})

const repostSlice = createSlice({
    name: 'repost',
    initialState,
    reducers: {
        reset: () => initialState,
        editPost: (state, action) => {
            state.editingPost = action.payload;
        },
        resetEditingPost: state => {
            state.editingPost = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(createRepost.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createRepost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.reposts.push(action.payload);
        })
        .addCase(createRepost.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getAllReposts.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getAllReposts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.reposts = action.payload;
        })
        .addCase(getAllReposts.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(updatePost.pending, (state) => {
                state.isLoading = true;
        }).addCase(updatePost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.reposts.findIndex(post => post._id === action.payload._id);
                if (index !== -1) {
                    state.reposts[index] = action.payload;
                }
        }).addCase(updatePost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            }).addCase(deletePost.pending, (state) => {
                state.isLoading = true;
            }).addCase(deletePost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.reposts = state.reposts.filter(post => post._id !== action.payload.id);
            }).addCase(deletePost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            }).addCase(upvotes.pending, (state) => {
                state.isLoading = true;
            }).addCase(upvotes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.reposts.findIndex(post => post._id === action.payload._id);
                if (index !== -1) {
                    state.reposts[index] = action.payload;
                }
            }).addCase(upvotes.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            }).addCase(downvotes.pending, (state) => {
                state.isLoading = true;
            }).addCase(downvotes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.reposts.findIndex(post => post._id === action.payload._id);
                if (index !== -1) {
                    state.reposts[index] = action.payload;
                }
            }).addCase(downvotes.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
    }
});

export const { reset, resetEditingPost, editPost, resetSearchPosts } = repostSlice.actions
export default repostSlice.reducer 