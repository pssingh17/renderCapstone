
import logo from "./logo.svg";
import "./App.css";
import { Header } from "./components/Common/Header/Header";
import { Navbar } from "./components/Common/Navbar/Navbar";

import { BrowserRouter, Routes, Route, useRoutes } from "react-router-dom";
import { Login } from "./components/Login/Login";
import { Footer } from "./components/Common/Footer/Footer";

import { LandingPage } from "./components/EngineerReviewerView/LandingPage/LandingPage";
import CreateProjectFolder from "./components/EngineerReviewerView/EngineerMain/CreateProjectFolder";

import { NewReport } from "./components//EngineerReviewerView/Reports/NewReport";

import { AssignedProjectMain } from "./components/EngineerReviewerView/EngineerMain/EngineerMainPage";
import { Deliverables } from "./components/EngineerReviewerView/EngineerMain/Deliverables/Deliverables";
import {Details } from "./components/EngineerReviewerView/EngineerMain/Details/Details";
import {Financials } from "./components/EngineerReviewerView/EngineerMain/Financials/Financials";
import {SupportingDocuments } from "./components/EngineerReviewerView/EngineerMain/SupportingDocuments/SupportingDocuments";
import {Correspondence } from "./components/EngineerReviewerView/EngineerMain/Correspondence/Correspondence";
import {EquipmentLog } from "./components/EngineerReviewerView/EngineerMain/EquipmentLog/EquipmentLog";
import {Sample } from "./components/EngineerReviewerView/EngineerMain/Sample/Sample";
import ReviewMainPage from "./components/EngineerReviewerView/ReviewerMain/ReviewMainPage";
import ViewReportsScreen from "./components/EngineerReviewerView/Reports/ViewReportsScreen";
import { useSelector } from "react-redux";
import EditReportScreen from "./components/EngineerReviewerView/Reports/EditReportScreen";



function App() {
  const isLoading = useSelector((state)=>state.LoaderSlice.value)
  
  return (
    <>
      {isLoading===true?
    <div className='parentSpinner'>
  <div id="cover-spin"></div></div>
     :<>
     
     </>}
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Engineer routes */}


        <Route path="view/landingPage" element={<LandingPage />} />
      
        <Route path="view/createProjectFolder" element={<CreateProjectFolder />} />

        {/* Nested Routes */}
        <Route path="view/assignedProjects" element={<AssignedProjectMain />}>
          <Route index element={<Deliverables />} />
        <Route  path="details" element={<Details />}/>
        <Route  path="financials" element={<Financials />}/>
        <Route  path="deliverables" element={<Deliverables />}/>
        
        <Route  path="supportingDocuments" element={<SupportingDocuments />}/>
        <Route  path="correspondence" element={<Correspondence />}/>
        <Route  path="correspondence" element={<Correspondence />}/>
        <Route  path="equipmentLog" element={<EquipmentLog />}/>
        <Route  path="sample" element={<Sample />}/>
        </Route>
        <Route path="view/newReport" element={<NewReport />} />
        <Route path="view/viewReport" element={<ViewReportsScreen />} />
        <Route path="view/editReport" element={<EditReportScreen />} />


        <Route path="view/reviewMainPage" element={<ReviewMainPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
