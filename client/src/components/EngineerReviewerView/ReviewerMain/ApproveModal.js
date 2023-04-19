import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useForm, SubmitHandler } from "react-hook-form";
import BACKEND_URL from '../../../backendUrl';
import axios from 'axios';
import { LoaderStatus } from '../../Common/LoaderReducer/LoaderSlice';
import { Reports } from '../EngineerMain/EngineerReducers/ReportDetails';


export const ApproveModal = (props) => {
  const ReportsDetailsRedux = useSelector((state) => state.ReportDetails.value);
  const { register, handleSubmit,getValues , trigger, formState: { errors }} = useForm();
  const dispatch = useDispatch()

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "http://localhost:8081");
  myHeaders.append("Access-Control-Allow-Credentials", true);

  const onSubmit= ((data) => {
    // console.log("approve check", data)
    axios({
      method: 'post',
      maxBodyLength: Infinity,
        url: `${BACKEND_URL}/report/decision`,
        headers:myHeaders,
        data : {
          ...data,
          status_id:"7",
          report_id: ReportsDetailsRedux?.report?.report_number
        },
        credentials: "include", 
        withCredentials:true,
    })
    .then(function (response) {
      // console.log(response.data);
      if(response?.data?.statusCode === 200){
        props.hideModalApprove(false)
        axios({
          method: "get",
          maxBodyLength: Infinity,
          url: `${BACKEND_URL}/report/${ReportsDetailsRedux?.report?.report_number}`,
        
          credentials: "include",
          withCredentials: true,
          headers: myHeaders,
        })
          .then((res) => {
            dispatch(LoaderStatus(false))
            //  console.log("response ", res.data.data)
            if (res?.data?.data) {
             
              dispatch(Reports(res?.data?.data));
              
            }
          })
          .catch((err) => {
            console.log("error view report box  ", err);
          });
      }
     
    })
    .catch(function (error) {
      console.log(error);
      
    });
    
  });
  return (
    <div id="myCustomModal" className="customModal">
    <div className="custom-modal-content">
      <div className="custom-modal-header bg-success">
        <h4 className="text-start p-2">Approve Review</h4>
      </div>
      <div className="custom-modal-body">
        <div
          className="align-items-center mt-2"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid grey",
          }}
        >
          <div className="ml-2 w-100">
            <div className="w-100">
              <div className="w-100">
                <label>Prepared By</label>
              </div>
            </div>
          </div>
          <div className="ml-2 w-100">
            <div className="w-100"></div>
            <input
              type="text"
              style={{ width: "95%", border: "0", background: "white" }}
              placeholder={ReportsDetailsRedux?.report?.['created_by_fk.name']}
              disabled
            ></input>
          </div>
        </div>
        <div
          className="align-items-center mt-2"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid grey",
          }}
        >
          <div className="ml-2 w-100">
            <div className="w-100">
              <div className="w-100">
                <label>Reference No.</label>
              </div>
            </div>
          </div>
          <div className="ml-2 w-100">
            <div className="w-100"></div>
            <input
              type="text"
              style={{ width: "95%", border: "0", background: "white" }}
              placeholder={ReportsDetailsRedux?.report?.['project_number_fk.purchase_order_number']}
              disabled
            ></input>
          </div>
        </div>
        <div
          className="align-items-center mt-2"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid grey",
          }}
        >
          <div className="ml-2 w-100">
            <div className="w-100">
              <div className="w-100">
                <label>Deliverable Type</label>
              </div>
            </div>
          </div>
          <div className="ml-2 w-100">
            <div className="w-100"></div>
            <input
              type="text"
              style={{ width: "95%", border: "0", background: "white" }}
              placeholder={ReportsDetailsRedux?.report?.['project_number_fk.project_type']}
              disabled
            ></input>
          </div>
        </div>
        <div
          className="align-items-center mt-2"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid grey",
          }}
        >
          <div className="ml-2 w-100">
            <div className="w-100">
              <div className="w-100">
                <label>Deliverable Name</label>
              </div>
            </div>
          </div>
          <div className="ml-2 w-100">
            <div className="w-100"></div>
            <input
              type="text"
              style={{ width: "95%", border: "0", background: "white" }}
              placeholder={ReportsDetailsRedux?.report?.['project_number_fk.description']}
              disabled
            ></input>
          </div>
        </div>
        <div
          className="align-items-center mt-2"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid grey",
          }}
        >
          <div className="ml-2 w-100">
            <div className="w-100">
              <div className="w-100">
                <label>Total Iterations</label>
              </div>
            </div>
          </div>
          <div className="ml-2 w-100">
            <div className="w-100"></div>
            <input
              type="text"
              style={{ width: "95%", border: "0", background: "white" }}
              placeholder={ReportsDetailsRedux?.project?.project_number}
              disabled
            ></input>
          </div>
        </div>
        <div
          className="d-flex flex-column mt-2"
          style={{
            border: "1px solid rgb(0, 123, 255 ",
            borderRadius: "6.7px",
          }}
        >
          <input
            type="text"
            {...register("recommendations")}
            placeholder="*Recommendations"
            className="m-2"
            style={{
              border: "1px solid rgb(0, 123, 255",
              borderRadius: "6.7px",
            }}
          ></input>
          <textarea
            className="m-2"
            {...register("comment")}
            placeholder="*Comments"
            style={{
              border: "1px solid rgb(0, 123, 255",
              borderRadius: "6.7px",
            }}
          ></textarea>
        </div>
      </div>
      <div className="custom-modal-footer d-flex justify-content-end ">
        <button className="btn btn-success m-2" onClick={
          handleSubmit(onSubmit)
        }>
          Approve Review
        </button>
        <button
          className="btn m-2 btn-dark"
          onClick={() => {
            props.hideModalApprove(false)
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
  )
}
