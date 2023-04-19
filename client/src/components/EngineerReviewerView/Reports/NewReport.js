import './NewReport.css'
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { LoaderStatus } from '../../Common/LoaderReducer/LoaderSlice';
import { useEffect } from 'react';
import { LoginDetails } from '../../Login/LoginReducer/LoginSlice';
import Cookies from "universal-cookie"
import debounce from 'debounce'
import BACKEND_URL from '../../../backendUrl';
import { ProjectNumber } from '../EngineerMain/EngineerReducers/ProjectNumber';
import {InfoSvg} from '../../Icons/InfoSvg'
import moment from 'moment/moment';

export const NewReport=()=>{

 
  const [name,setName] = useState("")
  const [ProjectCreatedData, setProjectCreatedData] = useState()

  
  const [close,setClose] = useState(false)
  const [count,setCount] = useState(0)


  const [standards , setStandards] = useState([])
  const [slicedStandards, setSlicedStandards] = useState([])
  const [activeStandard, setActiveStandard] = useState(1)
  const { register, handleSubmit, control , formState: { errors } , reset, setError} = useForm();
  const[searchResults, setSearchResults] = useState([])
  const[searchResults1, setSearchResults1] = useState([])
  const[searchResults2, setSearchResults2] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showGreen, setShowGreen] = useState(false);
  const [showRed, setShowRed] = useState(false)
  const [alertValue, setAlertValue] = useState()
  const cookies = new Cookies()
  const [optionValue, setOptionValue] = useState(null);
  let options = [
    { label: "FINANCIAL", value: "2" },
    { label: "SUPPORTING DOCUMENTS", value: "3" },
    { label: "EQUIPMENT LOG", value: "4" },
    { label: "SAMPLES", value: "5" },
    { label: "OTHER", value: "6" },
    { label: "CORRESPONDENTS", value: "12" },
   
  ];
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:8081')
  myHeaders.append('Access-Control-Allow-Credentials', true)
  
 
    const filteredIds = (data)=>{
      // console.log("Inside array function")
      let IdsArr=[]
      for (let id in data){
        if(data[id] === true){
          // console.log("ID true", id)
          IdsArr.push(id)
        }

      }
      return IdsArr
    }
    
  
    const defaultValues = {
      report_type: "",
      certificate_type:""
    };
   


  const onSubmit = ((data) => {
  
    let stID = filteredIds(data)
    // console.log("Date", data)
  
    let standardString = stID.toString()
    // console.log(standardString)
  
    // Report validation
    let r = data?.report[0]?.name
    let reportSize = data?.report[0]?.size
    // console.log(certificateSize,"certificateSize")
      // Certificate validation
      let c = data?.certificate[0]?.name
      let certificateSize = data?.certificate[0]?.size
      // console.log(certificateSize,"certificateSize")
    
    if(reportSize>250000000 || certificateSize>250000000 ){
   
      if(reportSize>250000000){
      setError("report", {
        type: "filetype",
        message: "Size less than 25Mb is allowed"
    });
  }
  if(certificateSize>250000000){
    setError("certificate", {
      type: "filetype",
      message: "Size less than 25Mb is allowed"
  });
}
    return
     }
     const getRExtansion =  r?.includes('.') && r?.substr(r?.lastIndexOf('.') + 1).split(' ')[0]
   
     const getCExtansion =  c?.includes('.') && c?.substr(c?.lastIndexOf('.') + 1).split(' ')[0]
     // console.log("extension check", getCExtansion)
   
    // console.log("extension check", getRExtansion)
    if(((getRExtansion!=="xlsx") && (getRExtansion!=="xls")  && (getRExtansion!=="xlsm")  && (getRExtansion!=="xlsb")  && (getRExtansion!=="doc")  && (getRExtansion!=="docx"))  ||  (
      (getCExtansion!=="xlsx") && (getCExtansion!=="xls")  && (getCExtansion!=="xlsm")  && (getCExtansion!=="xlsb")  && (getCExtansion!=="doc")  && (getCExtansion!=="docx")
    )){
      if((getRExtansion!=="xlsx") && (getRExtansion!=="xls")  && (getRExtansion!=="xlsm")  && (getRExtansion!=="xlsb")  && (getRExtansion!=="doc")  && (getRExtansion!=="docx")){
        setError("report", {
          type: "filetype",
          message: "Only Doc, Docx, Xls, Xlsx,Xlsm,Xlsb documents are valid."
      });
      }
      if((getCExtansion!=="xlsx") && (getCExtansion!=="xls")  && (getCExtansion!=="xlsm")  && (getCExtansion!=="xlsb")  && (getCExtansion!=="doc")  && (getCExtansion!=="docx")){

        setError("certificate", {
            type: "filetype",
            message: "Only Doc, Docx, Xls, Xlsx,Xlsm,Xlsb documents are valid."
        });
 
    return;

    }

   
   return

    }
 
    // console.log("data check pn", data)
    let formData = new FormData()
    formData.append('issued_at', data.issued_at);
    formData.append('tags', data.tags);
    formData.append('comments', data.comments);
    formData.append('products_covered', data.products_covered);
    formData.append('models', data.models);
    formData.append('receiving_customer', data.receiving_customer);
    formData.append('reviewer_id', data.reviewer_id);
    formData.append('project_number', data.project_number);;
    formData.append('report_type', data.report_type?.value);
    formData.append('certificate_type', data.certificate_type?.value);
    formData.append('report_name', data.report_name);
    formData.append('is_saved', 'true');
    formData.append("report",data.report[0])
    formData.append('hasReport', 'true');
    formData.append("certificate",data.certificate[0])
    formData.append('hasCertificate', 'true');
   
    if(standardString?.length>0){
      // console.log("If block", standardString.length)
      formData.append('reviewIds', standardString)
    }
    // else{
    //   console.log("else block reciew ids" , standardString?.length)
    // }
    // console.log("form data",formData)
   
    dispatch(LoaderStatus(true))
    
    axios({

      method: 'post',
      maxBodyLength: Infinity,
      url: `${BACKEND_URL}/report`,
      
      headers:myHeaders,
        data : formData,
        credentials: "include", 
        withCredentials:true,
     
    }).then(res=>{
      // console.log(res)
      dispatch(LoaderStatus(false))
      if(res?.data?.statusCode===200){
        reset()
        reset(defaultValues)
        setShowGreen(true)
        setAlertValue(res?.data?.message)
        setProjectCreatedData({"project_name":data.project_name, "project_number":data.project_number})
        let errorFixSP = {"project_name":data.project_name, "project_number":data.project_number}
        localStorage.setItem("SelectedProject", JSON.stringify(errorFixSP))
      dispatch(ProjectNumber(ProjectCreatedData))
        

      }
      else{
        
        setShowRed(true)
        setAlertValue(res?.data?.message)
      }
       
      })
      .catch(error=>{
      
        console.log("Error block new reports", error);
        if( error?.response?.status==401){
          dispatch(LoginDetails({}));
              cookies.remove('connect.sid');
              localStorage.setItem("AlertMessage", JSON.stringify("Session Expired...Please Login Again"))
            navigate('/')
        }
        else{
          setShowRed(true)
        setAlertValue(error?.response?.data?.message || error?.message)
        dispatch(LoaderStatus(false))
        }
      })
    
  });
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
          setShowRed(true)
        setAlertValue(error?.response?.data?.message)
        dispatch(LoaderStatus(false))
        }
      })
  },[])
  useEffect(()=>{
    // console.log("STandatd state-", standards)
    setSlicedStandards(standards?.slice(0,4))
  },[standards])
