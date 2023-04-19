import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {
  },
}
export const AllProjectsSlice = createSlice({
    name:"AllProjects",
    initialState,
    reducers:{
        AllProjectsDetails:  (state,action)=>{
            state.value = action.payload
        }
    }
})

export const {AllProjectsDetails} = AllProjectsSlice.actions
export default AllProjectsSlice.reducer