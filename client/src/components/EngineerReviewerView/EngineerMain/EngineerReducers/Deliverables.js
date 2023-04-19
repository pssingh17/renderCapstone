import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {
  },
}
export const DeliverablesSlice = createSlice({
    name:"Deliverables",
    initialState,
    reducers:{
        DeliverablesDetails: (state,action)=>{
            state.value = action.payload
        },
    }
      
})

export const {DeliverablesDetails} = DeliverablesSlice.actions
export default DeliverablesSlice.reducer