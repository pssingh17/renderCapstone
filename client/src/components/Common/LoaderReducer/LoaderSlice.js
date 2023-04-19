import { createSlice } from '@reduxjs/toolkit'





const initialState= {
  value: false,
}

export const LoaderSlice = createSlice({
  name: 'LoaderStatus',
  initialState,
  reducers: {
    
    LoaderStatus: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {  LoaderStatus } = LoaderSlice.actions

export default LoaderSlice.reducer