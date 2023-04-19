import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { DeliverablesDetails } from "../EngineerReducers/Deliverables";
import { LoaderStatus } from "../../../Common/LoaderReducer/LoaderSlice";
import Cookies from "universal-cookie";
import { LoginDetails } from "../../../Login/LoginReducer/LoginSlice";
import { AllProjectsDetails } from "../EngineerReducers/AllProjects";
import  { Reports } from "../EngineerReducers/ReportDetails";
import { ProjectNumber } from "../EngineerReducers/ProjectNumber";
import BACKEND_URL from "../../../../backendUrl";

export const Deliverables = () => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "http://localhost:8081");
  myHeaders.append("Access-Control-Allow-Credentials", true);
  const [showModalDeleteDoc, setShowModalDeleteDoc] = useState(false)
  const [tempReport, setTempReport] = useState()
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const [DeliverableDataState, setDeliverablesDataState] = useState();
  const [arrayPageState, setArrayPageState] = useState(1);
  const [projectNumberState, setProjectNumberState]= useState()
  const DeliverableMain = useSelector((state) => state.Deliverables.value);
  // const ProjectNumberRedux = useSelector((state) => state.ProjectNumberDetails.value?.project_number);
  const ProjectNumberRedux = useSelector((state) => state.ProjectNumberDetails && state.ProjectNumberDetails.value && state.ProjectNumberDetails.value.project_number);

  const ULogged = useSelector((state) => state.Login.value);
  const [showNextButton, setShowNextButton] = useState(true)
  const [showPrevButton, setShowPrevButton] = useState(true)

  const [offset, setOffset] = useState(0)
  
  
  const nextPage = () => {
    
    if(DeliverableMain?.reports.length >=8){
      // console.log("inside nextpage function")
      let newOffset = offset+8
      setOffset(newOffset)
      getDeliverables(newOffset)
    }
  
    };
    const prevPage = () => {
      // console.log("inside prevpage function")

     if(offset>=8){
      let newOffset = offset-8
      setOffset(newOffset)
      getDeliverables(newOffset)
  
     }
    };
    
 
 
    useEffect(()=>{
      let prevProjectNumber = JSON.parse(localStorage.getItem("PrevProjectNumber"))
      if(prevProjectNumber != ProjectNumberRedux ||  !DeliverableMain?.project){

        getDeliverables()
        setProjectNumberState(ProjectNumberRedux)
      }
    },[ProjectNumberRedux])


  const getDeliverables = (newOffset)=>{
      // console.log(dataObj)
    if(ProjectNumberRedux !== undefined ){
      // console.log("newoffset check before sending", newOffset)
      dispatch(LoaderStatus(true));
      axios({
        method: "get",
        maxBodyLength: Infinity,
        url: `${BACKEND_URL}/project/${ProjectNumberRedux}`,
        headers: myHeaders,
        credentials: "include",
        withCredentials: true,
        params: {
          "offset": newOffset || 0,
          "limit":  8,
          "screenId": 2
        },
      })
        .then(function (response) {
          // console.log("Response in deliverables",response.data);
          let tempOffset
          if(newOffset!= undefined){
            tempOffset = newOffset
          }
          else{
            tempOffset = offset
          }
          if (response?.data?.data?.project) {
            if(response.data.data?.reports.length<8 && tempOffset==0){
              setShowNextButton(false)
              setShowPrevButton(false)
            }
            else{
              setShowNextButton(true)
              setShowPrevButton(true)
            }
            dispatch(DeliverablesDetails(response?.data?.data));
            setDeliverablesDataState(response?.data?.data?.reports);
            localStorage.setItem("PrevProjectNumber", JSON.stringify(response?.data?.data?.project?.project_number))
            dispatch(LoaderStatus(false));
          } else {
            // console.log("no projects yet");
            dispatch(LoaderStatus(false));
          }
        })
        .catch(function (error) {
          console.log("Error block deliverables", error);
          dispatch(LoaderStatus(false))
          if (error?.response?.status === 401) {
            dispatch(LoginDetails({}));
            cookies.remove("connect.sid");
            localStorage.setItem(
              "AlertMessage",
              JSON.stringify("Session Expired...Please Login Again")
            );
            navigate("/");
          }
        });
    }
    
   
  }
  useEffect(() => {
    
   setOffset(0)
   let SelectedProject
   if (localStorage.getItem("SelectedProject")) {
    SelectedProject = JSON.parse(localStorage.getItem("SelectedProject"));
   
  }
    

    if( SelectedProject != undefined){
      dispatch(ProjectNumber(SelectedProject))

    }
    getDeliverables() 
   

  }, []);
 

  return (

    <div>
       {showModalDeleteDoc === true ? <>
      <div id="myCustomModal" className="customModal">
<div className="custom-modal-content" >
  <div className="custom-modal-header customDC-color pt-2" >
   
    <h4 className='text-center '>Are you sure you want to delete the document?</h4>
  </div>
 
 
  <div className="custom-modal-footer d-flex justify-content-end ">
  <button className="btn customDC-color m-2"  onClick={()=>{
         axios({
          method: 'put',
          maxBodyLength: Infinity,
          url: `${BACKEND_URL}/report/delete`,
          headers:myHeaders,
          credentials: "include", 
          withCredentials:true,
            data : {
              doc_id:tempReport?.doc_id,
              report_id: tempReport?.report_id
            },
          
        })
        .then(function (response) {
          // console.log("Response From Delete in deliverables",response.data)  
          if(response?.data?.statusCode === 200){
          setShowModalDeleteDoc(false)
          getDeliverables()  
          }
        
        })
        .catch(function (error) {
          // console.log("Error block delete teport", error);
          if(error?.response?.status===401){
            dispatch(LoginDetails({}));
                cookies.remove('connect.sid');
                localStorage.setItem("AlertMessage", JSON.stringify("Session Expired...Please Login Again"))
              navigate('/')
          }
          
         
        });
  }}>
            Confirm
          </button>
    <button className='btn customDC-color m-2' onClick={()=>{
       
      setShowModalDeleteDoc(false)}}>Cancel</button>
  </div>
</div>
</div>

    </>:""}
    <div className="Adddocument">
        <div className="Adddocument">
    {ULogged?.is_engineer=== true? 
          <button
          style={{cursor:"pointer"}}
            onClick={() => {
              navigate("/view/newReport");
            }}
          >
            New Report
          </button>
          :""}
          <button>ADD DOCUMENT</button>
        </div>
      </div>
       {DeliverableMain?.project && DeliverableMain?.reports.length > 0 ? (
          <>
     

      <table className="table customTableMArgin" style={{ fontSize: "85%" }}>
        <thead>
          <tr>
            <th scope="col" className="tableColumnsSize">Date created</th>
            <th scope="col" className="tableColumnsSize">Report</th>
            <th scope="col" className="tableColumnsSize">Type</th>
            <th scope="col" className="tableColumnsSize">Project Number</th>
            <th scope="col" className="tableColumnsSize">Project Name</th>
            <th scope="col" className="tableColumnsSize">Report Receiving Customer</th>
            <th scope="col" className="tableColumnsSize">Engineer</th>
            <th scope="col" className="tableColumnsSize">Reviewer</th>
            <th scope="col" className="tableColumnsSize">Status</th>
            <th scope="col" width="130px"></th>
          </tr>
        </thead>

       
            <tbody>
              {DeliverableMain.reports
                .map((report) => {
                  return (
                    <tr key={report?.file_id}>
                      <td className="tableColumnsSize">{report?.report_created_at.slice(0, 10)}</td>
                      <td className="tableColumnsSize">{report?.report_number}</td>
                      <td className="tableColumnsSize">{report?.file_sub_type}</td>
                      <td className="tableColumnsSize">{report?.project_number}</td>
                      <td className="tableColumnsSize">{DeliverableMain?.project?.project_name}</td>
                      <td className="tableColumnsSize">{report?.receiving_customer}</td>
                      <td className="tableColumnsSize">{DeliverableMain?.project?.transacting_customer}</td>
                      <td className="tableColumnsSize">DC</td>
                      {report?.report_status === "SENT TO REVIEWER" ? (
                        <>
                          <td>
                            <span className="badge badge-pill badge-primary">
                              IN PROGRESS
                            </span>
                          </td>
                        </>
                      ) : (
                        ""
                      )}
                        {report?.report_status === "REJECTED" ? (
                        <>
                          <td>
                            <span className="badge badge-pill badge-danger">
                              REJECTED
                            </span>
                          </td>
                        </>
                      ) : (
                        ""
                      )}
                       {report?.report_status === "PENDING" ? (
                        <>
                          <td>
                            <span className="badge badge-pill badge-warning">
                              PENDING
                            </span>
                          </td>
                        </>
                      ) : (
                        ""
                      )}
                       {report?.report_status === "APPROVED" ? (
                        <>
                          <td>
                            <span className="badge badge-pill badge-success">
                              APPROVED
                            </span>
                          </td>
                        </>
                      ) : (
                        ""
                      )}
                      {report?.report_status === "VALIDATION FAILED" ? (
                        <>
                          <td>
                            <span className="badge badge-pill badge-danger">
                              REJECTED
                            </span>
                          </td>
                        </>
                      ) : (
                        ""
                      )}

                      <td>
                        <svg
                          className="m-1"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ cursor: "pointer" }}
                          onClick={() => 
                            {
                              localStorage.setItem("ReportNumber",JSON.stringify(report?.report_number))
                              dispatch(Reports({"report":report,"project":DeliverableMain.project}))
                              navigate("/view/editReport")}}
                        >
                          <g clipPath="url(#clip0_106_9042)">
                            <path
                              d="M9.16699 3.3335H3.33366C2.89163 3.3335 2.46771 3.50909 2.15515 3.82165C1.84259 4.13421 1.66699 4.55814 1.66699 5.00016V16.6668C1.66699 17.1089 1.84259 17.5328 2.15515 17.8453C2.46771 18.1579 2.89163 18.3335 3.33366 18.3335H15.0003C15.4424 18.3335 15.8663 18.1579 16.1788 17.8453C16.4914 17.5328 16.667 17.1089 16.667 16.6668V10.8335"
                              stroke="#007D99"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15.417 2.0832C15.7485 1.75168 16.1982 1.56543 16.667 1.56543C17.1358 1.56543 17.5855 1.75168 17.917 2.0832C18.2485 2.41472 18.4348 2.86436 18.4348 3.3332C18.4348 3.80204 18.2485 4.25168 17.917 4.5832L10.0003 12.4999L6.66699 13.3332L7.50033 9.99986L15.417 2.0832Z"
                              stroke="#007D99"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_106_9042">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>

                        <svg
                          className="m-1"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setShowModalDeleteDoc(true)
                           setTempReport({"doc_id":report?.file_id,
                            "report_id": report?.report_number, "original_file_name": report?.original_file_name})
                          
                           
                          }}
                        >
                          <path
                            d="M2.5 5H17.5"
                            stroke="#007D99"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.8337 5V16.6667C15.8337 17.5 15.0003 18.3333 14.167 18.3333H5.83366C5.00033 18.3333 4.16699 17.5 4.16699 16.6667V5"
                            stroke="#007D99"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6.66699 4.99984V3.33317C6.66699 2.49984 7.50033 1.6665 8.33366 1.6665H11.667C12.5003 1.6665 13.3337 2.49984 13.3337 3.33317V4.99984"
                            stroke="#007D99"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8.33301 9.1665V14.1665"
                            stroke="#007D99"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M11.667 9.1665V14.1665"
                            stroke="#007D99"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <svg
                          style={{ cursor: "pointer" }}
                          onClick={() => 
                            {
                              localStorage.setItem("ReportNumber",JSON.stringify(report?.report_number))
                              dispatch(Reports({"report":report,"project":DeliverableMain.project}))
                              navigate("/view/viewReport")}}
                          className="m-1"
                          width="21"
                          height="21"
                          viewBox="0 0 21 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.25 10.9583V15.9583C15.25 16.4004 15.0744 16.8243 14.7618 17.1368C14.4493 17.4494 14.0254 17.625 13.5833 17.625H4.41667C3.97464 17.625 3.55072 17.4494 3.23816 17.1368C2.92559 16.8243 2.75 16.4004 2.75 15.9583V6.79167C2.75 6.34964 2.92559 5.92572 3.23816 5.61316C3.55072 5.30059 3.97464 5.125 4.41667 5.125H9.41667"
                            stroke="#007D99"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12.75 2.625H17.75V7.625"
                            stroke="#007D99"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8.58301 11.7917L17.7497 2.625"
                            stroke="#007D99"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
        


      </table>
      <div className="d-flex justify-content-center">
          {showNextButton === true ? <>
            <button className="btn customDC-color m-2" onClick={prevPage}>
            Previous Page
          </button></>:""}
        {showPrevButton=== true ? <>
          <button className="btn customDC-color m-2" onClick={nextPage}>
            Next Page
          </button></>:""}
         
        </div>
        </>
        ) :
         (
          <div className="d-flex justify-content-center align-items-center">
          <h2 className="text-center mt-5">No Assigned Projects</h2>
          </div>
        )
        }
    </div>
  );
};
