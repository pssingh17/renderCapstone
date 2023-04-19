import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useForm, SubmitHandler } from "react-hook-form";
import "./AssignedProjects.css"
import { NavLink, useNavigate } from 'react-router-dom';
import debounce from 'debounce'
import BACKEND_URL from '../../../backendUrl';
import { ProjectNumber } from './EngineerReducers/ProjectNumber';


const CreateProjectFolder = () => {
  const { register, handleSubmit,getValues , trigger, setError, formState: { errors }} = useForm();
  const [showModalGreen, setShowModalGreen] = useState(false)
  const [showModalRed, setShowModalRed] = useState(false)
  const [modalRedMessage, setModalRedMessage] = useState()
  const [ProjectCreatedData, setProjectCreatedData] = useState()
  const navigate = useNavigate()
  const[searchResults, setSearchResults] = useState([])
  const[searchResults1, setSearchResults1] = useState([])
  const [searchItemSet, SetSearchItemSet] = useState()
  const dispatch = useDispatch()
  // const watchFields = watch(["showAge", "number"])
  const onSubmit= ((data) => {
    if(Date.parse(data?.client_ready) > Date.parse(data?.completion)){
      setError("completion", {
        type: "Date",
        message: "Completion Date Should be greater than start date client ready"
    });
    return
    }

    if(Date.parse(data?.start_date) > Date.parse(data?.end_date)){
      setError("end_date", {
        type: "Date",
        message: "End Date Should be greater than start date"
    });
    return
    }
  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:8081')
    myHeaders.append('Access-Control-Allow-Credentials', true)
    
    
    
    axios({
      method: 'post',
      maxBodyLength: Infinity,
        url: `${BACKEND_URL}/project/save`,
        headers:myHeaders,
        data : data,
        credentials: "include", 
        withCredentials:true,
    })
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      if(response.data.statusCode===200){
        setShowModalGreen(true)
        setProjectCreatedData({"project_number":response.data?.data?.id,"project_name":data.project_name})
       
      }
      else if (response.data.isLoggedIn==="false"){
        setShowModalRed(true)
        setModalRedMessage(response.data?.message)
        navigate('/')
      }
      if(response?.data?.message =="Dates are invalid. Start date must be smaller than end date / completion date."){
        setShowModalRed(true)
      setModalRedMessage(response.data.message)
      }
     
    })
    .catch(function (error) {
      console.log(error);
      setShowModalRed(true)
      setModalRedMessage(error.response.data.message)
    });
    
  });
  const handleClose = (e)=>{
    e.preventDefault()
    // console.log("Close CLicked")
    navigate('/view/landingPage')
  }
  useEffect(()=>{
    // console.log("search results check", searchResults)
  },[searchResults])
  return (

    <>
    {showModalGreen===true ? <>
      <div id="myCustomModal" className="customModal">
<div className="custom-modal-content">
  <div className="custom-modal-header">
   
    <h4 className='text-center'>Your Project is ready</h4>
  </div>
  <div className="custom-modal-body">
    <div className='customContent d-flex align-items-center'>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M28.6802 -0.000244141C35.4602 -0.000244141 40.0002 4.75976 40.0002 11.8398V28.1818C40.0002 35.2398 35.4602 39.9998 28.6802 39.9998H11.3402C4.56021 39.9998 0.000213623 35.2398 0.000213623 28.1818V11.8398C0.000213623 4.75976 4.56021 -0.000244141 11.3402 -0.000244141H28.6802ZM28.3602 13.9998C27.6802 13.3198 26.5602 13.3198 25.8802 13.9998L17.6202 22.2598L14.1202 18.7598C13.4402 18.0798 12.3202 18.0798 11.6402 18.7598C10.9602 19.4398 10.9602 20.5398 11.6402 21.2398L16.4002 25.9798C16.7402 26.3198 17.1802 26.4798 17.6202 26.4798C18.0802 26.4798 18.5202 26.3198 18.8602 25.9798L28.3602 16.4798C29.0402 15.7998 29.0402 14.6998 28.3602 13.9998Z" fill="#008000"/>
</svg>
<div className='ml-2'>Depending on your project type, additional tabs will be displayed that will require you to fill out additional information</div>
</div>
   
  </div>
  <div className="custom-modal-footer d-flex justify-content-end ">
    <button className='btn m-2' style={{backgroundColor:"#60CD8A", color:"white"}} onClick={()=>{
      localStorage.setItem("SelectedProject", JSON.stringify(ProjectCreatedData)) 
      dispatch(ProjectNumber(ProjectCreatedData))
       navigate('/view/assignedProjects')
      setShowModalGreen(false)}}>Proceed to your project</button>
  </div>
</div>
</div>


    </>:""}
    {showModalRed === true ? <>
      <div id="myCustomModal" className="customModal">
<div className="custom-modal-content" >
  <div className="custom-modal-header"  style={{backgroundColor:"#ff4646"}}>
   
    <h4 className='text-center'>Error</h4>
  </div>
  <div className="custom-modal-body">
    <div className='customContent d-flex align-items-center'  style={{backgroundColor:"#ff4646" , border:"0", color:"white"}}>
  
<div className='ml-2'>{modalRedMessage}</div>
</div>
   
  </div>
  <div className="custom-modal-footer d-flex justify-content-end ">
    <button className='btn m-2' style={{backgroundColor:"#ff4646", color:"white"}} onClick={()=>{
       
      setShowModalRed(false)}}>Close</button>
  </div>
</div>
</div>
    </>:""}
     <div className="homeBar">
       
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
       
       <div className="textHome mx-2 text-white">Create Project</div>
       </NavLink>

    
   </div>
    <div>
<form >
<div className='CustomFormComtainer'>
<div className='formDetailsParent'>
      <div className='FormDetails'>

        <div className="FormLeft">

    
          <div className="lefttb1">
            <section>*The Lab Performing the work</section>
            <div className="w1">
            <input className='createProjectFolderBoxBorder' type="Text" placeholder="Lab Name " {...register("lab_name",{ minLength:2, maxLength: 20, required:true })} />
            {errors.lab_name && <span  style={{color:"red"}}>This field is required</span>}
          </div></div>



          <div className="lefttb2"> 
          <section>*Project Type</section>
          <div className='moveright'>
          </div></div>
          
          <div className="w3">
          <input className='createProjectFolderBoxBorder'  type="Text" placeholder="Enter Project Type" {...register("project_type",{required:true})}></input>
         </div>
          {errors.project_type && <span  style={{color:"red"}}>This field is required</span>}
          
        
         

          <div className="lefttb3">
            <section>*Transacting Customer</section>
            <div className="w5 custom-debounce-container">
              <div className='parentSearchResult'>
            <input  className='createProjectFolderBoxBorder' type="Text" placeholder="Transacting Customer" autoComplete='off' id="transacting_customer"  {...register("transacting_customer",{ minLength:2, maxLength: 20, required:true })}
            onChange={debounce(async (e) => {
              let str = e.target.value
              // console.log("str check", str)
              let data={
                name: str
              }
              axios({
                method: 'get',
                maxBodyLength: Infinity,
                  url: `${BACKEND_URL}/user/merchant`,
                  params : data,
                
                  credentials: "include", 
                  withCredentials:true,
              })
              .then(function (response) {
                // console.log(response.data);
                if(response.data?.data?.length>0){

                  setSearchResults(response.data?.data)
                }
                else{
                  setSearchResults([])
                }
               
              })
              .catch(function (error) {
                console.log("Error block", error);
               
              });
            }, 800)}
            autocomplete="off"
            ></input>
             {errors.transacting_customer && <span style={{color:"red"}}>This field is required</span>}
            <div className='searchResultsContainer'>
            {searchResults?.length>0? 
              <div className='searchResults'>
            {searchResults?.length>0? searchResults.map((result)=>{
             
                
                return <div className='searchItem' onClick={()=>{
                  document.getElementById("transacting_customer").value = result.id;
                  document.getElementById("transacting_customer").focus();
                  setSearchResults([])
                }}>{result?.id}- {result?.name}</div>
                
              
            }):""
          }</div>:""}
          </div>
            </div>
            <button className="btn btn-dark createProjectFolderBoxBorder align-self-start" onClick={(e)=>{e.preventDefault()
            // console.log("Find custmer clcik")
            }}>Find Customer</button>
          </div></div>


          <div className="lefttb4">
            <section>*Report Recieving Customer</section>
            <div className="w6 custom-debounce-container">
              <div className='parentSearchResult'>
            <input type="Text" className='createProjectFolderBoxBorder' placeholder="Report Receiving Customer" id='receiving_customer'  {...register("receiving_customer",{ minLength:2, maxLength: 20, required:true })}
             onChange={debounce(async (e) => {
              let str = e.target.value
              // console.log("str check", str)
              let data={
                name: str,
                indentityType: 3
              }
              axios({
                method: 'get',
                maxBodyLength: Infinity,
                  url: `${BACKEND_URL}/user/search`,
                  params : data,
                
                  credentials: "include", 
                  withCredentials:true,
              })
              .then(function (response) {
                // console.log(response.data);
                if(response.data?.data?.length>0){

                  setSearchResults1(response.data?.data)
                }
                else{
                  setSearchResults1([])
                }
               
              })
              .catch(function (error) {
                console.log("Error block", error);
               
              });
            }, 800)}
            autocomplete="off"
            ></input>
             {errors.receiving_customer && <span style={{color:"red"}}>This field is required</span>}
            <div className='searchResultsContainer'>
            {searchResults1?.length>0? 
              <div className='searchResults'>
            {searchResults1?.length>0? searchResults1.map((result)=>{
             
                
                return <div className='searchItem' onClick={()=>{
                  document.getElementById("receiving_customer").value = result.id;
                  document.getElementById("receiving_customer").focus();
                  setSearchResults1([])
                }}>{result?.id}- {result?.name}</div>
                
              
            }):""
          }</div>:""}
          </div>
            </div>
            <button className="btn btn-dark createProjectFolderBoxBorder" style={{height:"fit-content"}} onClick={(e)=>{e.preventDefault()
            // console.log("Find custmer clcik")
            }}>Find Customer</button>
            </div> </div>          
          


          <div className="lefttb5">
            <section>*Project Name</section>
            <div className="w1">
            <input className='createProjectFolderBoxBorder' type="Text" placeholder="Enter Project Name"  {...register("project_name",{ minLength:2, maxLength: 20, required:true })}></input>
          </div></div>
          {errors.project_name && <span style={{color:"red"}}>This field is required</span>}

          <div classsname="lefttb6">
            <section> *Description</section>
           <div >
            <textarea className='w-100' type= "text"  {...register("description",{ minLength:2, required:true })}/> 
          </div></div>
          {errors.description && <span style={{color:"red"}}>This field is required</span>}


          <div classanme="lefttb7">
            <section>*Purchase Order Number</section>
            <div className='w1'>
            <input className='createProjectFolderBoxBorder' type="Text" placeholder="Enter Purchase order number"  {...register("purchase_order_number",{required:true})}></input>
            {errors.purchase_order_number && <span style={{color:"red"}}>This field is required</span>}
          </div></div>

        
        </div>
      <div style={{height:"100%",border:"1px solid #D9D9D9"}}></div>


            <div className='FormRight'>

          <div className="righttb1">
            <section>*Product Covered</section> </div>
            <div className='productcovered'>
            <textarea className='createProjectFolderBoxBorder' type="Text"  {...register("product_covered",{ minLength:2, required:true })}  ></textarea>
            {errors.product_covered && <span style={{color:"red"}}>This field is required</span>}
          </div>

          <div className="righttb2">
            <section>*Models</section></div>
            <div className='models'>
            <textarea className='createProjectFolderBoxBorder' type="Text"  {...register("modals",{ required:true})}></textarea>
            {errors.modals && <span style={{color:"red"}}>This field is required</span>}
          </div>


          
          
        

     

        

        <div className='d-flex w-100'>
          <div className="right" style={{width:"45%"}}>
          <section>*Date Client Ready</section>
          <div className="w">
            <div className=''>
            <input className='createProjectFolderBoxBorder custsession-date' type="date" {...register("client_ready",{required:true})} ></input>
            </div>
            {errors.client_ready && <div style={{color:"red"}}>This field is required</div>}
            </div>
            </div>
          <div className='moverig' style={{width:"45%"}}>
          <section>*Date Promised Complete</section>
          <div className="w">
            <div className=''>
            <input className='createProjectFolderBoxBorder custsession-date' type="date" {...register("completion",{required:true})}   ></input>
            </div>
            {errors.completion && <div style={{color:"red"}}>{ errors?.completion?.message ||"This field is required"}</div>}

          </div>
          
          </div>

</div>

      
         
          
        
        <div className='d-flex'> 
          
          <div className="right" style={{width:"45%"}}> 
            <section>*Date Project Starts</section>
            <div className="w ">
              <div className=''>
          <input className='createProjectFolderBoxBorder custsession-date' type="Date" {...register("start_date",{required:true})} ></input>
          </div>
          {errors.start_date && <div style={{color:"red"}}>This field is required</div>}</div>
          </div>
            <div className='moverig' style={{width:"45%"}}>
              
            <section>*Date Project Ends</section>
            <div className="w">
              <div className=''>
            <input className='createProjectFolderBoxBorder custsession-date' type="Date" {...register("end_date",{required:true})} ></input>
            </div>
            {errors.end_date && <div style={{color:"red"}}>{errors?.end_date?.message  ||"This field is required"}</div>}


          </div>
            </div>


           
            </div>
        
          
         


        </div>
           
             
        

        </div>
         </div>
</div>
<div className='customRandomID d-flex justify-content-end'>
      <button className='btn btn-success m-2' onClick={
        handleSubmit(onSubmit)} >Create Project Folder</button>
      
      <div className=' w-auto'> 
      <button className='btn m-2 btn-dark' onClick={handleClose}>Cancel</button></div>
  </div>  
     
</form >
    
  
    </div>
 </> )
}

export default CreateProjectFolder

