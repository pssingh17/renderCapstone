import React from "react";
import { useNavigate } from "react-router-dom";
import dailyComplianceLogo from "../../../images/dailyComplianceLogo.png";
import "./Header.css";

export const Header = () => {
  const navigate = useNavigate()
  return (
    <>
      <div className="header">
        <div className="dcLogoHead flex-fill" >
        <img
          style={{ width: "169px", height: "79px" ,cursor:"pointer"}}
          src={dailyComplianceLogo}
          onClick={()=>navigate('/view/landingPage')}
        />
        </div>
        <div>
          <svg  className="circleSv"
            width="410"
            height="90"
            viewBox="0 0 410 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_98_13246)">
              <path
                d="M249.502 185.986C338.14 185.986 409.996 114.131 409.996 25.4932C409.996 -63.1447 338.14 -135 249.502 -135C160.864 -135 89.0092 -63.1447 89.0092 25.4932C89.0092 114.131 160.864 185.986 249.502 185.986Z"
                stroke="#474E54"
                strokeWidth="0.999958"
              />
              <path
                d="M249.502 185.487C337.864 185.487 409.496 113.855 409.496 25.4933C409.496 -62.8686 337.864 -134.5 249.502 -134.5C161.141 -134.5 89.5092 -62.8686 89.5092 25.4933C89.5092 113.855 161.141 185.487 249.502 185.487Z"
                stroke="#474E54"
                strokeWidth="0.999958"
              />
              <path
                d="M102.509 243.984C159.115 243.984 205.004 198.095 205.004 141.488C205.004 84.8815 159.115 38.9926 102.509 38.9926C45.9018 38.9926 0.0129395 84.8815 0.0129395 141.488C0.0129395 198.095 45.9018 243.984 102.509 243.984Z"
                fill="#21B6D7"
              />
              <path
                d="M416.335 -302.095L-6.45081 120.694"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -296.839L-6.45081 125.947"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -291.584L-6.45081 131.205"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -286.33L-6.45081 136.46"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -281.074L-6.45081 141.712"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -275.819L-6.45081 146.97"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -270.563L-6.45081 152.226"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -265.309L-6.45081 157.478"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -260.054L-6.45081 162.735"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -254.798L-6.45081 167.991"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -249.543L-6.45081 173.243"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -244.287L-6.45081 178.502"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -239.033L-6.45081 183.757"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -233.777L-6.45081 189.012"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -228.522L-6.45081 194.267"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -223.266L-6.45081 199.523"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -218.012L-6.45081 204.778"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -212.757L-6.45081 210.032"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -207.501L-6.45081 215.288"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -202.246L-6.45081 220.543"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -196.99L-6.45081 225.796"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -191.736L-6.45081 231.054"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -186.481L-6.45081 236.308"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -181.225L-6.45081 241.564"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -175.97L-6.45081 246.819"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -170.715L-6.45081 252.075"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -165.46L-6.45081 257.329"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -160.205L-6.45081 262.584"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -154.949L-6.45081 267.84"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -149.694L-6.45081 273.092"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -144.439L-6.45081 278.351"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -139.184L-6.45081 283.605"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -133.928L-6.45081 288.858"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -128.673L-6.45081 294.116"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -123.419L-6.45081 299.371"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -118.163L-6.45081 304.626"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -112.908L-6.45081 309.881"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -107.652L-6.45081 315.134"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -102.397L-6.45081 320.392"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -97.1416L-6.45081 325.648"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -91.8868L-6.45081 330.902"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -86.6321L-6.45081 336.157"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -81.3763L-6.45081 341.413"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -76.1215L-6.45081 346.668"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -70.8667L-6.45081 351.922"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -65.611L-6.45081 357.178"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -60.3562L-6.45081 362.433"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -55.1004L-6.45081 367.686"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -49.8456L-6.45081 372.944"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -44.5898L-6.45081 378.199"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -39.3351L-6.45081 383.454"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -34.0793L-6.45081 388.707"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -28.8245L-6.45081 393.965"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -23.5697L-6.45081 399.219"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -18.3139L-6.45081 404.475"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -13.0592L-6.45081 409.727"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -7.80341L-6.45081 414.983"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 -2.54861L-6.45081 420.238"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 2.70615L-6.45081 425.495"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 7.96194L-6.45081 430.751"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 13.2167L-6.45081 436.006"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 18.4725L-6.45081 441.262"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 23.7273L-6.45081 446.516"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 28.9821L-6.45081 451.771"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 34.2378L-6.45081 457.027"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 39.4926L-6.45081 462.282"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 44.7484L-6.45081 467.538"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 50.0032L-6.45081 472.792"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 55.2589L-6.45081 478.048"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 60.5137L-6.45081 483.303"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 65.7685L-6.45081 488.558"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 71.0243L-6.45081 493.813"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 76.2791L-6.45081 499.068"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 81.5348L-6.45081 504.324"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
              <path
                d="M416.335 86.7896L-6.45081 509.579"
                stroke="white"
                strokeWidth="0.999958"
                strokeMiterlimit="10"
              />
            </g>
            <defs>
              <clipPath id="clip0_98_13246">
                <rect
                  width="409.992"
                  height="378.984"
                  fill="white"
                  transform="translate(0.0078125 -135)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
    </>
  );
};
