import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from  '../auth/authService.js'

const localStorage_state = JSON.parse(localStorage.getItem('user')) || null
const recoverPassword_state = JSON.parse(localStorage.getItem('recoverPassword')) || {}

const initialState = {
    user: localStorage_state,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
    recoverPasskey: recoverPassword_state
}

export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
    try {
        return await authService.register(user)
    } catch (error) {
       const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
        return await authService.login(user)
    } catch (error) {
       const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})
export const profile = createAsyncThunk('auth/profile', async (payload, thunkAPI) => {
    const {id, userData} = payload
    try {
        const token = thunkAPI.getState().auth.user.token
        return await authService.profile( id, userData, token )
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message) 
    }
})
export const recoverPassword = createAsyncThunk('auth/recoverPassword', async (payload, thunkAPI) => {
    try {
        return await authService.recoverPassword(payload)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message) 
    }
})
export const setNewPassword = createAsyncThunk('auth/setNewPassword', async (payload, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.recoverPasskey.token
        return await authService.setNewPassword(payload, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.message)
        || error.message || error.toString()
        return thunkAPI.rejectWithValue(message) 
    }
})
export const logout = createAsyncThunk('auth/logout', () => {
    return authService.logout()
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
    reset: (state) => {
        state.isLoading = false
        state.isSuccess = false
        state.isError = false
        state.message = ''
    }
    },
    extraReducers: (builder) => {
        builder
        .addCase(register.pending, (state) => {
            state.isLoading = true
        })
        .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
        })
        .addCase(register.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(login.pending, (state) => {
            state.isLoading = true
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(profile.pending, (state) => {
            state.isLoading = true
        })
        .addCase(profile.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
        })
        .addCase(profile.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(recoverPassword.pending, (state) => {
            state.isLoading = true
        })
        .addCase(recoverPassword.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.recoverPasskey = action.payload
        })
        .addCase(recoverPassword.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(setNewPassword.pending, (state) => {
            state.isLoading = true
        })
        .addCase(setNewPassword.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.recoverPasskey = action.payload
        })
        .addCase(setNewPassword.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(logout.fulfilled, (state) => {
            state.user = null
        })
        
    }
})

export const { reset } = authSlice.actions
export default authSlice.reducer 