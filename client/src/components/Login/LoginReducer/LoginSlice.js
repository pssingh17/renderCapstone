import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {
  },
}
export const LoginSlice = createSlice({
    name:"Login",
    initialState,
    reducers:{
        LoginDetails: (state,action)=>{
            state.value = action.payload
        }
    }
})

export const {LoginDetails} = LoginSlice.actions
export default LoginSlice.reducer