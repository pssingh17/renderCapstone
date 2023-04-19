import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import BACKEND_URL from "../../../backendUrl";
import { LoaderStatus } from "../../Common/LoaderReducer/LoaderSlice";

export const MyReviewsBox = () => {
  const [reportCountData, setReportCountData] = useState()
  const dispatch = useDispatch()
  useEffect(()=>{
    // dispatch(LoaderStatus(true))
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:8081')
    myHeaders.append('Access-Control-Allow-Credentials', true)
    axios({
     method:'get',
     maxBodyLength: Infinity,
     url: `${BACKEND_URL}/report`,
     credentials: "include", 
     withCredentials:true,
     headers:myHeaders
    }).then(res=>{
    //  dispatch(LoaderStatus(false))
    //  console.log("response form report count MyreviewBox", res.data)
    if(res?.data?.data?.length>0){
       setReportCountData(res?.data?.data)
    }
   })
    .catch(err=>{
     console.log(err)
    })
  },[])
  return (
    <div className="py-3 px-2">
      <div className="myContainer ">
        <div className="customHeader py-3 px-5">
          <div style={{fontSize:"15px",fontWeight:"Bold"}}>My Reviews</div>
          <div><a href="#">View All</a></div>
        </div>
        {reportCountData?.length>0 ? <>
        {reportCountData.map((report)=>{
          return(
            <div key={report?.statusId} className="customBody">
            <div className="customItems">
              <div>{report?.statusName}</div>
              <div className="badge bg-primary">{report?.count}</div>
            </div>
           
          </div>
          )
          
        })}
         
        </>:""}
        
      </div>
    </div>
  );
};
