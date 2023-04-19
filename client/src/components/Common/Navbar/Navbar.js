import axios from "axios";
import React, { useEffect, useState } from "react";
// import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LoginDetails } from "../../Login/LoginReducer/LoginSlice";
import "./Navbar.css";
import { userLoginCheck } from "../../../helpers/userLoginCheck";
import Cookies from "universal-cookie";
import BACKEND_URL from '../../../backendUrl'
export const Navbar = () => {
  // const [login, setLogin] = useState(false)
  let dispatch = useDispatch();
  
  const [isLoggedInState,setIsLoggedInState] = useState(false)

  const navigate = useNavigate();

  const cookies = new Cookies()

  const Logout = () => {
    // console.log("Logout clicked");
     // console.log(data)
     var myHeaders = new Headers();
     myHeaders.append("Content-Type", "application/json");
     myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:8081')
     myHeaders.append('Access-Control-Allow-Credentials', true)
    axios({
      method: "post",
      maxBodyLength: Infinity,

      url: `${BACKEND_URL}/user/logout`,
      credentials: "include", 
      withCredentials:true,

      headers: myHeaders,
      
    })
      .then((res) => {
       
          dispatch(LoginDetails(res.data));
          cookies.remove('connect.sid');
          localStorage.clear()
          navigate("/");
        
      })
      .catch((err) => {
        console.log(err);
        dispatch(LoginDetails({}));
          cookies.remove('connect.sid');
          localStorage.clear()
        navigate('/')
      });
  };
  const ULogged = useSelector((state) => state.Login.value);
 
  useEffect(()=>{
   userLoginCheck().then(res=>{
    // console.log("res in navbar",res)
    if(res?.userId?.user?.is_engineer===true || res?.userId?.user?.is_reviewer===true){
      dispatch(LoginDetails(res.userId.user))
    }
    if(res.status === 401){
      cookies.remove('connect.sid')
      if(ULogged?.is_engineer || ULogged?.is_reviewer){
        dispatch(LoginDetails({}))
         localStorage.setItem("AlertMessage", JSON.stringify("Session Expired...Please Login Again"))
      }
          
      navigate('/')
    }
  }).catch(err=>{
    console.log("error in navbar",err.response)
    cookies.remove('connect.sid')
    dispatch(LoginDetails({}))
    navigate('/')
  })
  },[])
//  useEffect(()=>{console.log("Ulogged check", ULogged)},[ULogged])
  
  return (
    <>
      {ULogged?.is_engineer===true || ULogged?.is_reviewer===true ? 
        <>
          <div className="navbarHomePage">
            <div className="leftSideCh">
              <div className="hamburgerLogo mx-2">
                <svg
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.75 4.17188H20.25C20.625 4.17188 21 3.84375 21 3.42188V1.54688C21 1.17188 20.625 0.796875 20.25 0.796875H0.75C0.328125 0.796875 0 1.17188 0 1.54688V3.42188C0 3.84375 0.328125 4.17188 0.75 4.17188ZM0.75 11.6719H20.25C20.625 11.6719 21 11.3438 21 10.9219V9.04688C21 8.67188 20.625 8.29688 20.25 8.29688H0.75C0.328125 8.29688 0 8.67188 0 9.04688V10.9219C0 11.3438 0.328125 11.6719 0.75 11.6719ZM0.75 19.1719H20.25C20.625 19.1719 21 18.8438 21 18.4219V16.5469C21 16.1719 20.625 15.7969 20.25 15.7969H0.75C0.328125 15.7969 0 16.1719 0 16.5469V18.4219C0 18.8438 0.328125 19.1719 0.75 19.1719Z"
                    fill="#4F4F4F"
                  />
                </svg>
              </div>
              <div className="DCLogo mx-2">DC</div>
            </div>
            <div className="RightSideCh">
              <div className="FileLogo mx-2">
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      background: "white",
                      color: "black",
                      border: "0",
                      display: "flex",
                     alignItems: "center"
                    }}
                  >
                    <svg
                  width="22"
                  height="26"
                  viewBox="0 0 22 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.6209 0C12.954 0 13.2103 0.273 13.2103 0.598V4.784C13.2103 7.163 15.145 9.113 17.4898 9.126C18.4636 9.126 19.2324 9.139 19.8218 9.139C20.219 9.139 20.8725 9.126 21.4234 9.126C21.7437 9.126 22 9.386 22 9.711V20.163C22 23.387 19.4246 26 16.2341 26H6.04776C2.71637 26 0 23.257 0 19.877V5.863C0 2.639 2.58824 0 5.77868 0H12.6209ZM10.763 10.101C10.2376 10.101 9.80198 10.53 9.80198 11.063V13.312H7.59814C7.0728 13.312 6.63716 13.741 6.63716 14.287C6.63716 14.82 7.0728 15.249 7.59814 15.249H9.80198V17.498C9.80198 18.031 10.2376 18.46 10.763 18.46C11.2883 18.46 11.7111 18.031 11.7111 17.498V15.249H13.9278C14.4531 15.249 14.8888 14.82 14.8888 14.287C14.8888 13.741 14.4531 13.312 13.9278 13.312H11.7111V11.063C11.7111 10.53 11.2883 10.101 10.763 10.101ZM15.076 1.17806C15.076 0.61776 15.7461 0.33956 16.1292 0.74386C17.5143 2.20506 19.9347 4.75956 21.2877 6.18696C21.6619 6.58086 21.3877 7.23476 20.8482 7.23606C19.795 7.23996 18.5534 7.23606 17.6604 7.22696C16.2432 7.22696 15.076 6.04266 15.076 4.60486V1.17806Z"
                    fill="black"
                  />
                </svg>
                <svg
                  width="14"
                  height="8"
                  viewBox="0 0 14 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.8"
                    d="M2 2L7 7L12 2"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                  />
                </svg>
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton1"
                    style={{width:"auto",border:"0"}}
                  >
                    <li>
                      <Link className="dropdown-item" to="view/createProjectFolder">
                        Create a Project Folder
                      </Link>
                    </li>
                    <li>
                     <a  className="dropdown-item" >
                        Revise Report
                      </a>    
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Add me to a Project
                      </a>
                    </li>
                  </ul>
                </div>
                
              </div>
              <div className="leafLogo mx-2">
                <svg
                  width="18"
                  height="17"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.8242 1.35547C16.6484 1.00391 16.1797 0.974609 15.9746 1.32617C15.0664 2.9082 13.4551 3.875 11.6094 3.875H9.26562C6.16016 3.875 3.64062 6.39453 3.64062 9.5C3.64062 9.70508 3.64062 9.91016 3.66992 10.1152C5.54492 8.76758 8.24023 7.625 12.0781 7.625C12.3125 7.625 12.5469 7.85938 12.5469 8.09375C12.5469 8.35742 12.3125 8.5625 12.0781 8.5625C4.69531 8.5625 1.58984 13.1035 0.886719 14.7734C0.681641 15.2715 0.916016 15.7988 1.38477 16.0039C1.88281 16.209 2.41016 15.9746 2.61523 15.5059C2.67383 15.3887 3.23047 14.0996 4.72461 12.8398C5.69141 14.1289 7.47852 15.3594 9.85156 15.0957C14.4512 14.7734 17.7031 10.6426 17.7031 5.60352C17.7031 4.13867 17.3809 2.61523 16.8242 1.35547Z"
                    fill="#008000"
                  />
                </svg>
              </div>
              <div className="questionLogo mx-2">
                <svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.0781 8.25C16.0781 4 12.5781 0.5 8.32812 0.5C4.04688 0.5 0.578125 4 0.578125 8.25C0.578125 12.5312 4.04688 16 8.32812 16C12.5781 16 16.0781 12.5312 16.0781 8.25ZM8.51562 3.0625C10.2969 3.0625 12.1719 4.4375 12.1719 6.25C12.1719 8.6875 9.57812 8.71875 9.57812 9.59375V9.625C9.57812 9.84375 9.39062 10 9.20312 10H7.45312C7.23438 10 7.07812 9.84375 7.07812 9.625V9.5C7.07812 8.21875 8.04688 7.71875 8.76562 7.3125C9.39062 6.96875 9.79688 6.71875 9.79688 6.25C9.79688 5.625 8.98438 5.21875 8.35938 5.21875C7.51562 5.21875 7.14062 5.625 6.57812 6.34375C6.45312 6.5 6.20312 6.53125 6.04688 6.40625L4.95312 5.59375C4.79688 5.46875 4.76562 5.25 4.89062 5.0625C5.73438 3.78125 6.82812 3.0625 8.51562 3.0625ZM8.32812 10.8125C9.10938 10.8125 9.76562 11.4688 9.76562 12.25C9.76562 13.0625 9.10938 13.6875 8.32812 13.6875C7.51562 13.6875 6.89062 13.0625 6.89062 12.25C6.89062 11.4688 7.51562 10.8125 8.32812 10.8125Z"
                    fill="#4F4F4F"
                  />
                </svg>
              </div>
              <div className="EngReviewer mx-2">
                {ULogged?.is_engineer === true  ? (
                  <>
                    <div className="mx-1 pt-2">
                      <svg
                        width="31"
                        height="31"
                        viewBox="0 0 31 31"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="15.5" cy="15.5" r="15.5" fill="#729BBC" />
                        <text x="5" y="20" fill="black">
                          EN
                        </text>
                      </svg>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-secondary dropdown-toggle customEngDrop"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{
                          background: "white",
                          color: "black",
                          border: "0",
                        }}
                      >
                        Engineer View
                        <svg
                          className="mx-1"
                          width="14"
                          height="8"
                          viewBox="0 0 14 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 1L7 7L13 1"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton1"
                      >
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              Logout();
                            }}
                          >
                            Logout
                          </button>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Some other action
                          </a>
                        </li>
                    
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mx-1 pt-2">
                      <svg
                        width="31"
                        height="31"
                        viewBox="0 0 31 31"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="15.5" cy="15.5" r="15.5" fill="#729BBC" />
                        <text x="5" y="20" fill="black">
                          RN
                        </text>
                      </svg>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-secondary dropdown-toggle customEngDrop"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{
                          background: "white",
                          color: "black",
                          border: "0",
                        }}
                      >
                        Reviewer View
                        <svg
                          className="mx-1"
                          width="14"
                          height="8"
                          viewBox="0 0 14 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 1L7 7L13 1"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton1"
                      >
                        <li>
                        <button
                            className="dropdown-item"
                            onClick={() => {
                              Logout();
                            }}
                          >
                            Logout
                          </button>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Another action
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Something else here
                          </a>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
              <div className="notoficationIcon mx-2">
                <svg
                  width="15"
                  height="16"
                  viewBox="0 0 15 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.54688 15.0625C8.57227 15.0625 9.39258 14.2422 9.39258 13.1875H5.67188C5.67188 14.2422 6.49219 15.0625 7.54688 15.0625ZM13.8457 10.6973C13.2891 10.082 12.2051 9.17383 12.2051 6.15625C12.2051 3.90039 10.623 2.08398 8.45508 1.61523V1C8.45508 0.501953 8.04492 0.0625 7.54688 0.0625C7.01953 0.0625 6.60938 0.501953 6.60938 1V1.61523C4.44141 2.08398 2.85938 3.90039 2.85938 6.15625C2.85938 9.17383 1.77539 10.082 1.21875 10.6973C1.04297 10.873 0.955078 11.1074 0.984375 11.3125C0.984375 11.8105 1.33594 12.25 1.92188 12.25H13.1426C13.7285 12.25 14.0801 11.8105 14.1094 11.3125C14.1094 11.1074 14.0215 10.873 13.8457 10.6973Z"
                    fill="black"
                    fillOpacity="0.55"
                  />
                </svg>
              </div>
            </div>
          </div>
        </>
       : 
        <>
          <div className="navbar">
            <div id="itemCompliance">
              <a href="#" className="nav-item mt-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.69044 7.59851V17.8012C2.68992 17.8917 2.70725 17.9813 2.74145 18.0651C2.77565 18.1488 2.82604 18.225 2.88975 18.2893C2.95346 18.3536 3.02924 18.4047 3.11274 18.4397C3.19624 18.4747 3.28583 18.4929 3.37639 18.4933H7.49311V12.6096C7.49205 12.3358 7.59988 12.0727 7.79291 11.8783C7.98594 11.6838 8.24838 11.5738 8.52255 11.5725H11.9533C12.2275 11.5738 12.4899 11.6838 12.6829 11.8783C12.876 12.0727 12.9838 12.3358 12.9827 12.6096V18.4933H17.0995C17.19 18.4929 17.2796 18.4747 17.3631 18.4397C17.4466 18.4047 17.5224 18.3536 17.5861 18.2893C17.6498 18.225 17.7002 18.1488 17.7344 18.0651C17.7686 17.9813 17.7859 17.8917 17.7854 17.8012V7.59851"
                    stroke="white"
                    strokeWidth="1.49772"
                  />
                  <path
                    d="M19.4886 8.70641L10.687 1.47647C10.5552 1.38471 10.3984 1.33551 10.2377 1.33551C10.077 1.33551 9.92021 1.38471 9.78839 1.47647L0.986816 8.70641M16.1846 5.97698V1.90129H14.2027V4.3465"
                    stroke="white"
                    strokeWidth="1.49772"
                  />
                </svg>
              </a>
            </div>
          </div>
        </>
      }
    </>
  );
};

{
  /* <>
    <div><a href="#" className='nav-item'>Projects</a></div>
    <div><a href="#" className='nav-item'>Report Groups</a></div>
    <div><a href="#" className='nav-item'>Users</a></div>
    <div><a href="#" className='nav-item'>Help</a></div>
    <div><a href="#" className='nav-item'>My profile</a></div>
    <div className="navbarLogout"><button onClick={Logout} className='nav-item' >Logout</button></div>
    
    </>:""} */
}
