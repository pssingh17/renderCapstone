import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import { NavLink, useFetcher, useNavigate } from "react-router-dom";
import { LoginDetails } from "../../Login/LoginReducer/LoginSlice";
import "./ViewReportScreen.css";
import Cookies from "universal-cookie";
import { DeliverablesDetails } from "../EngineerMain/EngineerReducers/Deliverables";
import BACKEND_URL from "../../../backendUrl";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { LoaderStatus } from "../../Common/LoaderReducer/LoaderSlice";
import { ProjectNumber } from "../EngineerMain/EngineerReducers/ProjectNumber";
import { height } from "@mui/system";
import { ReviewerApproveSvg } from "../../Icons/ReviewerApproveSvg";
import { ReviewerHoldSvgg } from "../../Icons/ReviewerHoldSvgg";
import { ReviewerRejectSvg } from "../../Icons/ReviewerRejectSvg";
import { ReviewerCancelSvg } from "../../Icons/ReviewerCancelSvg";
import { UpdateDocSvg } from "../../Icons/UpdateDocSvg";
import { DeleteDocSvg } from "../../Icons/DeleteDocSvg";
import { DownloadSvg } from "../../Icons/DownloadSvg";
import { ApproveModal } from "../ReviewerMain/ApproveModal";
import { HoldModal } from "../ReviewerMain/HoldModal";
import { RejectModal } from "../ReviewerMain/RejectModal";
import { EditReportChildContent } from "./EditReportChildContent";
import { Reports } from "../EngineerMain/EngineerReducers/ReportDetails";