return(
  <>
  <div className='d-flex justify-content-center' style={{position:"sticky", top:"0", zIndex:"9"}}>
   {showGreen?<>
      <Alert className="col-12 col-md-8 col-lg-6 p-1 d-flex align-items-center justify-content-between" show={showGreen} variant="success" style={{zIndex:"9"}} >
        <p style={{marginBottom:"0"}}>{alertValue}</p>
        <Button style={{fontSize:"80%"}} onClick={() => 
          navigate('/view/assignedProjects')
          } variant="outline-success">
            Close
            </Button>
      </Alert>
    </>:<>
    <Alert className="col-12 col-md-8 col-lg-6 p-1 d-flex align-items-center justify-content-between mx-2" show={showRed} variant="danger" >
        <p style={{marginBottom:"0"}}>{alertValue}</p>
        <Button style={{fontSize:"80%"}} onClick={() => setShowRed(false)} variant="outline-danger">
            Close
            </Button>
      </Alert>
      </>
    
    }
    </div>
  <div className='custom-nrep-container'>

<div className="custom">
<div className='"leftSideNRep'>
<form className='custom_form' style={{
  display: "flex",
  justifyContent:"space-around"
}}
    >
  <div className='newLeftContainer'>


<div className="mb-3 customColor">
  <label htmlFor="reportNumber" className="form-label"> *Report Name</label>
  <input type="reportNumber" className="form-control custom_txtbox" id="reportname" {...register("report_name",{ required: true})}/>
  {errors.report_name && <span style={{color:"red"}}>This field is required</span>}
</div>
<div className="mb-3 customColor">
  <label htmlFor="dateIssued" className="form-label "> *Date Issued</label>
  <input type="date" className="form-control custom_txtbox custsession-date" id="dateIssued" placeholder="MM/YY/XXXX"  {...register("issued_at",{ required: false})} max={moment().format("YYYY-MM-DD")}/>
  {errors.issued_at && <span style={{color:"red"}}>This field is required</span>}
</div>
<div className="mb-3 customColor">
  <label htmlFor="tags" className="form-label">Tags</label>
  <input type="tags" className="form-control custom_txtbox" id="tags" placeholder="Select Report Tags"{...register("tags")}/>
  
</div>
<div className="mb-3 customColor">
  <label htmlFor="receivingContacts" className="form-label"> *Receiving Customer</label>
  <div className='parentSearchResult'>
  <input type="receivingContacts" className="form-control custom_txtbox" autoComplete='off' id="receiving_customer" placeholder="Choose a receiving contact" {...register("receiving_customer",{ required: true})} 
  
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
      if(response.data?.data.length>0){

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
  />
   {errors.receiving_customer && <span style={{color:"red"}}>This field is required</span>}
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
</div>
 
<div>
    <label className="custom_label d-flex">Report Standards <div className='reportStandardIcon'  data-bs-toggle="modal" data-bs-target="#exampleModal" >+</div></label>
   
    <br></br>
    <label className="custom_label1">*Click(+) to add some Standards</label>
</div>

<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
    <div className="modal-header custom_title">
        <h6 className="modal-title fs-5 custom_title" id="exampleModalLabel">Assign Standards to Review</h6>
      </div>

      <div className="modal-body">
      

      {/* ------Navbar */}
      <div className="container">
  <nav className="navbar navbar-expand-lg bg-light">
    <div className="container-fluid">
     
      <div className='d-flex'>
       <div className={activeStandard === 1 ? 'text-primary d-flex':"d-flex"} style={{fontSize:"0.8rem", cursor:"pointer"}} onClick={()=>{
        setSlicedStandards(standards?.slice(0,4))
        setActiveStandard(1)
       }}><span><InfoSvg /></span> Assigned</div>
      
       <div  className={activeStandard === 2 ? 'text-primary d-flex':"d-flex"} style={{fontSize:"0.8rem",padding:"0 1.13rem" , cursor:"pointer"}} onClick={()=>{
        setSlicedStandards(standards?.slice(4,8))
        setActiveStandard(2)
       }}><InfoSvg /> Add Lab Standards</div>
       <div  className={activeStandard === 3 ? 'text-primary d-flex':"d-flex"} style={{fontSize:"0.8rem",padding:"0 1.13rem" , cursor:"pointer"}} onClick={()=>{
        setActiveStandard(3)
        setSlicedStandards(standards?.slice(8,12))}
        }><InfoSvg /> Add GLobal Standards</div>
      </div>
     
      
    </div>
  </nav>
</div>
      <table>
          <tr>
            <th> </th>
            <th> Standard </th>
            <th> Description </th>
            </tr>
            <hr className="report_hr"></hr>
           
            {slicedStandards?.length>0 ? slicedStandards?.map((stand)=>{
              return(
               <tr className="report_td" key={stand?.id}>
                <td><input type="checkbox" id="standard1" name="standard1"  {...register(`${stand?.id}`)} ></input></td>
                <td> {stand?.standard}</td>
                <td> {stand?.description} </td>
              </tr>
              )
            }):""}
          
            <hr className="report_hr"></hr>
            
        
            {/* onClick={()=>alert("Standards added successfully!") */}
    </table>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary modal_btn" data-bs-dismiss="modal" onClick={()=>{}}>ADD STANDARDS TO REVIEW</button>
        {/* data-bs-dismiss={close?"modal":""}  */}
        <button type="button" className="btn btn-secondary modal_btn" data-bs-dismiss="modal">CANCEL</button>
      </div>
    </div>
  </div>
</div>

<div className="mb-3 customColor">
  <label htmlFor="availableReviewers" className="form-label">*Available Reviewers</label>
  <div className='parentSearchResult'>
  <input type="availableReviewers" className="form-control custom_txtbox" id="reviewer_id" {...register("reviewer_id",{ required: true})} autoComplete="off"
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
  />
   {errors.reviewer_id && <span style={{color:"red"}}>This field is required</span>}
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
<div className="mb-3 customColor">
  <textarea className="form-control custom_txtbox" id="exampleFormControlTextarea1" placeholder="Review Comments" rows="3" {...register("comments")}></textarea>
</div>
</div>

<div className='newRightContainer'>
<div className="mb-3 customColor">
  <label htmlFor="availableReviewers" className="form-label">*Project Number</label>
  <div className='parentSearchResult'>
  <input type="availableReviewers" className="form-control custom_txtbox" autoComplete='off' id="projectNumber" {...register("project_number",{ required: true})}
   onChange={debounce(async (e) => {
    let str = e.target.value
    // console.log("str check", str)
    let data={
      name: str
    }
    axios({
      method: 'get',
      maxBodyLength: Infinity,
      url: `${BACKEND_URL}/project`,
        params : data,
      
        credentials: "include", 
        withCredentials:true,
    })
    .then(function (response) {
      // console.log(response.data);
      if(response.data?.data.length>0){

        setSearchResults2(response.data?.data)
      }
      else{
        setSearchResults2([])
      }
     
    })
    .catch(function (error) {
      console.log("Error block", error);
     
    });
  }, 800)}
  />
   {errors.project_number && <span style={{color:"red"}}>This field is required</span>}
   <div className='searchResultsContainer'>
            {searchResults2?.length>0? 
              <div className='searchResults'>
            {searchResults2?.length>0? searchResults2.map((result,index)=>{
             
                
                return <div key={index} className='searchItem' onClick={()=>{
                  document.getElementById("projectNumber").value = result.project_number;
                  document.getElementById("projectNumber").focus();
                  setProjectCreatedData({"project_number":result?.project_number,"project_name":result?.project_name})
                  setSearchResults2([])
                }}>{result?.project_number}- {result?.project_name}</div>
                
              
            }):""
          }</div>:""}
          </div>
</div>
</div>
<div className="mb-3 customColor">
  <label htmlFor="productsCovered" className="form-label"> *Products Covered</label> 
  <textarea className="form-control custom_txtbox" id="productsCovered" rows="2"  {...register("products_covered",{ required: true})} ></textarea>
  {errors.products_covered && <span style={{color:"red"}}>This field is required</span>}
</div>
<div className="mb-3 customColor">
  <label htmlFor="models" className="form-label">Models</label>
  <textarea className="form-control custom_txtbox" id="models" rows="2" {...register("models", {required:true})} ></textarea>
  {errors.models && <span style={{color:"red"}}>This field is required</span>}
</div>


<div className="container">
    
    <label htmlFor="uploadReport" className="upload_label">
      <p className='mb-0'>Report</p>
      <div className='d-flex justify-content-center align-items-center'>
        <p className='m-0 mr-3'>Report Type</p>
      <Controller style={{width:"200px"}}
        name="report_type"
        defaultValue={""}
        {...register("report_type",{required: true})}
        control={control}
        render={({ field }) => (
        <Select  
            {...field}
            isClearable={true}
            isSearchable={false}
            className="react-dropdown"
            classNamePrefix="dropdown"
            options={options}
        />
        
        )}
    />
     {errors.report_type && (
            <span style={{ color: "red" }}> {errors.report?.message || "This field is required"}</span>
          )}
    </div>
    <p>{errors.status?.message || errors.status?.label.message}</p>
      <input className='choose_file'  type="file"  name='report' {...register("report",{required: true})} placeholder="Drag and Drop"/>
        <i className="fas fa-cloud-upload-alt"/>
        <p className="drag_text">Max File Size: 25MB: Max Files: 1/Type: .doc,.docx,.xls,.xlsx,.xlsm,.xlsb</p>
        {errors.report && (
            <span style={{ color: "red" }}> {errors.report?.message || "This field is required"}</span>
          )}
    </label>

</div>
<div className="container">
    
    <label htmlFor="uploadReport" className="upload_label">
    <p className='mb-0'>Certificate</p>
    <div className='d-flex justify-content-center align-items-center'>
        <p className='m-0 mr-3'>Certificate Type</p>
      <Controller  style={{width:"200px !important"}}
        name="certificate_type"
        defaultValue={""}
        {...register("certificate_type",{required: true})}
        control={control}
        render={({ field }) => (
        <Select 
            {...field}
            isClearable
            isSearchable={false}
            className="react-dropdown"
            classNamePrefix="dropdown"
            options={options}
        />
        )}
    />
    {errors.certificate_type && (
            <span style={{ color: "red" }}> {errors.report?.message || "This field is required"}</span>
          )}
    </div>
    <input  type="file" className='choose_file' name='certificate' {...register("certificate",{required: true},
    // {
    //   validate: {
    //     lessThan10MB: files => files[0]?.size < 10000000 || 'Max 10MB',
    //     acceptedFormats: certificate =>
    //       ['image/jpeg', 'image/png', 'image/gif'].includes(
    //         certificate[0]?.type
    //       ) || 'Only PNG, JPEG e GIF',
    //   },
    // }
    )} 
    
    />
    
        <i className="fas fa-cloud-upload-alt"/>
        <p className="drag_text">Max File Size: 25MB: Max Files: 1/Type: .doc,.docx,.xls,.xlsx,.xlsm,.xlsb</p>
        {errors.certificate && (
            <span style={{ color: "red" }}> {errors.certificate?.message || "This field is required"}</span>
          )}
    </label>
 
</div>
</div>

</form>
<div className='custom3btn' style={{marginRight:"6.7rem"}}>
<button className="btn btn-primary" id='sd' >SAVE AS DRAFTS</button>
<button className="btn btn-success btn_custom1 mx-2" id='sr' name='sr' type="submit" onClick={
        handleSubmit(onSubmit)}>SUBMIT REVIEW</button>
<button className="btn btn-primary btn_custom2" onClick={()=>{navigate('/view/assignedProjects')}}>CANCEL</button>
</div>
 </div>
 


</div>


</div>

 </>   )
}



