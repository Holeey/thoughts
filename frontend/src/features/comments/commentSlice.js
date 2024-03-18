import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import commentService from "./commentService.js"


const initialState = {
    comments: [],
    isloading: false,
    isError: false,
    isSuccess: false,
    message: ''
}

export const getComments = createAsyncThunk('comment/get', async (postId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await commentService.getComments(postId, token)
    } catch (error) {
        const message = error.response.data
        return thunkAPI.rejectWithValue(message) 
    }
})

export const postComment = createAsyncThunk('comment/post', async (payload, thunkAPI) => {
    const {postId, reply} = payload 
    try {
        const token = thunkAPI.getState().auth.user.token
        return await commentService.postComment(postId, reply, token)
    } catch (error) {
        const message = error.response.data
        return thunkAPI.rejectWithValue(message)
    }
})
export const replyComment = createAsyncThunk('/comment/reply', async (payload, thunkAPI) => {
    const {commentId, reply} = payload
    try {
        const token = thunkAPI.getState().auth.user.token
        return await commentService.replyComment(commentId, reply, token)
    } catch (error) {
        const message = error.response.data
        return thunkAPI.rejectWithValue(message)
    }
})
export const replyReplies = createAsyncThunk('/reply/replies', async (payload, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await commentService.replyReplies(payload, token)
    } catch (error) {
        const message = error.response.data
        return thunkAPI.rejectWithValue(message)
    }
})
export const deleteComment = createAsyncThunk('comment/delete', async (commentId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await commentService.deleteComment(commentId, token)
    } catch (error) {
        const message = error.response.data
        return thunkAPI.rejectWithValue(message)
    }
})
export const commentUpvotes = createAsyncThunk('comment/upvote', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await commentService.upvotes(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)  
    }
})
export const commentDownvotes = createAsyncThunk('comment/downvote', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await commentService.downvotes(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)  
    }
})
export const replyUpvotes = createAsyncThunk('reply/upvote', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await commentService.upvotes(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)  
    }
})
export const replyDownvotes = createAsyncThunk('reply/downvote', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await commentService.downvotes(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)  
    }
})
export const deleteReply = createAsyncThunk('reply/delete', async (commentId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await commentService.deleteComment(commentId, token)
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
        state.comments = []
        state.isError = false
        state.isSuccess = false
        state.isloading = false
        state.message = ''
    }
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
        .addCase(getComments.pending, (state) => {
            state.isloading = true
        })
        .addCase(getComments.fulfilled, (state, action) => {
            state.isloading = false
            state.isSuccess = true
            state.comments = action.payload
        })
        .addCase(getComments.rejected, (state, action) =>{
            state.isSuccess = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(replyComment.pending, (state) => {
            state.isloading = true
        })
        .addCase(replyComment.fulfilled, (state, action) => {
            state.isloading = false
            state.isSuccess = true
            let index 
            index = state.comments.findIndex((comment) => comment._id === action.payload._id)
            state.comments[index] = action.payload
        })
        .addCase(replyReplies.pending, (state) => {
            state.isloading = true
        })
        .addCase(replyReplies.fulfilled, (state, action) => {
            state.isloading = false
            state.isSuccess = true
            let index 
            index = state.comments.findIndex((comment) => comment._id === action.payload._id)
            state.comments[index] = action.payload
        })
        .addCase(replyReplies.rejected, (state, action) =>{
            state.isSuccess = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(commentUpvotes.pending, (state) => {
            state.isloading = true
        })
        .addCase(commentUpvotes.fulfilled, (state, action) => {
            state.isSuccess = true
            const index = state.comments.findIndex(comment => comment._id === action.payload._id)
            if (index !== -1) {
            state.comments[index] = action.payload 
            } 
        })
        .addCase(commentUpvotes.rejected, (state, action) => {
            state.isSuccess = false
            state.comments = action.payload
        })
        .addCase(commentDownvotes.pending, (state) => {
            state.isloading = true
        })
        .addCase(commentDownvotes.fulfilled, (state, action) => {
            state.isSuccess = true
            const index = state.comments.findIndex(comment => comment._id === action.payload._id)
            if (index !== -1) {
            state.comments[index] = action.payload 
            } 
        })
        .addCase(commentDownvotes.rejected, (state, action) => {
            state.isSuccess = false
            state.comments = action.payload
        })
        .addCase(replyUpvotes.pending, (state) => {
            state.isloading = true
        })
        .addCase(replyUpvotes.fulfilled, (state, action) => {
            state.isSuccess = true;
            const { payload } = action;
            
            // Iterate over each comment in the state
            state.comments = state.comments.map(comment => {
                // Find the index of the reply in the current comment's replies array
                const index = comment.replies.findIndex(reply => reply._id === payload._id);
                
                // If the reply is found in the current comment's replies array
                if (index !== -1) {
                    // Create a new array to update the replies while preserving immutability
                    const updatedReplies = [...comment.replies];
                    // Update the specific reply within the array
                    updatedReplies[index] = payload;
                    // Update the replies array of the current comment
                    return { ...comment, replies: updatedReplies };
                }
                // If the reply is not found, return the comment as is
                return comment;
            });
        })
        
        .addCase(replyUpvotes.rejected, (state, action) => {
            state.isSuccess = false
            state.comments = action.payload
        })
        .addCase(replyDownvotes.pending, (state) => {
            state.isloading = true
        })
        .addCase(replyDownvotes.fulfilled, (state, action) => {
            state.isSuccess = true;
            const { payload } = action;
            
            // Iterate over each comment in the state
            state.comments = state.comments.map(comment => {
                // Find the index of the reply in the current comment's replies array
                const index = comment.replies.findIndex(reply => reply._id === payload._id);
                
                // If the reply is found in the current comment's replies array
                if (index !== -1) {
                    // Create a new array to update the replies while preserving immutability
                    const updatedReplies = [...comment.replies];
                    // Update the specific reply within the array
                    updatedReplies[index] = payload;
                    // Update the replies array of the current comment
                    return { ...comment, replies: updatedReplies };
                }
                // If the reply is not found, return the comment as is
                return comment;
            });
        })
        
        .addCase(replyDownvotes.rejected, (state, action) => {
            state.isSuccess = false
            state.comments = action.payload
        })
        .addCase(deleteComment.pending, (state) => {
            state.isloading = true
        })
        .addCase(deleteComment.fulfilled, (state, action) => {
            state.isloading = false
            state.isSuccess = true
            state.comments = state.comments.filter(comment => comment._id !== action.payload.id);
        })
        .addCase(deleteComment.rejected, (state, action) =>{
            state.isSuccess = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(deleteReply.pending, (state) => {
            state.isloading = true
        })
        .addCase(deleteReply.fulfilled, (state, action) => {
            state.isloading = false;
            state.isSuccess = true;
            // Map over each comment in state
            state.comments = state.comments.map(comment => {
                // Filter out the deleted reply from the comment's replies array
                const updatedReplies = comment.replies.filter(reply => reply._id !== action.payload.id);
                // Return the comment with updated replies array
                return { ...comment, replies: updatedReplies };
            });
        })       
        .addCase(deleteReply.rejected, (state, action) =>{
            state.isSuccess = false
            state.isError = true
            state.message = action.payload
        })
    }
}
)

export const {resetComment} = commentSlice.actions
export default commentSlice.reducer