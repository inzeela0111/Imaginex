import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authService from './authService';


// const initialState = {

// }

const authSlice = createSlice({
    name: 'auth',
    initialState: {
    user : null ,
    isLoading : false ,
    isSuccess : false ,
    isError : false ,
    message : ""
  },
  reducers: {},
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
  }
});

// export const {} = authSlice.actions

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