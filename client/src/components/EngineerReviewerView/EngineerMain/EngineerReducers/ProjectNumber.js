import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {
  },
}
export const ProjectNumberSlice = createSlice({
    name:"ProjectNumber",
    initialState,
    reducers:{
        ProjectNumber:  (state,action)=>{
            state.value = action.payload
        }
    }
})

export const {ProjectNumber} = ProjectNumberSlice.actions
export default ProjectNumberSlice.reducer