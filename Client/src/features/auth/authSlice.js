import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authService from './authService';

const userExist = JSON.parse(localStorage.getItem('user'))

const authSlice = createSlice({
    name: 'auth',
    initialState: {
    user : userExist || null ,
    profile : null ,
    isLoading : false ,
    isSuccess : false ,
    isError : false ,
    message : ""
  },
  reducers: {
    updateCredits: (state, action) => {
      if (state.user) {
        state.user.credits = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  },
  extraReducers : (builder) => {
    builder
    .addCase(registerUser.pending , (state , action) => {
      state.isLoading = true 
      state.isSuccess = false
      state.isError = false

    })
    .addCase(registerUser.fulfilled , (state , action) => {
      state.isLoading = false 
      state.isSuccess = true
      state.user = action.payload
      state.isError = false

    })
    .addCase(registerUser.rejected , (state , action) => {
      state.isLoading = false 
      state.isSuccess = false
      state.isError = true
      state.message = action.payload

    })

    .addCase(loginUser.pending , (state , action) => {
      state.isLoading = true 
      state.isSuccess = false
      state.isError = false
    })
    .addCase(loginUser.fulfilled , (state , action) => {
      state.isLoading = false 
      state.isSuccess = true
      state.user = action.payload
      state.isError = false
    })
    .addCase(loginUser.rejected , (state , action) => {
      state.isLoading = false 
      state.isSuccess = false
      state.isError = true
      state.message = ""
      state.user = null
    })

    .addCase(logoutUser.fulfilled , (state , action) => {
      state.isLoading = false 
      state.isSuccess = false
      state.isError = false
      state.user = ""
    })

    .addCase(getProfile.pending , (state , action) => {
      state.isLoading = true 
      state.isSuccess = false
      state.isError = false
      state.profile = null
    })
    .addCase(getProfile.fulfilled , (state , action) => {
      state.isLoading = false 
      state.isSuccess = true
      state.profile = action.payload
      state.isError = false
    })
    .addCase(getProfile.rejected , (state , action) => {
      state.isLoading = false 
      state.isSuccess = false
      state.isError = true
      state.profile = null
      state.message = action.payload || "Failed to load profile"
    })
  }
});

export const { updateCredits } = authSlice.actions;

export default authSlice.reducer


//REGISTER USER
export const registerUser = createAsyncThunk("AUTH/REGISTER" , async(formData , thunkAPI) => {
  try {
    return await authService.register(formData)
  } catch (error) {
    console.log(error.response.data.message)
    let message = error.response.data.message
    return thunkAPI.rejectWithValue(message)
  }
})


//LOGIN USER
export const loginUser = createAsyncThunk("AUTH/LOGIN" , async(formData , thunkAPI) => {
  try {
    return await authService.login(formData)
  } catch (error) {
    console.log(error.response.data.message)
    let message = error.response.data.message
    return thunkAPI.rejectWithValue(message)
  }
})

//LOGOUT USER
export const logoutUser = createAsyncThunk("AUTH/LOGOUT" , async(formData , thunkAPI) => {
 localStorage.removeItem("user")
})


//Get Profile
export const getProfile = createAsyncThunk("GET/PROFILE" , async(name , thunkAPI) => {
  try {
    return await authService.fetchProfile(name)
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})