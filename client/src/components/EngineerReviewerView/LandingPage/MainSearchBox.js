import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie'
import { connect, useDispatch } from "react-redux";
import { LoginDetails } from "../../Login/LoginReducer/LoginSlice";
import {ProjectNumber} from "../EngineerMain/EngineerReducers/ProjectNumber";
import BACKEND_URL from "../../../backendUrl";

export const MainSearchBox = () => {
  const [show, setShow] = useState(false);
  const [searchResult, setSearchResult] = useState()
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cookies = new Cookies()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  function removeEmptyFields(data) {
    Object.keys(data).forEach(key => {
      if (data[key] === '' || data[key] == null || data[key]== NaN) {
        delete data[key];
      }
    });
  }
  const onSubmit = (data) => {
    removeEmptyFields(data);
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
  
//  useEffect(()=>{console.log("search result check", searchResult)},[searchResult])
 const showProject=(data)=>{
  // console.log("Project number check main search box" , data)
  dispatch(ProjectNumber(data))
  localStorage.setItem("SelectedProject", JSON.stringify(data))
  navigate('/view/assignedProjects')
 }
  return (
    <>
    {show?<>
    
      <div
      className="modal show "
      style={{ display: 'block', position: 'absolute' }}
    >
       
      <Modal   show={show} onHide={handleClose} backdrop="static">
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
          <Button variant="secondary"  onClick={handleClose}>
            Close
          </Button>
        
        </Modal.Footer>
       
      </div>
      </Modal>
      </div>
    </>:""}
    
    <div className="MainSearchContainer">
      <div>
        <div className="searchHeader mx-4 mt-1 p-3">
          <div className="folderSearchSvg text-center">
            <svg
              width="34"
              height="32"
              viewBox="0 0 34 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_i_98_12680)">
                <path
                  d="M15.5835 26.6667H5.66683C4.91538 26.6667 4.19471 26.3857 3.66336 25.8856C3.13201 25.3855 2.8335 24.7072 2.8335 24V6.66667C2.8335 5.2 4.1085 4 5.66683 4H11.2343C11.701 4.00227 12.1598 4.113 12.5701 4.32235C12.9804 4.53169 13.3293 4.83317 13.586 5.2L14.7477 6.8C15.0043 7.16683 15.3533 7.46831 15.7636 7.67765C16.1738 7.887 16.6327 7.99773 17.0993 8H28.3335C29.0849 8 29.8056 8.28095 30.337 8.78105C30.8683 9.28115 31.1668 9.95942 31.1668 10.6667V16"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M24.0835 26.6667C26.4307 26.6667 28.3335 24.8759 28.3335 22.6667C28.3335 20.4576 26.4307 18.6667 24.0835 18.6667C21.7363 18.6667 19.8335 20.4576 19.8335 22.6667C19.8335 24.8759 21.7363 26.6667 24.0835 26.6667Z"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M29.75 28L27.625 26"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <filter
                  id="filter0_i_98_12680"
                  x="0"
                  y="0"
                  width="34"
                  height="36"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite
                    in2="hardAlpha"
                    operator="arithmetic"
                    k2="-1"
                    k3="1"
                  />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="shape"
                    result="effect1_innerShadow_98_12680"
                  />
                </filter>
              </defs>
            </svg>
          </div>
          <div className="px-4">
            Enter some criteria below to find some deliverables.
          </div>
        </div>
        <div className="px-4 mt-1">
          <form
            style={{ backgroundColor: "#C1C1C1" }}
            type="submit"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="SearchFieldsContainer pt-4">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Customer Name"
                  aria-describedby="emailHelp"
                  {...register("name")}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Customer Code"
                  {...register("id")}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Report Number"
                  {...register("reportId")}
                />
              
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Project Number"
                  {...register("projectId")}
                />
                
              </div>

              <div className="LoginForgot text-center pb-3">
                <button type="submit" className="btn customBtn mx-3">
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};
