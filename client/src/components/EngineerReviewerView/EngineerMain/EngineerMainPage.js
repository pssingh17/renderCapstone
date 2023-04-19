import React, { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import FolderClosedIcon from '../../../images/folderClosed.gif.png'
import FolderOpenIcon from '../../../images/folderOpen.gif.png'
import PlusIcon from '../../../images/plus3.gif.png'
import MinusIcon from '../../../images/minus5.gif.png'
import { LoginDetails } from "../../Login/LoginReducer/LoginSlice";
import { useDispatch, useSelector } from 'react-redux'
import { userLoginCheck } from '../../../helpers/userLoginCheck'
import { useEffect } from 'react'
import { AllProjectsDetails } from './EngineerReducers/AllProjects'
import {ProjectNumber} from './EngineerReducers/ProjectNumber'
import axios from 'axios'
import Cookies from 'universal-cookie'
import BACKEND_URL from '../../../backendUrl'



export const AssignedProjectMain = () => {
  const cookies = new Cookies()

    const [projectsOpen, setProjectsOpen] = useState(true)
    const [projectListsOpen, setProjectListsOpen] = useState(true)
    const [recentProjectsOpen, setRecentProjectsOpen] = useState(true)
    const [assignedProjectsOpen, setAssignedProjectsOpen] = useState(false)
    const [active, setActive] = useState(false)
    const [SelectedProjectState, setSelectedProjectState] = useState()
  const DeliverableMain = useSelector((state) => state.Deliverables.value);

  const AllProjects = useSelector((state) => state.AllProjectsDetails.value);

  
    let activeStyle = {
      textDecoration: "underline",
    };
    let activeClassName = "underline";
    let passiveClassame = "text-dark"
    let navigate = useNavigate()
    let dispatch = useDispatch()
    useEffect(()=>{

       let SelectedProject
       if (localStorage.getItem("SelectedProject")) {
        SelectedProject = JSON.parse(localStorage.getItem("SelectedProject"));
        // Do something with the SelectedProject object
      }
      if(SelectedProject !== undefined){
        setSelectedProjectState(SelectedProject)
      }

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:8081')
      myHeaders.append('Access-Control-Allow-Credentials', true)
      userLoginCheck().then(res=>{
      //  console.log(res)
       if(res?.userId?.user?.is_engineer===true || res?.userId?.user?.is_reviewer===true){
         dispatch(LoginDetails(res.userId.user))
       }
       if(res.isLoggedIn === false){
         alert(res?.message)
         navigate('/')
       }
     }).catch(err=>{console.log(err)})

     axios({
      method: 'get',
      maxBodyLength: Infinity,
      url: `${BACKEND_URL}/project/all`,
      headers:myHeaders,
      credentials: "include", 
      withCredentials:true,
      
      
    })
    .then(function (response) {
      // console.log("Response all projects api",response.data);
      if(response?.data?.data?.length>0){
        dispatch(AllProjectsDetails(response?.data?.data))
       
      }
     
      
    
    })
    .catch(function (error) {
      console.log("Error block all projects api", error);
      if(error?.response?.status===401){
        dispatch(LoginDetails({}));
            cookies.remove('connect.sid');
            localStorage.setItem("AlertMessage", JSON.stringify("Session Expired...Please Login Again"))
          navigate('/')
      }
     
     
    });

     },[])
    //  useEffect(()=>{console.log("active statys", active, "SelectedProjectState", SelectedProjectState)},[active,SelectedProjectState])

  return (
    <>
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
       
       <div className="textHome mx-2 text-white">Assigned Projects</div>
       </NavLink>

    
   </div>
   <div className='assProjectContainer'>
    <div className='leftNavAssigned'>
        <div className='sideNavContainer' style={{height:"100%", overflowY:"scroll"}}>
          <div className='mainProjectsParent' style={{cursor:"pointer"}} onClick={()=>{setProjectsOpen(!projectsOpen)}}>
            {projectsOpen?<>
            <img src = {MinusIcon} />
            <img src={FolderOpenIcon}></img>
            </>:<>
            <img src={PlusIcon} />
            <img src={FolderClosedIcon} />
            </>}
           
            <div className='Projects'><b>Projects</b></div>
            </div>
            {projectsOpen ? <>
            <div className='projectListsParent' onClick={()=>{setProjectListsOpen(!projectListsOpen)}}>
            {projectListsOpen?<>
            <img src = {MinusIcon} />
            <img src={FolderOpenIcon}></img>
            </>:<>
            <img src={PlusIcon} />
            <img src={FolderClosedIcon} />
            </>}
             <div> Project Lists
              </div>
             </div>
             {projectListsOpen ? <>
              <div className='recentProjectsParent'  onClick={()=>{setRecentProjectsOpen(!recentProjectsOpen)}}>
              {recentProjectsOpen?<>
            <img style={{alignSelf:"start"}} src = {MinusIcon} />
            <img style={{alignSelf:"start"}} src={FolderOpenIcon}></img>
            </>:<>
            <img style={{alignSelf:"start"}} src={PlusIcon} />
            <img style={{alignSelf:"start"}} src={FolderClosedIcon} />
            </>}
         
                  <div>Recent Projects
               
                </div>
                </div>
                {recentProjectsOpen? <div className='recentprojectsinnermost'>
                  {AllProjects?.length>0 ? 
                  AllProjects.map((data,index)=>{
                    return( 
                   
                      <div key={index} 
                      onClick={() => { 
                        setSelectedProjectState(data)
                       localStorage.setItem("SelectedProject", JSON.stringify(data)) 
                       dispatch(ProjectNumber(data))
                      }
                    }
                      className= {SelectedProjectState?.project_number === data.project_number ? "projectListItems activeProjectItem":"projectListItems"}
                    >{data?.project_number}</div>
                    
                    
                    
                  )
                  })
                  :""}
                
                </div>:""}
              <div className='assignedProjectsParent'  onClick={()=>{setAssignedProjectsOpen(!assignedProjectsOpen)}}>
              {assignedProjectsOpen?<>
            <img src = {MinusIcon} />
            <img src={FolderOpenIcon}></img>
            </>:<>
            <img src={PlusIcon} />
            <img src={FolderClosedIcon} />
            </>}
                <div>Assigned Projects</div>
                
                </div>
             </>:""}
            


            </>:""}
            {assignedProjectsOpen? <div className='assignedprojectsinnermost'>
                  <div>Project 1</div>
                  <div>Project 2</div>
                  <div>Project 3</div>
                </div>:""}

            </div>
           
           
        
    </div>
    <div className='rightAssigned'>
        <div className='navbarAssignedRight'>
            <NavLink to="details"  className={({ isActive }) =>
              isActive ? activeClassName : passiveClassame
            }>Details</NavLink>
            <NavLink to="financials"  className={({ isActive }) =>
              isActive ? activeClassName : passiveClassame
            }>Financials</NavLink>
            <NavLink to="deliverables"  className={({ isActive }) =>
              isActive ? activeClassName : passiveClassame
            }>Deliverables</NavLink>
            <NavLink to="supportingDocuments"  className={({ isActive }) =>
              isActive ? activeClassName : passiveClassame
            }>Supporting Documents</NavLink>
            <NavLink to="correspondence"  className={({ isActive }) =>
              isActive ? activeClassName : passiveClassame
            }>Correspondence</NavLink>
            <NavLink to="equipmentLog"  className={({ isActive }) =>
              isActive ? activeClassName : passiveClassame
            }>Equipment Log</NavLink>
            <NavLink to="sample"  className={({ isActive }) =>
              isActive ? activeClassName : passiveClassame
            }>Sample</NavLink>
           
        </div>
       
            
    <Outlet />
    </div>
   </div>
    </>
  )
}
