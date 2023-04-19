import React, { useEffect, useState } from "react";
import { AssignedProjectsBox } from "./AssignedProjectsBox";
import { MainSearchBox } from "./MainSearchBox";
import { MyNotificationsBox } from "./MyNotificationsBox";
import { MyReviewsBox } from "./MyReviewsBox";
import { ReviewNotificationsBox, ReviewNotificationsTab } from "./ReviewNotificationsBox";
import "./LandingPage.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useCookies } from "react-cookie";
import { userLoginCheck } from "../../../helpers/userLoginCheck";
import { LoginDetails } from "../../Login/LoginReducer/LoginSlice";
import { LoaderStatus } from "../../Common/LoaderReducer/LoaderSlice";
import { useForm } from "react-hook-form";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


import Cookies from "universal-cookie";
import BACKEND_URL from "../../../backendUrl";

export const LandingPage = () => {
  const ULogged = useSelector((state)=>state.Login.value)
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [searchResult, setSearchResult] = useState()
  const showProject=(data)=>{
  //   localStorage.setItem("ProjectName",JSON.stringify(data?.project_name))
  localStorage.setItem("SelectedProject", JSON.stringify(data))

    navigate('/view/assignedProjects')
   }
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate()
  const cookies = new Cookies()
 
  const onSubmit = (data) => {
    // console.log(data);
    Object.keys(data).forEach(key => {
      data[key] = data[key].trim()
    })
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:8081')
    myHeaders.append('Access-Control-Allow-Credentials', true)
    
   
    
    axios({
      method: 'get',
      maxBodyLength: Infinity,
        url: `${BACKEND_URL}/project/search`,
        params : data,
        headers:myHeaders,
        credentials: "include", 
        withCredentials:true,
    })
    .then(function (response) {
      // console.log(response.data);
      setShow(true)
      setSearchResult(response.data?.data)
      if(response.data?.isLoggedIn == false){
        cookies.remove('connect.sid')
      dispatch(LoginDetails({}))
      localStorage.setItem("AlertMessage", JSON.stringify("Session Expired...Please Login Again"))
        navigate('/')
      }
    })
    .catch(function (error) {
      console.log("Error block", error);
      if(error?.response?.status===401){
        dispatch(LoginDetails({}));
            cookies.remove('connect.sid');
            localStorage.setItem("AlertMessage", JSON.stringify("Session Expired...Please Login Again"))
          navigate('/')
      }
     
    });
  };

 
  let dispatch = useDispatch()


  useEffect(()=>{
    dispatch(LoaderStatus(true))
   userLoginCheck().then(res=>{
    // console.log("landing page ulog check",res)
    dispatch(LoaderStatus(false))
    if(res?.data?.isLoggedIn===false){
      cookies.remove('connect.sid')
      dispatch(LoginDetails({}))
      localStorage.setItem("AlertMessage", JSON.stringify("Session Expired...Please Login Again"))
      return navigate('/')
    }
  }).catch(err=>{
    console.log("landing page err ",err)
    if(err?.response?.status===401){
      dispatch(LoginDetails({}));
          cookies.remove('connect.sid')
          localStorage.setItem("AlertMessage", JSON.stringify("Session Expired...Please Login Again"))
        navigate('/')
    }
  
   })
 

   },[])
 
  return (
    <>
   
   
    <>
     {show?<>
      <div
      className="modal show "
      style={{ display: 'block', position: 'absolute' }}
    >
      <Modal  show={show} onHide={handleClose} backdrop="static">
      <div  className="searchModal">
        <Modal.Header>
          <Modal.Title>Search Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {searchResult?.length>0? searchResult.map((data, index)=>{
            return(
            <div key={index}>
            <div className="d-flex resultCs" onClick={()=>{
              showProject(data)
            }}>
            <p className="m-2 mr-3"><b>Project Name</b> : {data?.project_name}</p>
            <p className="m-2"><b>Project Number</b> : {data?.project_number}</p>
            </div>
            
            </div>
            )
          }):"Please try with different criteria"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        
        </Modal.Footer>
        </div>
      </Modal>
      
      </div>
    </>:""}
    <div className="homeBar">
       
       <NavLink className="leftHBar" to="/view/landingPage">
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
       
       <div className="textHome mx-2 text-white">Home</div>
       </NavLink>

     <div className="rightHBar">
       <div className="searchBox">
         <input type="text" placeholder="Report Number" {...register("reportId")} />
         <svg
           width="31"
           height="31"
           viewBox="0 0 31 31"
           fill="none"
           xmlns="http://www.w3.org/2000/svg"
           style={{cursor:"pointer"}}
           onClick={handleSubmit(onSubmit)}
         >
           <path
             d="M0 0H27.2062C28.9736 0 30.4062 1.43269 30.4062 3.2V27.3469C30.4062 29.1142 28.9736 30.5469 27.2062 30.5469H0V0Z"
             fill="white"
             fillOpacity="0.5"
           />
           <path
             d="M20.5441 17.8574L18.3176 15.6309C18.2062 15.5418 18.0727 15.475 17.9391 15.475H17.5828C18.184 14.6957 18.5625 13.716 18.5625 12.625C18.5625 10.0867 16.4695 7.99375 13.9313 7.99375C11.3707 7.99375 9.3 10.0867 9.3 12.625C9.3 15.1855 11.3707 17.2563 13.9313 17.2563C15 17.2563 15.9797 16.9 16.7812 16.2766V16.6551C16.7812 16.7887 16.8258 16.9223 16.9371 17.0336L19.1414 19.2379C19.3641 19.4605 19.698 19.4605 19.8984 19.2379L20.5219 18.6145C20.7445 18.4141 20.7445 18.0801 20.5441 17.8574ZM13.9313 15.475C12.3504 15.475 11.0813 14.2059 11.0813 12.625C11.0813 11.0664 12.3504 9.775 13.9313 9.775C15.4898 9.775 16.7812 11.0664 16.7812 12.625C16.7812 14.2059 15.4898 15.475 13.9313 15.475Z"
             fill="#4F4F4F"
             fillOpacity="0.5"
           />
           <path
             d="M0.5 0.5H27.2062C28.6974 0.5 29.9062 1.70883 29.9062 3.2V27.3469C29.9062 28.838 28.6974 30.0469 27.2062 30.0469H0.5V0.5Z"
             stroke="#BDBDBD"
             strokeOpacity="0.5"
           />
         </svg>
       </div>
     
         <svg className="mx-2"
           width="30"
           height="29"
           viewBox="0 0 30 29"
           fill="none"
           xmlns="http://www.w3.org/2000/svg"
         >
           <rect
             x="0.90625"
             y="0.5"
             width="27.8594"
             height="27.6094"
             rx="2.7"
             fill="white"
           />
           <path
             d="M14.4945 16.4016C14.7125 16.6195 15.0758 16.6195 15.2938 16.4016L20.0164 11.7031C20.2344 11.4609 20.2344 11.0977 20.0164 10.8797L19.4594 10.3227C19.2414 10.1047 18.8781 10.1047 18.6359 10.3227L14.9063 14.0523L11.1523 10.3227C10.9102 10.1047 10.5469 10.1047 10.3289 10.3227L9.77188 10.8797C9.55391 11.0977 9.55391 11.4609 9.77188 11.7031L14.4945 16.4016Z"
             fill="#4F4F4F"
           />
           <rect
             x="0.90625"
             y="0.5"
             width="27.8594"
             height="27.6094"
             rx="2.7"
             stroke="#BDBDBD"
           />
         </svg>
       
     </div>
   </div>
   <div className="customLandingPage">
     <div className="customLeftNav">
       <MyReviewsBox />
       <MyNotificationsBox />
     </div>
     <MainSearchBox />
     <div className="customRightNav">
       <AssignedProjectsBox />
       <ReviewNotificationsBox />
     </div>
   </div>
    </>
  
      
     
    </>
  );
};
