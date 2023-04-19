import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom'
import { LoginDetails } from '../../Login/LoginReducer/LoginSlice';
import "./ViewReportScreen.css"
import Cookies from "universal-cookie";
import { LoaderStatus } from '../../Common/LoaderReducer/LoaderSlice';
import BACKEND_URL from '../../../backendUrl';
import { Reports } from '../EngineerMain/EngineerReducers/ReportDetails';
import { DownloadSvg } from '../../Icons/DownloadSvg';

const ViewReportsScreen = () => {
  const ReportsDetailsRedux = useSelector((state) => state.ReportDetails.value);
  const dispatch = useDispatch()
  const cookies = new Cookies()
  const navigate = useNavigate()
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "http://localhost:8081");
  myHeaders.append("Access-Control-Allow-Credentials", true);
  useEffect(()=>{
    let report_number = JSON.parse(localStorage.getItem("ReportNumber"))
    if(report_number != undefined){
      dispatch(LoaderStatus(true))
      axios({
        method: "get",
        maxBodyLength: Infinity,
        url: `${BACKEND_URL}/report/${report_number}`,
      
        credentials: "include",
        withCredentials: true,
        headers: myHeaders,
      })
        .then((res) => {
          dispatch(LoaderStatus(false))
          //  console.log("response ", res.data.data)
          if (res?.data?.data) {
           
            dispatch(Reports(res?.data?.data));
            
          }
        })
        .catch((err) => {
          console.log("error view report box  ", err);
        });
    }
  },[])

  return (
    
    <div>

<div className='ReviewReports py-2'>
<NavLink className="leftHBar" to="">
         <svg
           width="25"
           height="23"
           viewBox="0 0 25 23"
           fill="none"
           xmlns="http://www.w3.org/2000/svg"
         >
           <path
             d="M1.5625 21C1.5625 21.8789 2.24609 22.5625 3.125 22.5625H21.875C22.7051 22.5625 23.4375 21.8789 23.4375 21V6.9375H1.5625V21ZM9.375 10.6484C9.375 10.3555 9.61914 10.0625 9.96094 10.0625H15.0391C15.332 10.0625 15.625 10.3555 15.625 10.6484V11.0391C15.625 11.3809 15.332 11.625 15.0391 11.625H9.96094C9.61914 11.625 9.375 11.3809 9.375 11.0391V10.6484ZM23.4375 0.6875H1.5625C0.683594 0.6875 0 1.41992 0 2.25V4.59375C0 5.0332 0.341797 5.375 0.78125 5.375H24.2188C24.6094 5.375 25 5.0332 25 4.59375V2.25C25 1.41992 24.2676 0.6875 23.4375 0.6875Z"
             fill="white"
           />
         </svg>
       
       <div className="textHome mx-2 text-white">Review Reports</div>
       </NavLink>

</div>



{ReportsDetailsRedux?.report ? <>
  
  <div className='reviewparents'>

<div className='review'>




<div className='ProjectNumber'>
<section>Project Number</section>
<input type="text"  disabled placeholder={ReportsDetailsRedux?.report?.project_number}></input></div>

<div className='ReviewType'>
    <section>Review Type</section>
    {ReportsDetailsRedux?.documents && ReportsDetailsRedux?.documents[0]?.type === "certificate" ? <>
        <input type="text" disabled placeholder="Certificate"></input>
        </>:<input type="text" disabled placeholder="Report"></input> }</div>

    <div className='ReportType'>
        <section>Report Type</section>
        {ReportsDetailsRedux?.documents && ReportsDetailsRedux?.documents[0]?.sub_type ===2 ? <>
          <input
          type="text"
          placeholder="Deliverable"
          disabled
        ></input>
        </>: <input
          type="text"
          placeholder={ReportsDetailsRedux?.report?.file_sub_type}
          disabled />}
       </div>

        <div className='RecievingContact'>
        <section>Recieving Contact</section>
        <input type="text" disabled placeholder={ReportsDetailsRedux?.report?.receiving_customer}></input></div>

        <div className='ResponsiblePerson'>
        <section>Responsible Person </section>
        <input type="text" placeholder={ReportsDetailsRedux?.report?.reviewer_id } ></input></div>

        <div className='ReviewerDate'>
        <section>Reviewer</section>
        <input type="text" disabled placeholder={ReportsDetailsRedux?.report?.reviewer_id}></input></div>

</div>
<div className='reportsreceivingcontainer'>

        <div className='ReportRecieving'>
        <section>Report Recieving Customer</section>
        <input type="text" disabled placeholder={ReportsDetailsRedux?.report?.receiving_customer}></input></div>


        <div className='ReportReview'>
        <section>Report Review Status:</section>
        <input type="text" disabled placeholder={ReportsDetailsRedux?.report?.status_id}></input></div>



        <div className='ProductsCovered'>
        <section>Products Covered</section>
        <input
          type="text"
          placeholder={ReportsDetailsRedux?.report?.products_covered || ReportsDetailsRedux?.project?.product_covered}
          disabled
        ></input></div>

        <div className='Models'>
        <section>Models</section>
        <input
          type="text"
          placeholder={ReportsDetailsRedux?.report?.models || ReportsDetailsRedux?.project?.modals}
          disabled
        ></input></div>

        <div className='Project'>
        <section>Project</section>
        <input
          type="text"
          placeholder={ReportsDetailsRedux?.report?.['project_number_fk.project_name']}
          disabled
        ></input></div>

        <div className='Comments'>
        <section>Comments:</section>
        <input
          type="text"
          placeholder={ReportsDetailsRedux?.report?.report_comments ||  ReportsDetailsRedux?.report?.comments}
          disabled
        ></input></div>


        </div>

<div className='Reportsstandards' style={{maxWidth:"600px" , maxHeight:"350px", overflow:"auto"}}>
<section>Report Standards</section> 
<table className="table" style={{margin:"0", backgroundColor:"white", borderBottom:"0",width:"600px",marginTop: "0"}}>
  <thead>
    <tr>
      <th scope="col" >Type</th>
      <th scope="col">Standard</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
  <tbody>
    {ReportsDetailsRedux?.standards?.length>0 ? 
    <>
      {ReportsDetailsRedux?.standards.map((standard)=>{
        return(
          <tr key={standard?.id} style={{backgroundColor:"white"}}>
          <th >{standard?.standard_type}</th>
          <td>{standard?.standard}</td>
          <td>{standard?.description}</td>
        </tr>
        )
      })}
    </>
    :""}
   
   
  </tbody>
</table>   
</div>

        </div>
        <div className='DocumentsParents'>
    <h4><b>DOCUMENTS</b></h4>
    {/* <button type="button" className="btn btn-dark">ADD REVIEW DOCUMENTS</button> */}
</div>
<table className="table" style={{width:"90%"}}>
  <thead>
    <tr>
      <th scope="col">Report</th>
      <th scope="col">Model</th>
      <th scope="col">Validation Status</th>
      {/* <th scope="col">Review Status</th> */}
      <th scope="col"></th>
    </tr>
  </thead>
  
  <tbody>
  {ReportsDetailsRedux?.documents?.length>0 ? <>
                      {ReportsDetailsRedux?.documents?.map((report)=>{
                        return(<tr key={report?.file_id}>
                          <th scope="row">
                             {report?.original_file_name}
                            </th>
                            <td>{ReportsDetailsRedux?.report?.models}</td>
                  {ReportsDetailsRedux?.report?.report_status ===
                  "SENT TO REVIEWER" || ReportsDetailsRedux?.report?.status_type ===
                  "SENT TO REVIEWER" ? (
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
                  {ReportsDetailsRedux?.report?.report_status ===
                  "VALIDATION FAILED" || ReportsDetailsRedux?.report?.status_type ===
                  "VALIDATION FAILED" ? (
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
                   {ReportsDetailsRedux?.report?.report_status ===
                  "DECLINED" || ReportsDetailsRedux?.report?.status_type ===
                  "DECLINED" ? (
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
                    <span className="badge badge-pill badge-secondary">
                      Pending
                    </span>
                  </td>
                  <div className="d-flex align-items-center m-2">
                   
                    <>
                 


                      <span onClick={() => {
                          window.open(
                            `${BACKEND_URL}/report/download/${report?.file_id}`
                          );
                        }}>
                          <DownloadSvg />
                        </span>
                    </>
                  </div>           
                      </tr>  )
                      })}
                    </>:
                   ""
                    }

  </tbody>
</table>

</>:""}


        
            






   
</div>


    
  )
}

export default ViewReportsScreen
