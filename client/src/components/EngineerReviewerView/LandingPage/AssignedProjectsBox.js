import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {ProjectNumber} from "../EngineerMain/EngineerReducers/ProjectNumber";
import BACKEND_URL from "../../../backendUrl";

export const AssignedProjectsBox = () => {
  const [show, setShow] = useState(false);
  const [searchResult, setSearchResult] = useState()
  const handleClose = () => setShow(false);
  const ULogged = useSelector((state)=>state.Login.value)
  const dispatch = useDispatch()
  const handleShow = () => setShow(true);
  let navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    Object.keys(data).forEach(key => {
      data[key] = data[key].trim()
    })
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:8081')
    myHeaders.append('Access-Control-Allow-Credentials', true)
    axios({
     method:'get',
     maxBodyLength: Infinity,
     url: `${BACKEND_URL}/project`,
     credentials: "include", 
     withCredentials:true,
     params:{
      name:data?.name
     },
     headers:myHeaders
    }).then(res=>{
      // console.log("res in project name", res)
      setShow(true)
      setSearchResult(res.data?.data)
    if(res?.data?.data?.length>0){
      //  setNotificationData(res?.data?.data)
    }
   })
    .catch(err=>{
     console.log("error assigned project box  ",err)
    })
  };
  const showProject=(data)=>{
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
      <Modal show={show} onHide={handleClose} backdrop="static">
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
    
    <div className="py-3 px-2 ">
      <div className="myContainer">
        <div className="customHeader py-3 px-5">
          <div style={{ fontSize: "15px", fontWeight: "Bold" }}>
            Assigned Projects
          </div>
          <div>
          
              <div className="btn text-primary pt-0" onClick={()=>navigate('/view/assignedProjects')}>View All</div>
          
          
          </div>
        </div>
        <div className="customBody">
          <div className="customItemsAssignedProj">
            <div>
              <form type="submit">
                <div className="filterAssignedProjectsContainer pt-4">
                  <div className="mb-3 d-flex w-auto">
                    <input
                      type="text"
                      className="form-control customAssProjSearchHeight"
                      placeholder="Project Name"
                      aria-describedby="emailHelp"
                      {...register("name")}
                    />
                    <div className="customSvg ml-1 mt-1" onClick={handleSubmit(onSubmit)}>
                      <svg
                        width="31"
                        height="31"
                        viewBox="0 0 31 31"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.5 0.5H27.2062C28.6974 0.5 29.9062 1.70883 29.9062 3.2V27.3469C29.9062 28.838 28.6974 30.0469 27.2062 30.0469H0.5V0.5Z"
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
                          stroke="#3598AD"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>);
};
