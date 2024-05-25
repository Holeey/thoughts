import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import repostService  from "./repostService";


const initialState = {
    reposts: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: '',
    editingRepost: null,
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
export const updateRepost = createAsyncThunk('repost/update', async (updatedPost, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const id = updatedPost.get('id');
        updatedPost.delete('id');       
        return await repostService.updateRepost(id, updatedPost, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message) 
    }
})
export const deleteRepost = createAsyncThunk('repost/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await repostService.deleteRepost(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message) 
    }
})
export const upvote_repost = createAsyncThunk('repost/upvote', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await repostService.upvote_repost(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)  
    }
})
export const downvote_repost = createAsyncThunk('repost/downvote', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await repostService.downvote_repost(id, token)
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
        editRepost: (state, action) => {
            state.editingRepost = action.payload;
        },
        resetEditingPost: state => {
            state.editingRepost = null;
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
        .addCase(updateRepost.pending, (state) => {
                state.isLoading = true;
        }).addCase(updateRepost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.reposts.findIndex(post => post._id === action.payload._id);
                if (index !== -1) {
                    state.reposts[index] = action.payload;
                }
        }).addCase(updateRepost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            }).addCase(deleteRepost.pending, (state) => {
                state.isLoading = true;
            }).addCase(deleteRepost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.reposts = state.reposts.filter(post => post._id !== action.payload.id);
            }).addCase(deleteRepost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            }).addCase(upvote_repost.pending, (state) => {
                state.isLoading = true;
            }).addCase(upvote_repost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.reposts.findIndex(post => post._id === action.payload._id);
                if (index !== -1) {
                    state.reposts[index] = action.payload;
                }
            }).addCase(upvote_repost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            }).addCase(downvote_repost.pending, (state) => {
                state.isLoading = true;
            }).addCase(downvote_repost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.reposts.findIndex(post => post._id === action.payload._id);
                if (index !== -1) {
                    state.reposts[index] = action.payload;
                }
            }).addCase(downvote_repost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
    }
});

export const { reset, resetEditingRepost, editRepost } = repostSlice.actions
export default repostSlice.reducer 