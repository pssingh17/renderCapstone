import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { div, useNavigate } from "react-router-dom";
import BACKEND_URL from "../../../backendUrl";
import { LoaderStatus } from "../../Common/LoaderReducer/LoaderSlice";
import { InfoSvg } from "../../Icons/InfoSvg";
import { Reports } from "../EngineerMain/EngineerReducers/ReportDetails";
import { ReviewerAllReports } from "./ReviewerReducers/ReviewerAllReportsSlice";
import "./ReviewMain.css";

const ReviewMainPage = () => {
  const ULogged = useSelector((state) => state.Login.value);
  const reviewData = useSelector((state) => state.ReviewerData.value);
  const [offset, setOffset] = useState(0)
  const [screenId, setScreenId] = useState(4)
  const [showNextButton, setShowNextButton] = useState(true)
  const [showPrevButton, setShowPrevButton] = useState(true)
  
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "http://localhost:8081");
  myHeaders.append("Access-Control-Allow-Credentials", true);

  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const nextPage = () => {
  
  if(reviewData?.length>=8){
    let newOffset = offset+8
    setOffset(newOffset)
    getReviewPageData({"newOffset":newOffset})
  }

  };
  const prevPage = () => {
   if(offset>=8){
    let newOffset = offset-8
    setOffset(newOffset)
    getReviewPageData({"newOffset":newOffset})

   }
  };

  const getReviewPageData = (dataObj)=>{
    // console.log(dataObj)
    let sId
    if(dataObj?.screenId != undefined){
      sId = dataObj.screenId
    }
    else{
      sId = screenId
    }
    dispatch(LoaderStatus(true));
    axios({
      method: "get",
      maxBodyLength: Infinity,
      url: `${BACKEND_URL}/project/notifications`,
      params: {
        "offset": dataObj?.newOffset || 0,
        "limit":  8,
        "screenId": sId
      },
      credentials: "include",
      withCredentials: true,
      headers: myHeaders,
    })
      .then((res) => {
        dispatch(LoaderStatus(false));
        //  console.log("response ", res.data)
        if (res?.data?.data) {
          if(res.data.data.length<8 && offset==0){
            setShowNextButton(false)
            setShowPrevButton(false)
          }
          else{
            setShowNextButton(true)
            setShowPrevButton(true)
          }
          dispatch(ReviewerAllReports(res?.data?.data));
          //  setReviewData(res?.data?.data)
        }
      })
      .catch((err) => {
        console.log("error mynotification box  ", err);
      });
  }


  useEffect(() => {
    
    getReviewPageData()
   
  }, []);

  useEffect(()=>{
    // console.log("offset", offset)
  },[offset])
  return (
    <div>
      <div className="containerbox" style={{ padding: "0.5rem", }}>
        <div 
         className={screenId === 1 ? 'text-primary':""}
          style={{"display": "flex",
            alignItems: "baseline",
            fontSize:"0.8rem",cursor:"pointer" }}
            onClick={()=>{
              setOffset(0)
              setScreenId(1)
              getReviewPageData({screenId:"1"})}}
        >
          PENDING
        <InfoSvg />
        </div>

        <div
         
         
          style={{"display": "flex",
          alignItems: "baseline",
            fontSize:"0.8rem",
            cursor:"pointer" 
          }}
          
        >
          PENDING W/ERRORS
          <InfoSvg />
        </div>

        <div
        
      
         className={screenId === 3 ? 'text-primary':""}
          style={{"display": "flex",
          alignItems: "baseline",
            fontSize:"0.8rem",
            cursor:"pointer" 
          }}
          onClick={()=>{
            setOffset(0)
            setScreenId(3)
            getReviewPageData({screenId:"3"})}}
        >
          Declined
          <InfoSvg />
        </div>

        <div
         className={screenId === 4 ? 'text-primary':""}
         style={{"display": "flex",
         alignItems: "baseline",
            cursor:"pointer" ,
            fontSize:"0.8rem"}}
            onClick={()=>{
              setScreenId(4)
              setOffset(0)
              getReviewPageData({screenId:"4"})}}
        > 
          SENT TO REVIEWER
          <InfoSvg />
        </div>

        <div
        
        className={screenId === 8 ? 'text-primary':""}
          style={{"display": "flex",
          alignItems: "baseline",
            cursor:"pointer" ,
            fontSize:"0.8rem"}}
            onClick={()=>{
              setOffset(0)
              setScreenId(8)
              getReviewPageData({screenId:"8"})}}
        >
          REJECTED BY CERTIFICATION
          <InfoSvg />
        </div>

        <div
     
     className={screenId === 7 ? 'text-primary':""}
          style={{"display": "flex",
          alignItems: "baseline",
            cursor:"pointer" ,
            fontSize:"0.8rem"}}
            onClick={()=>{
              setOffset(0)
              setScreenId(7)
              getReviewPageData({screenId:"7"})}}
        >
          APPROVED
          <svg
            width="12"
            height="12"
            viewBox="-5 -3 20 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_73_16003)">
              <path
                d="M7.5 13.75C10.9518 13.75 13.75 10.9518 13.75 7.5C13.75 4.04822 10.9518 1.25 7.5 1.25C4.04822 1.25 1.25 4.04822 1.25 7.5C1.25 10.9518 4.04822 13.75 7.5 13.75Z"
                stroke="black"
                strokeOpacity="0.5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 5V7.5"
                stroke="black"
                strokeOpacity="0.5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 10H7.50625"
                stroke="black"
                strokeOpacity="0.5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>

        <div
        
        className={screenId === 6 ? 'text-primary':""}
          style={{"display": "flex",
          alignItems: "baseline",
            cursor:"pointer" ,
            fontSize:"0.8rem"}}
            onClick={()=>{
              setOffset(0)
              setScreenId(6)
              getReviewPageData({screenId:"6"})}}
        >
          PENDING CERTIFICATION
          <InfoSvg />
        </div>

        <div
        
        className={screenId === 5 ? 'text-primary':""}
          style={{"display": "flex",
          alignItems: "baseline",
            cursor:"pointer" ,
            fontSize:"0.8rem"}}
            onClick={()=>{
              setOffset(0)
              setScreenId(5)
              getReviewPageData({screenId:"5"})}}
        >
          HOLD
          <InfoSvg />
        </div>

        <div
        
        // className={screenId === 8 ? 'text-primary':""}
          style={{"display": "flex",
          alignItems: "baseline",
            cursor:"pointer" ,
            fontSize:"0.8rem"}}
            onClick={()=>{
              setOffset(0)
              setScreenId(3)
              // getReviewPageData({screenId:"8"})
            }
            }
        >
          CANCELED
          <InfoSvg />
        </div>
      </div>
      {ULogged?.is_reviewer === true && reviewData?.length > 0 ? (
            <div style={{minHeight:"52.5vh"}}>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Date Created</th>
            <th scope="col">Report</th>
            <th scope="col">Type</th>
            <th scope="col">Project Number</th>
            <th scope="col">Project Name</th>
            <th scope="col">Report Receiving Customer</th>
            <th scope="col">Engineer</th>
            <th scope="col">Reviewer</th>
            <th scope="col">Status</th>
            <th scope="col"></th>
          </tr>
        </thead>
      
        <tbody>
       
              {reviewData
                ?.map((data) => {
                  return (
                    <tr key={data?.report_number}>
                      <th>{data?.report_created_at}</th>
                      <td>{data?.report_number}</td>
                      <td>{data?.report_name}</td>
                      <td>{data?.project_number}</td>
                      <td>{data?.project_name}</td>
                      <td>{data?.receiving_customer_name}</td>
                      <td>{data?.engineer_name}</td>
                      <td>{data?.reviewer_name}</td>
                      {data?.status_type === "SENT TO REVIEWER" ? (
                        <>
                          {" "}
                          <td>
                            <span className="badge badge-primary">
                              Sent to Reviewer
                            </span>
                          </td>
                        </>
                      ) :  ""}
                       {data?.status_type === "VALIDATION FAILED" ? (
                        <>
                          {" "}
                          <td>
                            <span className="badge badge-warning">
                              Validation Failed
                            </span>
                          </td>
                        </>
                      ) :  ""}
                       {data?.status_type === "PENDING" ? (
                        <>
                          {" "}
                          <td>
                            <span className="badge badge-warning">
                              Pending
                            </span>
                          </td>
                        </>
                      ) :  ""}
                        {data?.status_type === "APPROVED" ? (
                        <>
                          {" "}
                          <td>
                            <span className="badge badge-success">
                              Approved
                            </span>
                          </td>
                        </>
                      ) :  ""}
                       {data?.status_type === "DECLINED" ? (
                        <>
                          {" "}
                          <td>
                            <span className="badge badge-danger">
                              Declined
                            </span>
                          </td>
                        </>
                      ) :  ""}
                       {data?.status_type === "REJECTED" ? (
                        <>
                          {" "}
                          <td>
                            <span className="badge badge-danger">
                              Rejected
                            </span>
                          </td>
                        </>
                      ) :  ""}
                      

                      <td>
                        <span
                          className=" stretched-link"
                          style={{ cursor: "pointer", color: "#007bff" }}
                          onClick={async () => {
                            dispatch(LoaderStatus(false));
                            localStorage.setItem("ReportNumber", JSON.stringify(data?.report_number))
                            await  axios({
                              method: "get",
                              maxBodyLength: Infinity,
                              url: `${BACKEND_URL}/report/${data?.report_number}`,
                            
                              credentials: "include",
                              withCredentials: true,
                              headers: myHeaders,
                            })
                              .then((res) => {
                                dispatch(LoaderStatus(false))
                                //  console.log("response ", res.data.data)
                                if (res?.data?.data) {
                                 
                                  dispatch(Reports(res?.data?.data));
                                 navigate("/view/editReport");    
                                }
                              })
                              .catch((err) => {
                                console.log("error view report box  ", err);
                              });
                           
                          }}
                        >
                          View
                        </span>
                        <svg
                          width="15"
                          height="15"
                          viewBox="-2 -3 20 22"
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
                            strokeWidth="1"
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
      </div>)
           : (
            <h3 className="text-center">No Documents yet</h3>
          )}
     
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
    

     
    </div>
  );
};

export default ReviewMainPage;
