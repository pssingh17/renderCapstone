import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {
  },
}
export const ReportDetailsSlice = createSlice({
    name:"ReportDetails",
    initialState,
    reducers:{
        Reports:  (state,action)=>{
            state.value = action.payload
        }
    }
})

export const {Reports} = ReportDetailsSlice.actions
export default ReportDetailsSlice.reducer