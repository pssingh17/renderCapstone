import React from 'react'
import SiteLogo2 from '../../../images/siteLogo2.png'
import './Footer.css'

export const Footer = () => {
  return (
    <div className='footerContainer text-white py-3 ' style={{backgroundColor:"#080707"}}>
        <img src ={SiteLogo2} style={{marginLeft:"7rem"}}/>
        <p style={{display:"inline-block" ,color:"#C1C1C1"}} >DC Group plc - Copyright © 2008-2010 - All Rights Reserved</p>
    </div>
  )
}