const EditReportScreen = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError
  } = useForm();

  const [showModalApprove, setShowModalApprove] = useState(false);
  const [showModalReject, setShowModalReject] = useState(false);
  const [showModalHold, setShowModalHold] = useState(false);
  const [showModalUpdateDoc, setShowModalUpdateDoc] = useState(false);
  const [showModalAdditionalDoc, setShowModalAdditionalDoc] = useState(false);
  const [showModalDeleteDoc, setShowModalDeleteDoc] = useState(false);
  const [reportDataForModal, setReportDataForModal] = useState()
      const [showGreen, setShowGreen] = useState(false);
  const [alertValue, setAlertValue] = useState();

  const ReportsDetailsRedux = useSelector((state) => state.ReportDetails.value);
  const ULogged = useSelector((state) => state.Login.value);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "http://localhost:8081");
  myHeaders.append("Access-Control-Allow-Credentials", true);
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    let sub_type = reportDataForModal?.sub_type;
    // console.log("Data", data, "Sub_type", reportDataForModal)
    let f = data?.file[0]?.name
    let fileSize = data?.file[0]?.size
    // console.log(fileSize,"fileSize")
    if(fileSize>250000000){
      setError("file", {
        type: "filetype",
        message: "Size less than 25Mb is allowed"
    });
    return
    }
    const getFExtansion =  f.includes('.') && f.substr(f.lastIndexOf('.') + 1).split(' ')[0]
    // console.log("extension check", getFExtansion)
    if((getFExtansion!=="xlsx") && (getFExtansion!=="xls")  && (getFExtansion!=="xlsm")  && (getFExtansion!=="xlsb")  && (getFExtansion!=="doc")  && (getFExtansion!=="docx")){

    setError("file", {
        type: "filetype",
        message: "Only Doc, Docx, Xls, Xlsx,Xlsm,Xlsb documents are valid."
    });
    return;

    }
    dispatch(LoaderStatus(true));

    let formData = new FormData();
    formData.append("file", data.file[0]);
   
    // console.log("file", formData)
    if(sub_type){
       formData.append("doc_id", reportDataForModal?.file_id);
    formData.append("sub_type", sub_type);
       axios({
      method: "put",
      maxBodyLength: Infinity,
      url: `${BACKEND_URL}/report/upload`,
      headers: myHeaders,
      credentials: "include",
      withCredentials: true,
      data: formData,
    })
      .then(function (response) {
        //  console.log("Response From update doc",response.data)
        if (response?.data?.statusCode === 200) {
          setShowModalUpdateDoc(false);
          dispatch(LoaderStatus(true));
          getReportById(ReportsDetailsRedux?.report?.report_number);
        }
        //  getFinancialsData()
      })
      .catch(function (error) {
        console.log("Error block update report", error);
        if (error?.response?.status === 401) {
          dispatch(LoginDetails({}));
          cookies.remove("connect.sid");
          localStorage.setItem(
            "AlertMessage",
            JSON.stringify("Session Expired...Please Login Again")
          );
          navigate("/");
        }
      });
    }
    else{
      formData.append("reportId",ReportsDetailsRedux?.report?.report_number )
       axios({
      method: "post",
      maxBodyLength: Infinity,
      url: `${BACKEND_URL}/report/additional/doc`,
      headers: myHeaders,
      credentials: "include",
      withCredentials: true,
      data: formData,
    })
      .then(function (response) {
        //  console.log("Response From update doc",response.data)
        if (response?.data?.statusCode === 200) {
          setShowModalAdditionalDoc(false);
          dispatch(LoaderStatus(true));
          getReportById(ReportsDetailsRedux?.report?.report_number);
        }
        //  getFinancialsData()
      })
      .catch(function (error) {
        console.log("Error block update report", error);
        if (error?.response?.status === 401) {
          dispatch(LoginDetails({}));
          cookies.remove("connect.sid");
          localStorage.setItem(
            "AlertMessage",
            JSON.stringify("Session Expired...Please Login Again")
          );
          navigate("/");
        }
      });
    }
   
  };
  function hideModalApprove(bool){
    setShowModalApprove(bool)
  }
  function hideHoldModal(bool){
    setShowModalHold(bool);
  }
  function hideRejectModal(bool){
    setShowModalReject(false);
  }
  useEffect(()=>{
    let report_number = JSON.parse(localStorage.getItem("ReportNumber"))
    if(report_number != undefined){
      dispatch(LoaderStatus(true))
     
      getReportById(report_number)
    }
  },[])
  const getReportById = (report_number)=>{
    // console.log("Runuung", report_number)
    axios({
      method: "get",
      maxBodyLength: Infinity,
      url: `${BACKEND_URL}/report/${report_number}`,
      headers: myHeaders,
      credentials: "include",
      withCredentials: true,
    })
      .then((res) => {
        // console.log("Res", res)
        if (res.data?.statusCode === 200) {
          dispatch(LoaderStatus(false));
          dispatch(Reports(res?.data?.data))
          // dispatch(ProjectNumber(res.data?.data));
         
        }
      })
      .catch(function (error) {
        console.log("Error block update report", error);
        if (error?.response?.status === 401) {
          dispatch(LoginDetails({}));
          cookies.remove("connect.sid");
          localStorage.setItem(
            "AlertMessage",
            JSON.stringify("Session Expired...Please Login Again")
          );
          navigate("/");
        }
      });
  }
  
  return (
    <>
      {showGreen ? (
        <div
          className="d-flex justify-content-center"
          style={{ position: "sticky", top: "0", zIndex: "9" }}
        >
          <Alert
            className="col-12 col-md-8 col-lg-6 p-1 d-flex align-items-center justify-content-between"
            show={showGreen}
            variant="success"
          >
            <p style={{ marginBottom: "0" }}>{alertValue}</p>
            <Button
              style={{ fontSize: "80%" }}
              onClick={() => setShowGreen(false)}
              variant="outline-success"
            >
              Close
            </Button>
          </Alert>
        </div>
      ) : (
        ""
      )}
      {showModalApprove === true ? (
        <>
          <ApproveModal hideModalApprove = {hideModalApprove}/>
        </>
      ) : (
        ""
      )}
      {showModalHold === true ? (
        <>
         <HoldModal hideHoldModal = {hideHoldModal}/>
        </>
      ) : (
        ""
      )}
      {showModalReject === true ? (
        <>
          <RejectModal hideRejectModal={hideRejectModal}/>
        </>
      ) : (
        ""
      )}
      {showModalUpdateDoc === true ? (
        <>
          <div id="myCustomModal" className="customModal">
            <div className="custom-modal-content">
              <div className="custom-modal-header customDC-color pt-2">
                <h4 className="text-center ">Update Document</h4>
              </div>
              <div className="custom-modal-body">
                <input
                  className=""
                  type="file"
                  {...register("file", { required: true })}
                  placeholder="Upload"
                />
                  {errors.file && (
            <div style={{ color: "red" }}> {errors.file?.message}</div>
          )}
              </div>
              <div className="custom-modal-footer d-flex justify-content-end ">
                <button
                  className="btn customDC-color m-2"
                  onClick={handleSubmit(onSubmit)}
                >
                  Update
                </button>
                <button
                  className="btn customDC-color m-2"
                  onClick={() => {
                    setShowModalUpdateDoc(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
        {showModalAdditionalDoc === true ? (
        <>
          <div id="myCustomModal" className="customModal">
            <div className="custom-modal-content">
              <div className="custom-modal-header customDC-color pt-2">
                <h4 className="text-center ">Add New Document</h4>
              </div>
              <div className="custom-modal-body">
                <input
                  className=""
                  type="file"
                  {...register("file", { required: true })}
                  placeholder="Upload"
                />
                 {errors.file && (
            <div style={{ color: "red" }}> {errors.file?.message}</div>
          )}
              </div>
              <div className="custom-modal-footer d-flex justify-content-end ">
                <button
                  className="btn customDC-color m-2"
                  onClick={handleSubmit(onSubmit)}
                >
                  Add Document
                </button>
                <button
                  className="btn customDC-color m-2"
                  onClick={() => {
                    setShowModalAdditionalDoc(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      {showModalDeleteDoc === true ? (
        <>
          <div id="myCustomModal" className="customModal">
            <div className="custom-modal-content">
              <div className="custom-modal-header customDC-color pt-2">
                <h4 className="text-center ">
                  Are you sure you want to delete the document?
                </h4>
              </div>
              <div className="custom-modal-body">
                {reportDataForModal?.original_file_name}
              </div>

              <div className="custom-modal-footer d-flex justify-content-end ">
                <button
                  className="btn customDC-color m-2"
                  onClick={() => {
                    dispatch(LoaderStatus(true))
                    axios({
                      method: "put",
                      maxBodyLength: Infinity,
                      url: `${BACKEND_URL}/report/delete`,
                      headers: myHeaders,
                      credentials: "include",
                      withCredentials: true,
                      data: {
                        doc_id: reportDataForModal?.file_id,
                        report_id: ReportsDetailsRedux?.report?.report_number,
                      },
                    })
                      .then(function (response) {
                          dispatch(LoaderStatus(false))
                        if (response?.data?.statusCode === 200) {
                          // alert("Success")
                          setShowModalDeleteDoc(false);
                          getReportById(ReportsDetailsRedux?.report?.report_number)
                        
                        }
                        
                      })
                      .catch(function (error) {
                        console.log("Error block delete teport", error);
                        if (error?.response?.status === 401) {
                          dispatch(LoginDetails({}));
                          cookies.remove("connect.sid");
                          localStorage.setItem(
                            "AlertMessage",
                            JSON.stringify(
                              "Session Expired...Please Login Again"
                            )
                          );
                          navigate("/");
                        }
                      });
                  }}
                >
                  Confirm
                </button>
                <button
                  className="btn customDC-color m-2"
                  onClick={() => {
                    setShowModalDeleteDoc(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      
      <div>
        <div className="ReviewReports py-2">
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

        {ULogged?.is_reviewer === true ? (
          <>
            <div className="colorbox">
              <p>
               <span onClick={()=>{
                // console.log("clicked")
                setShowModalApprove(true)}}>
               <ReviewerApproveSvg />
              </span>
                <span  onClick={()=>setShowModalHold(true)}>
                  <ReviewerHoldSvgg />
                </span>

                <span onClick={()=>setShowModalReject(true)}>
                  <ReviewerRejectSvg />
                </span>
               <span  onClick={()=>navigate('/view/reviewMainPage')}>
                <ReviewerCancelSvg />
               </span>
              </p>
            </div>
          </>
        ) : (
          ""
        )}

        {ReportsDetailsRedux?.report ? (
          <>
           <EditReportChildContent getReportById={getReportById}/>
            <div className="DocumentsParents">
              <h4>
                <b>DOCUMENTS</b>
              </h4>
              {ULogged?.is_engineer === true ? (
                <>
                  <button type="button" className="btn btn-dark" onClick={()=>{
                        setShowModalAdditionalDoc(true)
                        setShowModalAdditionalDoc(true)
                  }}>
                    ADD REVIEW DOCUMENTS
                  </button>
                </>
              ) : (
                ""
              )}
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
                            <td>{ReportsDetailsRedux?.report?.['project_number_fk.modals']}</td>
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
                    {ULogged?.is_reviewer=== true? <>
                    <span  onClick={()=>setShowModalApprove(true)}>
                      <ReviewerApproveSvg/>
                      </span>
                     <span onClick={()=>setShowModalReject(true)}>
                        <ReviewerRejectSvg />
                     </span>
                    </>:""}
                
                      <span onClick={() =>{ 
                        setReportDataForModal({"original_file_name": report?.original_file_name, "file_id": report?.file_id,"file_id": report?.file_id, "sub_type":report?.sub_type})
                        setShowModalUpdateDoc(true)}}>
                      <UpdateDocSvg />
                      </span>

                     <span onClick={() => {
                      setReportDataForModal({"original_file_name": report?.original_file_name, "file_id": report?.file_id, "sub_type":report?.sub_type})
                      setShowModalDeleteDoc(true);}}>
                      <DeleteDocSvg />
                     </span>

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
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default EditReportScreen;
