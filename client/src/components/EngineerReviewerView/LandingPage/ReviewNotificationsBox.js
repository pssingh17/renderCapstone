import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BACKEND_URL from "../../../backendUrl";

export const ReviewNotificationsBox = () => {
  const [notificationData, setNotificationData] = useState()
  const ULogged = useSelector((state)=>state.Login.value)
  const navigate = useNavigate()
  

  useEffect(()=>{
    // dispatch(LoaderStatus(true))
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:8081')
    myHeaders.append('Access-Control-Allow-Credentials', true)
    axios({
     method:'get',
     maxBodyLength: Infinity,
     url: `${BACKEND_URL}/project/notifications`,
     credentials: "include", 
     withCredentials:true,
     headers:myHeaders
    }).then(res=>{
    //  dispatch(LoaderStatus(false))
    //  console.log("response form MyNotifications Box", res.data)
    if(res?.data?.data?.length>0){
       setNotificationData(res?.data?.data)
    }
   })
    .catch(err=>{
     console.log("error mynotification box  ",err)
    })
  },[])


  return (
    <div className="py-3 px-2">
      <div className="myContainer">
        <div className="customHeader py-3 px-5">
          <div style={{ fontSize: "15px", fontWeight: "Bold" }}>
            Review Notifcations
          </div>
          <div>
            {ULogged?.is_reviewer===true ? <>
              <div className="btn text-primary pt-0" onClick={()=>navigate('/view/reviewMainPage')}>View All</div>
            </>:<>
            <div className="btn text-primary pt-0">View All</div>
            </>}
         
          </div>
        </div>
        <div className="customBody">
          <div className="customItems flex-column">
            {ULogged?.is_reviewer===true && notificationData?.length>0 ?  <>
            {notificationData.slice(0,5).map((data)=>{
              return(<div className='d-flex justify-content-between align-items-center' key={data?.report_number}>
                <div>Review <b>{data?.report_status}</b> - {data?.report_name}</div>
            <div className="custominfo">
              <div className=''><a href='#'>updates@dc.i</a></div>
              <div className=''>{data?.report_created_at}</div>
            </div>
            </div>  )
            })}
            </>:""}
            
          </div>
         
        </div>
      </div>
    </div>
  );
};
