import { configureStore } from '@reduxjs/toolkit'
import LoginReducer from '../components/Login/LoginReducer/LoginSlice'
import DeliverablesReducer from '../components/EngineerReviewerView/EngineerMain/EngineerReducers/Deliverables'
import AllProjectsDetails from '../components/EngineerReviewerView/EngineerMain/EngineerReducers/AllProjects'
import LoaderSliceReducer from '../components/Common/LoaderReducer/LoaderSlice'
import ProjectNumber from '../components/EngineerReviewerView/EngineerMain/EngineerReducers/ProjectNumber'
import ReportDetails from '../components/EngineerReviewerView/EngineerMain/EngineerReducers/ReportDetails'
import ReviewerAllReportsSlice from '../components/EngineerReviewerView/ReviewerMain/ReviewerReducers/ReviewerAllReportsSlice'


export const store = configureStore({
  reducer: {
    
    Login:LoginReducer,
    Deliverables: DeliverablesReducer,
    AllProjectsDetails: AllProjectsDetails,
    ProjectNumberDetails: ProjectNumber,
    ReportDetails : ReportDetails,
    ReviewerData : ReviewerAllReportsSlice,
    LoaderSlice: LoaderSliceReducer,
  
  },
})