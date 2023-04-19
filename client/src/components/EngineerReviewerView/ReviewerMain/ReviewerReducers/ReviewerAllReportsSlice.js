import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {
  },
}
export const ReviewerAllReportsSlice = createSlice({
    name:"ReviewerData",
    initialState,
    reducers:{
        ReviewerAllReports: (state,action)=>{
            state.value = action.payload
        }
    }
})

export const {ReviewerAllReports} = ReviewerAllReportsSlice.actions
export default ReviewerAllReportsSlice.reducer