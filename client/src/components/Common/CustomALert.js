import React from 'react'
import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';


export const CustomAlert = (props) => {
  const navigate = useNavigate()
  const [showGreen, setShowGreen] = useState(false);
  const [showRed, setShowRed] = useState(props?.showRed)
  const [alertValue, setAlertValue] = useState(props?.alertValue)

  return (
    <>
     {props.showGreen?<>
      <Alert className="col-12 col-md-8 col-lg-6 p-1 d-flex align-items-center justify-content-between" show={props.showGreen} variant="success" >
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
        <Button style={{fontSize:"80%"}} onClick={() => {
          setShowRed(false)
          navigate('/')
          }} variant="outline-danger" >
            Close
            </Button>
      </Alert>
      
      </>
    
    }
    </>
  )
}
