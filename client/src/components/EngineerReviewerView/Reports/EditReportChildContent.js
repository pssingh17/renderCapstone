import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {EditSvg} from '../../Icons/EditSvg'
import axios from 'axios';
import { useForm, SubmitHandler } from "react-hook-form";
import BACKEND_URL from '../../../backendUrl';
import { LoaderStatus } from '../../Common/LoaderReducer/LoaderSlice';
import { Reports } from '../EngineerMain/EngineerReducers/ReportDetails';
import debounce from 'debounce'
import { LoginDetails } from '../../Login/LoginReducer/LoginSlice';
import Cookies from "universal-cookie"
import { useNavigate } from 'react-router-dom';




export const EditReportChildContent = (props) => {
  const [standards , setStandards] = useState([])
  const [slicedStandards, setSlicedStandards] = useState([])
  const [activeStandard, setActiveStandard] = useState(1)
  const ReportsDetailsRedux = useSelector((state) => state.ReportDetails.value);
  const { register, handleSubmit,getValues , trigger, formState: { errors }} = useForm();
  const[searchResults, setSearchResults] = useState([])
  const[searchResults1, setSearchResults1] = useState([])
  const[searchResults2, setSearchResults2] = useState([])
  const [ProjectCreatedData, setProjectCreatedData] = useState()


  const cookies = new Cookies()
  const navigate = useNavigate()
  const [inputDisabledState, setInputDisabledState] = useState(true)
  const dispatch = useDispatch()
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "http://localhost:8081");
  myHeaders.append("Access-Control-Allow-Credentials", true);

  function removeEmptyFields(data) {
    Object.keys(data).forEach(key => {
      if (data[key] === '' || data[key] == null || data[key]== NaN || data[key]=== undefined) {
        delete data[key];
      }
    });
  }
  
  const  onSubmit= ((fdata) => {
    removeEmptyFields(fdata)
    // console.log(fdata)
    if(fdata?.project_name || fdata?.project_number){
      let newData = {
        "metaInfo": "project_info",
        "data" : {
          project_name: fdata?.project_name,
          // project_number: fdata?.project_number
        },
        "where": ReportsDetailsRedux?.report?.report_number
      }
      updateData(newData)
    }
   if(fdata?.products_covered || fdata?.models || fdata?.comments || fdata?.receiving_customer || fdata?.reviewer_id){
    let {project_name, ...data} = fdata
    let newData = {
      "metaInfo": "report",
        data,
      "where": ReportsDetailsRedux?.report?.report_number
    }
    updateData(newData)
   }
 
   
    
  });
  const updateData = async (data)=>{
    // console.log("sending data", data)
    dispatch(LoaderStatus(true))
   await axios({
      method: 'post',
      maxBodyLength: Infinity,
        url: `${BACKEND_URL}/report/update`,
        headers:myHeaders,
        data : {
          ...data,
         
        },
        credentials: "include", 
        withCredentials:true,
    })
    .then(function (response) {
      // console.log(response.data);
      if(response?.data?.statusCode === 200){
        
        props.getReportById(ReportsDetailsRedux?.report?.report_number)
        setInputDisabledState(true)
        
      }
     
    })
    .catch(function (error) {
      dispatch(LoaderStatus(false))
      console.log(error);
      
    });
    
  }
  useEffect(()=>{
    dispatch(LoaderStatus(false))
    axios({

      method: 'get',
      maxBodyLength: Infinity,
      url: `${BACKEND_URL}/report/review/standards`,
      
      headers:myHeaders,
       
        credentials: "include", 
        withCredentials:true,
     
    }).then(res=>{
      // console.log("Resp from review standards api- ",res)
      setStandards(res?.data?.data)
       
      })
      .catch(error=>{
        console.log("Error block new reports", error);
        if(error?.code==="ERR_NETWORK" || error?.response?.status==401){
          dispatch(LoginDetails({}));
              cookies.remove('connect.sid');
              localStorage.setItem("AlertMessage", JSON.stringify("Session Expired...Please Login Again"))
            navigate('/')
        }
        else{
        //   setShowRed(true)
        // setAlertValue(error?.response?.data?.message)
        dispatch(LoaderStatus(false))
        }
      })
  },[])
  useEffect(()=>{
    // console.log("STandatd state-", standards)
    setSlicedStandards(standards?.slice(0,4))
  },[standards])
  return (
    <>
    <div className="reviewparents">
    <div className="review">
     
      <div className="ProjectNumber">
        <section>Project Number </section>
      
   <input
          type="text"
          placeholder={
            ReportsDetailsRedux?.project?.project_number || ReportsDetailsRedux?.report?.project_number
          }
        
          disabled

        ></input>
      
        
      </div>
     
      <div className="ReviewType">
        <section>Review Type</section>
        
        {ReportsDetailsRedux?.documents && ReportsDetailsRedux?.documents[0]?.type === "certificate" ? <>
        <input type="text" disabled placeholder="Certificate"   {...register("certificate")}></input>
        </>:<input type="text" disabled placeholder="Report" autoFocus  {...register("report")}></input> }
       
      </div>

      <div className="ReportType">
        <section>Report Type</section>
        {ReportsDetailsRedux?.documents && ReportsDetailsRedux?.documents[0]?.sub_type ===3 ? <>
          <input
          type="text"
          placeholder="Supporting Documents"
          disabled
        ></input>
        </>:""}
        {ReportsDetailsRedux?.documents && ReportsDetailsRedux?.documents[0]?.sub_type ===2 ? 
        <>
          <input
          type="text"
          placeholder="Financial"
          disabled
        ></input>
        </>:""}
        {ReportsDetailsRedux?.documents && ReportsDetailsRedux?.documents[0]?.sub_type ===4 ? <>
          <input
          type="text"
          placeholder="Equipment Log"
          disabled
        ></input>
        </>:""}
        {ReportsDetailsRedux?.documents && ReportsDetailsRedux?.documents[0]?.sub_type ===6 ? <>
          <input
          type="text"
          placeholder="Other"
          disabled
        ></input>
        </>:""}
        {ReportsDetailsRedux?.documents && ReportsDetailsRedux?.documents[0]?.sub_type ===12 ? <>
          <input
          type="text"
          placeholder="Correspondents"
          disabled
        ></input>
        </>:""}
        {ReportsDetailsRedux?.documents && ReportsDetailsRedux?.documents[0]?.sub_type ===5 ? <>
          <input
          type="text"
          placeholder="Samples"
          disabled
        ></input>
        </>:""}
    
      </div>

      <div className="RecievingContact">
        <section>Recieving Contact</section>
        <input
          type="text"
          placeholder={
            ReportsDetailsRedux?.report?.receiving_customer 
          }
        
          disabled

        ></input>
      </div>

      <div className="ResponsiblePerson">
        <section>Responsible Person  </section>
        <input
          type="text"
          placeholder={
            ReportsDetailsRedux?.report?.reviewer_id 
          
          
          }
          disabled
        ></input>
      </div>

      <div className="ReviewerDate position-relative">
        <section>Reviewer  <span style={{cursor:"pointer"}} onClick={()=>setInputDisabledState(!inputDisabledState)}><EditSvg /></span></section>
        <input id='reviewer_id' {...register("reviewer_id")} type="text" disabled={inputDisabledState} placeholder= {
            ReportsDetailsRedux?.report?.reviewer_id }
            onChange={debounce(async (e) => {
              let str = e.target.value
              // console.log("str check", str)
              let data={
                name: str,
                indentityType:2
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
                if(response.data?.data.length>0){
          
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
            ></input>
             <div className='searchResultsContainer'>
            {searchResults1?.length>0? 
              <div className='searchResults'>
            {searchResults1?.length>0? searchResults1.map((result)=>{
             
                
                return <div key={result?.id} className='searchItem' onClick={()=>{
                  document.getElementById("reviewer_id").value = result.id;
                  document.getElementById("reviewer_id").focus();
                  setSearchResults1([])
                }}>{result?.id}- {result?.name}</div>
                
              
            }):""
          }</div>:""}
          </div>
      </div>
    </div>
    <div className="reportsreceivingcontainer">
      <div className="ReportRecieving position-relative">
        <section>Report Recieving Customer <span style={{cursor:"pointer"}} onClick={()=>setInputDisabledState(!inputDisabledState)}><EditSvg /></span></section>
        <input
          type="text"
          id='receiving_customer'
          {...register("receiving_customer")}
          placeholder={
            ReportsDetailsRedux?.report?.receiving_customer
          }
          disabled={inputDisabledState}
          onChange={debounce(async (e) => {
            let str = e.target.value
            // console.log("str check", str)
            let data={
              name: str,
              indentityType:3
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
        ></input>
         <div className='searchResultsContainer'>
            {searchResults?.length>0? 
              <div className='searchResults'>
            {searchResults?.length>0? searchResults.map((result)=>{
             
                
                return <div key={result?.id} className='searchItem' onClick={()=>{
                  document.getElementById("receiving_customer").value = result.id;
                  document.getElementById("receiving_customer").focus();
                  setSearchResults([])
                }}>{result?.id}- {result?.name}</div>
                
              
            }):""
          }</div>:""}
          </div>
      </div>

      <div className="ReportReview">
        <section>Report Review Status:</section>
        {ReportsDetailsRedux?.report?.status_id === 4 ? <>
        <span className="badge badge-primary m-1">
                              Sent to Reviewer
                              </span></>:""}
        {ReportsDetailsRedux?.report?.status_id === 3 ? <>
        <span className="badge badge-danger m-1">
                              Declined
                              </span></>:""}
      {ReportsDetailsRedux?.report?.status_id === 8 ? <>
        <span className="badge badge-danger m-1">
                              Rejected
                              </span></>:""}
                              {ReportsDetailsRedux?.report?.status_id === 7 ? <>
        <span className="badge badge-success m-1">
                              Approved
                              </span></>:""}
                              {ReportsDetailsRedux?.report?.status_id === 1 ? <>
        <span className="badge badge-warning m-1">
                              Hold
                              </span></>:""}
      </div>

      <div className="ProductsCovered">
        <section>Products Covered  <span style={{cursor:"pointer"}} onClick={()=>setInputDisabledState(!inputDisabledState)}><EditSvg /></span></section>
        <input
          type="text"
          placeholder={ReportsDetailsRedux?.report?.products_covered || ReportsDetailsRedux?.project?.product_covered}
          disabled={inputDisabledState}
          {...register("products_covered")}
        ></input>
      </div>

      <div className="Models">
        <section>Models  <span style={{cursor:"pointer"}} onClick={()=>setInputDisabledState(!inputDisabledState)}><EditSvg /></span></section>
        <input
          type="text"
          placeholder={ReportsDetailsRedux?.report?.models || ReportsDetailsRedux?.project?.modals}
          disabled={inputDisabledState}
          {...register("models")}
        ></input>
      </div>

      <div className="Project">
        <section>Project  <span style={{cursor:"pointer"}} onClick={()=>setInputDisabledState(!inputDisabledState)}><EditSvg /></span></section>
        <input
          type="text"
          placeholder={ReportsDetailsRedux?.report?.['project_number_fk.project_name']}
          disabled={inputDisabledState}
          {...register("project_name")}
        ></input>
      </div>

      <div className="Comments">
        <section>Comments  <span style={{cursor:"pointer"}} onClick={()=>setInputDisabledState(!inputDisabledState)}><EditSvg /></span></section>
        <input
          type="text"
          placeholder={ReportsDetailsRedux?.report?.report_comments ||  ReportsDetailsRedux?.report?.comments}
          disabled={inputDisabledState}
          {...register("comments")}
        ></input>
      </div>
    </div>
                 
    <div className="Reportsstandards" style={{maxWidth:"600px" , maxHeight:"350px", overflow:"auto"}}>
      <section>Report Standards
    

      </section>
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
  {inputDisabledState === false ? <>
    <button className='btn ' style={{marginLeft:"4.5rem", borderRadius:"13px", backgroundColor:"rgba(0, 125, 153, 1)", color:"white"}} onClick={handleSubmit(onSubmit)}>Save</button>
  </>:""}
 

  </>
  )
}
