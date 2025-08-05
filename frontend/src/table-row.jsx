import $ from 'jquery';
import moment from "moment";
import PropTypes from 'prop-types';
import React,{ useRef,useState,useEffect} from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import MuiAlert from '@mui/material/Alert';
// import Popover from '@mui/material/Popover';
import Snackbar from '@mui/material/Snackbar';
// import Avatar from '@mui/material/Avatar';

import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
// import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';

import { SaveFaultReport } from './_mock/faultReportData';
import {modeNone,modeTest1,modeTest2,modeTest3,setL,sendD,sendV,askCA,askCC,askQR,setSN,askSIP,sendVS,sendCA,sendCC,sendQR,sendTV,sendFW,sendTC,askUrl,checkSN,sendSIP,sendIMG,sendPWD,setPair,sendHBT,askSSID,sendSSID,sendFota,sendPWD1,sendPWD2,setErase,sendSSID1,sendSSID2,askStatus,checkPair,sendLight,sendReset,checkErase,sendMessage,sendFotaUrl,sendPassThru,checkPassThru} from './_mock/macAddress';
import { sendToMqtt, sendToMqttWithConfig } from './_mock/sendToMqtt';
import { getAllMobiVendDevices,getAllMobiVendQrCodes } from './_mock/mobivend';
import Label from './components/label';
// import { Y } from 'dist/assets/index-8d78d312';
import { getUserInfo } from './utils/localStorage';

const API=process.env.REACT_APP_API || 'http://localhost:3000';

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const style = {
  position: 'absolute' ,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid white',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
export default function BoardTableRow({
  m,
  testMode,
  board,
  sr,
  key,
  handleClick,
  
}) {
  // const [ setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message,setMessage]=useState("");
  const [type,setType]=useState("");
  const [url,setUrl]=useState("");
  const [data,setData]=useState("");
  const [mobivendData,setMobivendData]=useState("");
  const [mobivendQrCodes,setMobivendQrCodes]=useState("");
  const [allMobivendDevices,setAllMobivendDevices]=useState([]);
  const [selectedDeviceIndex,setSelectedDeviceIndex]=useState(0);

  const [unixTimeStamp,setUnixTimeStamp]=useState("");
  const [QRstring,setQRstring]=useState("");

  const [light,setLight]=useState("");
  const [position,setPosition]=useState("");

  const [pin,setPin]=useState("");
  const [pulse,setPulse]=useState("");
  const [HBTvalue,setHBTvalue]=useState("");

  const [IPaddress,setIPaddress]=useState("");
  const [port,setPort]=useState("");

  const [SSID,setSSID]=useState("");
  const [PWD,setPWD]=useState("");

  const [SSID1,setSSID1]=useState("");
  const [PWD1,setPWD1]=useState("");

  const [SSID2,setSSID2]=useState("");
  const [PWD2,setPWD2]=useState("");

  const [NumValue,setNumValue]=useState("");
  const [Polarity,setPolarity]=useState("");


  const [SerialNumber,setSerialNumber]=useState("");
  const [LNumber,setLNumber]=useState("");

  const [ERASE,setERASE]=useState("");

  const [PairNumber,setPairNumber]=useState("");
  const [PassThru,setPassThru]=useState("");
  const [count,setCount]=useState(0);

  const [IMG,setIMG]=useState(0);

  const intervalRef = useRef(null);
  const countRef = useRef(0); // Ref to persist count value
  const prevCountRef = useRef(0); // Ref to persist count value
  const currCountRef = useRef(0); // Ref to persist count value

  const [mode,setMode]=useState('');

  const [disable,setDisable]=useState(false);
 


  const showAlertMessage = () => {
    setShowAlert(true);

    // You can optionally set a timeout to hide the alert after a few seconds
    setTimeout(() => {
    setShowAlert(false);
    }, 5000); // Hide the alert after 5 seconds (5000 milliseconds)
};

const sendToMqttMessage=(message)=>{
  // Get device info from the current row data
  const deviceConfig = {
    UserName: sessionStorage.getItem("name") || "Unknown User",
    EmailId: sessionStorage.getItem("email") || "unknown@example.com",
    MacId: m.MacID || "",
    MachineId: m.SNoutput || ""
  };
  
  sendToMqtt(m.SNoutput, message, deviceConfig);
}

// Enhanced function with better error handling and response tracking
const sendToMqttMessageWithResponse = async (message) => {
  try {
    const userInfo = getUserInfo();
    const deviceConfig = {
      UserName: userInfo.name || "Unknown User",
      EmailId: userInfo.email || "unknown@example.com",
      MacId: m.MacID || "",
      MachineId: m.SNoutput || ""
    };
    
    const response = await sendToMqttWithConfig(m.SNoutput, message, deviceConfig);
    
    if (response.deviceConfigSaved) {
      console.log(`Device config saved for command: ${message}`);
    }
    
    return response;
  } catch (error) {
    console.error('Error sending MQTT message:', error);
    // You can add user notification here if needed
  }
};

prevCountRef.current=countRef.current;
currCountRef.current=countRef.current;
useEffect(()=>{

  if(m.HBToutput)
  {
    currCountRef.current=countRef.current;
    console.log(`HBT recived at count ${count}`);
  }
  console.log("count diff",currCountRef.current-prevCountRef.current);
  if(currCountRef.current-prevCountRef.current!==0)
  {
    console.log("Somthing wrong with device or Device i offline");
  }

  

},[m?.HBToutput,count])

// view mwnu open function
  // const handleOpenMenu = (event) => {
  //   setOpen(event.currentTarget);
  // };

  // view menu clsoe function
  // const handleCloseMenu = () => {
  //   setOpen(null);
  // };


  // Close popup function of technicaian form
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const [isChecked, setIsChecked] = useState(m.INHoutput===1);
  // const [isFota, setIsFota] = useState(true);
 

const handleChange = () => {
  const obj={
    MacId:m.MacID,
    outPutValue:!isChecked,
    socketNumber:m.SocketNumber,
    UserName:sessionStorage.getItem("name")

  }
  fetch(`${API}/kwikpay/saveINHoutput`,{
    method:'POST',
    headers:{
      'Content-type':'application/json'
    },
    body:JSON.stringify(obj)
  })
  setIsChecked(!isChecked);
};

// Handle device selection when multiple devices exist
const handleDeviceSelect = (index) => {
  if (allMobivendDevices[index]) {
    setSelectedDeviceIndex(index);
    const selectedDevice = allMobivendDevices[index];
    setMobivendData(selectedDevice);
    
    // Fetch QR codes for the selected device
    if (selectedDevice.merchantId) {
      getAllMobiVendQrCodes(selectedDevice.merchantId).then(res => {
        if (res) {
          console.log('QR codes for selected device:', res.data);
          setMobivendQrCodes(res.data);
        } else {
          setMobivendQrCodes("");
        }
      }).catch(err => {
        console.error('Error fetching QR codes for selected device:', err);
        setMobivendQrCodes("");
      });
    } else {
      setMobivendQrCodes("");
    }
  }
};

useEffect(()=>{
  if(m.SNoutput && m.SNoutput.length>0){
  getAllMobiVendDevices(m.SNoutput).then(res=>{
    if(res){
      console.log('All devices:', res.allDevices);
      console.log('Selected device:', res.data);
      
      // Store all devices
    //   setAllMobivendDevices(res.allDevices.reverse() || []);
      const sortedDevices = (res.allDevices || []).sort((a, b) => {
        // Sort by merchantId in ascending order
        if (a.merchantId && b.merchantId) {
          return a.merchantId.localeCompare(b.merchantId);
        }
        // Handle cases where merchantId might be null or undefined
        if (!a.merchantId && !b.merchantId) return 0;
        if (!a.merchantId) return 1;
        if (!b.merchantId) return -1;
        return a.merchantId.localeCompare(b.merchantId);
      });
      
      setAllMobivendDevices(sortedDevices);

      console.log('Sorted devices:', sortedDevices);
      
      // Set the first device as default
      setMobivendData(res.data);
      
      // Reset selection to first device
      setSelectedDeviceIndex(0);
    }
    else{
      setMobivendData("");
      setAllMobivendDevices([]);
      setSelectedDeviceIndex(0);
    }
  })
  }
},[m.SNoutput])

useEffect(()=>{
  if(mobivendData && mobivendData.merchantId){
    getAllMobiVendQrCodes(mobivendData.merchantId).then(res=>{
      if(res){
        console.log(res.data);
        setMobivendQrCodes(res.data);
      }
    })
  }
},[mobivendData])




  // submit form of technician form 
  const SubmitForm=()=>{
    const obj={
      macId:m.MacID,
      command: data,
      userName:sessionStorage.getItem("name")
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    setOpenModal(false);
    setData("");
    showAlertMessage();
  }

  const diff =a=> moment().diff(moment.utc(a?.lastHeartBeatTime), "minute");

  const online = a => {
   
    if (!a?.lastHeartBeatTime) return false; // Ensure valid timestamp
    // console.log(a.lastHeartBeatTime);
    //  console.log("Current time (local):", moment().format());
          // console.log("Current time (UTC):", moment.utc().format());
          // console.log("Last Heartbeat (UTC):", moment.utc(a.lastHeartBeatTime).format());
          // console.log("Difference in minutes:", diff(a));
          // console.log("Online status:", diff(a) < 10);
    return moment().diff(moment.utc(a.lastHeartBeatTime), 'minute') < 10;
  };
  


  return (
    <>
    {/* Alert popup ui */}
       <Stack spacing={2} sx={{ width: '100%'}}>
    
    <Snackbar  anchorOrigin={{ vertical:'bottom', horizontal:'right' }} open={showAlert} autoHideDuration={4000} onClose={()=>setShowAlert(false)}>
      <Alert onClose={()=>setShowAlert(false)} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>

     </Stack>
      <TableRow hover tabIndex={-1} role="checkbox" sx={{paddingBottom:"200px"}}>
        
     
        
        
     
        <TableCell >
      {/* <button
        type="button"
        className="btn btn-sm btn-outline-success btn-tt heading6"
        onClick={handleOpenMenu}
        
      >
        View
      </button> */}
    </TableCell>
  
      </TableRow >
        <div style={{border:"1px solid grey", overflow: "auto", height: "500px",paddingTop:"10px",paddingLeft:'2px'}}>
        <b style={{fontSize: '1.20em',cursor:'pointer'}} >  SN:{m.SNoutput} MacID:{m.MacID} {mobivendData && mobivendData.merchantId ? `QR Code:${mobivendData.merchantId}` : ""} {mobivendQrCodes && mobivendQrCodes.name ? `QR Name:${mobivendQrCodes.name}` : ""}</b>
        
        {/* Device Selection for Multiple Devices */}
        {allMobivendDevices.length > 1 && (
          <div style={{marginTop: '10px', marginBottom: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px'}}>
            <div style={{fontWeight: 'bold', marginBottom: '5px', color: '#d32f2f'}}>
              ⚠️ Multiple devices found with this serial number ({allMobivendDevices.length} devices)
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px'}}>
              {allMobivendDevices.map((device, index) => (
                <button
                  key={device.id}
                  onClick={() => handleDeviceSelect(index)}
                  style={{
                    padding: '5px 10px',
                    border: selectedDeviceIndex === index ? '2px solid #1976d2' : '1px solid #ccc',
                    backgroundColor: selectedDeviceIndex === index ? '#e3f2fd' : 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Device {index + 1}: {device.merchantId}
                </button>
              ))}
            </div>
            <div style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
              Currently viewing: Device {selectedDeviceIndex + 1} (Merchant ID: {mobivendData?.merchantId})
            </div>
          </div>
        )}
         <table className="table" style={{fontSize:'14px', width: '100%'}}>

                            <tbody > 
                          
                          <tr>
                            <th style={{width: '40%', verticalAlign: 'top', padding: '8px'}}>
                              <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                                <span style={{minWidth: '30px', fontWeight: 'bold'}}>Status</span>
                              </div>
                            </th>
                            <td style={{width: '60%', verticalAlign: 'top', padding: '8px'}}>
                              <Typography>
                                <p style={{margin: '0 0 5px 0', fontWeight: 'bold'}}>Status</p>
                                <Label color={online(m) ? 'success' : 'error'}>{online(m) ? 'Online' : 'Offline'}</Label>
                              </Typography>
                            </td>
                          </tr>
                          
                          <tr>
                            <th style={{width: '40%', verticalAlign: 'top', padding: '8px'}}>   
                              <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                                <button style={{backgroundColor:'#ffc107',color:'white',border:'none',padding:'5px 10px',borderRadius:'4px',margin:'2px',fontSize:'12px'}}  onClick={()=>sendToMqttMessageWithResponse("*FW?#")} >
                                  *Fw?#
                                </button>
                              </div>
                            </th>
                            <td style={{width: '60%', verticalAlign: 'top', padding: '8px'}}>
                              <Typography>
                                <p style={{margin: '0 0 5px 0', fontWeight: 'bold'}}>Message</p>
                                {m.FWoutput}
                              </Typography>
                            </td>
                          </tr>
                          
                          <tr> 
                            <th style={{width: '40%', verticalAlign: 'top', padding: '8px'}}>   
                              <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                                <button style={{backgroundColor:'#fd7e14',color:'white',border:'none',padding:'5px 10px',borderRadius:'4px',margin:'2px',fontSize:'12px'}}  onClick={()=>sendToMqttMessageWithResponse("*SSID?#")} >
                                  *SSID?#
                                </button>
                              </div>
                            </th>
                            <td style={{width: '60%', verticalAlign: 'top', padding: '8px'}}>
                              <Typography>
                                <p style={{margin: '0 0 5px 0', fontWeight: 'bold'}}>Message</p>
                                {m.SSIDmessage}
                              </Typography>
                            </td>
                          </tr>  
                             
                          <tr>
                            <th style={{width: '40%', verticalAlign: 'top', padding: '8px'}}>   
                              <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                                <span style={{minWidth: '30px', fontWeight: 'bold'}}>SS</span>
                                <input type='text' style={{width:'100px'}} placeholder='ssid' onChange={(e)=>setSSID(e.target.value)}/>
                                <button style={{backgroundColor:'#20c997',color:'white',border:'none',padding:'5px 10px',borderRadius:'4px',margin:'2px',fontSize:'12px'}}  onClick={()=>sendToMqttMessageWithResponse(`*SS:${SSID}#`)} >
                                  SEND
                                </button>
                              </div>
                            </th>
                            <td style={{width: '60%', verticalAlign: 'top', padding: '8px'}}>
                              <Typography>
                                <p style={{margin: '0 0 5px 0', fontWeight: 'bold'}}>Message</p>
                                {m.SSIDoutput}
                              </Typography>
                            </td>
                          </tr> 
                          
                          <tr>
                            <th style={{width: '40%', verticalAlign: 'top', padding: '8px'}}>   
                              <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                                <span style={{minWidth: '30px', fontWeight: 'bold'}}>SS1</span>
                                <input type='text' style={{width:'100px'}} placeholder='ssid1' onChange={(e)=>setSSID1(e.target.value)}/>
                                <button style={{backgroundColor:'#6f42c1',color:'white',border:'none',padding:'5px 10px',borderRadius:'4px',margin:'2px',fontSize:'12px'}}  onClick={()=>sendToMqttMessageWithResponse(`*SS1:${SSID1}#`)} >
                                  SEND
                                </button>
                              </div>
                            </th>
                            <td style={{width: '60%', verticalAlign: 'top', padding: '8px'}}>
                              <Typography>
                                <p style={{margin: '0 0 5px 0', fontWeight: 'bold'}}>Message</p>
                                {m.SSID1output}
                              </Typography>
                            </td>
                          </tr>   
                          
                          <tr>
                            <th style={{width: '40%', verticalAlign: 'top', padding: '8px'}}>   
                              <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                                <span style={{minWidth: '30px', fontWeight: 'bold'}}>SS2</span>
                                <input type='text' style={{width:'100px'}} placeholder='ssid2' onChange={(e)=>setSSID2(e.target.value)}/>
                                <button style={{backgroundColor:'#dc3545',color:'white',border:'none',padding:'5px 10px',borderRadius:'4px',margin:'2px',fontSize:'12px'}}  onClick={()=>sendToMqttMessageWithResponse(`*SS2:${SSID2}#`)} >
                                  SEND
                                </button>
                              </div>
                            </th>
                            <td style={{width: '60%', verticalAlign: 'top', padding: '8px'}}>
                              <Typography>
                                <p style={{margin: '0 0 5px 0', fontWeight: 'bold'}}>Message</p>
                                {m.SSID2output}
                              </Typography>
                            </td>
                          </tr>  
                               
                          <tr>
                            <th style={{width: '40%', verticalAlign: 'top', padding: '8px'}}>   
                              <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                                <span style={{minWidth: '30px', fontWeight: 'bold'}}>PW</span>
                                <input type='text' style={{width:'100px'}} placeholder='pwd' onChange={(e)=>setPWD(e.target.value)}/>
                                <button style={{backgroundColor:'#ffc107',color:'white',border:'none',padding:'5px 10px',borderRadius:'4px',margin:'2px',fontSize:'12px'}}  onClick={()=>sendToMqttMessageWithResponse(`*PW:${PWD}#`)} >
                                  SEND
                                </button>
                              </div>
                            </th>
                            <td style={{width: '60%', verticalAlign: 'top', padding: '8px'}}>
                              <Typography>
                                <p style={{margin: '0 0 5px 0', fontWeight: 'bold'}}>Message</p>
                                {m.PWDoutput}
                              </Typography>
                            </td>
                          </tr>
                               
                          <tr>
                            <th style={{width: '40%', verticalAlign: 'top', padding: '8px'}}>   
                              <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                                <span style={{minWidth: '30px', fontWeight: 'bold'}}>PW1</span>
                                <input type='text' style={{width:'100px'}} placeholder='pwd1' onChange={(e)=>setPWD1(e.target.value)}/>
                                <button style={{backgroundColor:'#28a745',color:'white',border:'none',padding:'5px 10px',borderRadius:'4px',margin:'2px',fontSize:'12px'}}  onClick={()=>sendToMqttMessageWithResponse(`*PW1:${PWD1}#`)} >
                                  SEND
                                </button>
                              </div>
                            </th>
                            <td style={{width: '60%', verticalAlign: 'top', padding: '8px'}}>
                              <Typography>
                                <p style={{margin: '0 0 5px 0', fontWeight: 'bold'}}>Message</p>
                                {m.PWD1output}
                              </Typography>
                            </td>
                          </tr> 
                              
                          <tr>
                            <th style={{width: '40%', verticalAlign: 'top', padding: '8px'}}>   
                              <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                                <span style={{minWidth: '30px', fontWeight: 'bold'}}>PW2</span>
                                <input type='text' style={{width:'100px'}} placeholder='pwd2' onChange={(e)=>setPWD2(e.target.value)}/>
                                <button style={{backgroundColor:'#17a2b8',color:'white',border:'none',padding:'5px 10px',borderRadius:'4px',margin:'2px',fontSize:'12px'}}  onClick={()=>sendToMqttMessageWithResponse(`*PW2:${PWD2}#`)} >
                                  SEND
                                </button>
                              </div>
                            </th>
                            <td style={{width: '60%', verticalAlign: 'top', padding: '8px'}}>
                              <Typography>
                                <p style={{margin: '0 0 5px 0', fontWeight: 'bold'}}>Message</p>
                                {m.PWD2output}
                              </Typography>
                            </td>
                          </tr>
                             
                          <tr>
                            <th style={{width: '40%', verticalAlign: 'top', padding: '8px'}}>
                              <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                                <span style={{minWidth: '40px', fontWeight: 'bold'}}>FOTA</span>
                                <input type='text' style={{width:'200px'}} placeholder='Url' onChange={(e)=>setUrl(e.target.value)}/>
                                <button style={{backgroundColor:'#fd7e14',color:'white',border:'none',padding:'5px 10px',borderRadius:'4px',margin:'2px',fontSize:'12px'}}  onClick={()=>sendToMqttMessageWithResponse(`*URL:${url}#`)} >
                                  SEND
                                </button>
                              </div>
                            </th>
                            <td style={{width: '60%', verticalAlign: 'top', padding: '8px'}}>
                              <Typography>
                                <p style={{margin: '0 0 5px 0', fontWeight: 'bold'}}>Message</p>
                                {m.FotaURLoutput}
                              </Typography>
                            </td>
                          </tr>  
                           
                          <tr>
                            <th style={{width: '40%', verticalAlign: 'top', padding: '8px'}}>   
                              <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                                <span style={{minWidth: '60px', fontWeight: 'bold'}}>NEW FOTA</span>
                                <button style={{backgroundColor:'#28a745',color:'white',border:'none',padding:'5px 10px',borderRadius:'4px',margin:'2px',fontSize:'12px'}}  onClick={()=>sendToMqttMessageWithResponse(`*FOTA:${sessionStorage.getItem("name")}:${Date.now()}#`)} >
                                  Fota
                                </button>
                              </div>
                            </th>
                            <td style={{width: '60%', verticalAlign: 'top', padding: '8px'}}>
                              <Typography>
                                <p style={{margin: '0 0 5px 0', fontWeight: 'bold'}}>Fota Message</p>
                                {m.FotaMessage}
                              </Typography>
                            </td>
                          </tr>  
                          
                          <tr>
                            <th style={{width: '40%', verticalAlign: 'top', padding: '8px'}}>   
                              <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                                <button style={{backgroundColor:'#dc3545',color:'white',border:'none',padding:'5px 10px',borderRadius:'4px',margin:'2px',fontSize:'12px'}}  onClick={()=>sendToMqttMessageWithResponse("*RST#")} >
                                  RESET
                                </button>
                              </div>
                            </th>
                            <td style={{width: '60%', verticalAlign: 'top', padding: '8px'}}>
                              <Typography>
                                <p style={{margin: '0 0 5px 0', fontWeight: 'bold'}}>Message</p>
                                {m.RstMessage}
                              </Typography>
                            </td>
                          </tr>
                          
                          <tr>
                            <th style={{width: '40%', verticalAlign: 'top', padding: '8px'}}>   
                              <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                                <button style={{backgroundColor:'#20c997',color:'white',border:'none',padding:'5px 10px',borderRadius:'4px',margin:'2px',fontSize:'12px'}}  onClick={()=>sendToMqttMessageWithResponse("*URL?#")} >
                                  *URL?#
                                </button>
                              </div>
                            </th>
                            <td style={{width: '60%', verticalAlign: 'top', padding: '8px'}}>
                              <Typography>
                                <p style={{margin: '0 0 5px 0', fontWeight: 'bold'}}>Message</p>
                                {m.URLoutput}
                              </Typography>
                            </td>
                          </tr>
                          <tr>
                            <th style={{width: '40%', verticalAlign: 'top', padding: '8px'}}>   
                              <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                                <button style={{backgroundColor:'#6f42c1',color:'white',border:'none',padding:'5px 10px',borderRadius:'4px',margin:'2px',fontSize:'12px'}}  onClick={()=>sendToMqttMessageWithResponse("*RSSI?#")} >
                                  *RSSI?#
                                </button>
                              </div>
                            </th>
                            <td style={{width: '60%', verticalAlign: 'top', padding: '8px'}}>
                              <Typography>
                                <p style={{margin: '0 0 5px 0', fontWeight: 'bold'}}>Message</p>
                                {m.V1}
                              </Typography>
                            </td>
                          </tr>
                          <tr>
                            <th style={{width: '40%', verticalAlign: 'top', padding: '8px'}}>   
                              <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                                <button style={{backgroundColor:'#dc3545',color:'white',border:'none',padding:'5px 10px',borderRadius:'4px',margin:'2px',fontSize:'12px'}}  onClick={()=>sendToMqttMessageWithResponse("*QR?#")} >
                                  *QR?#
                                </button>
                              </div>
                            </th>
                            <td style={{width: '60%', verticalAlign: 'top', padding: '8px'}}>
                              <Typography>
                                <p style={{margin: '0 0 5px 0', fontWeight: 'bold'}}>Message</p>
                                {m.V2}
                              </Typography>
                            </td>
                          </tr>
                          {mobivendQrCodes && mobivendQrCodes.QrString && (  
                          <tr>
                            <th style={{width: '40%', verticalAlign: 'top', padding: '8px'}}>   
                              <div style={{display:'flex',alignItems:'center',gap:'5px'}}>
                                <button style={{backgroundColor:'#ffc107',color:'white',border:'none',padding:'5px 10px',borderRadius:'4px',margin:'2px',fontSize:'12px'}}  onClick={()=>sendToMqttMessageWithResponse(`*QR:${selectedDeviceIndex}:${mobivendQrCodes.QrString}#`)} >
                                  SET QR
                                </button>
                              </div>
                            </th>
                            <td style={{width: '60%', verticalAlign: 'top', padding: '8px'}}>
                              <Typography>
                                <p style={{margin: '0 0 5px 0', fontWeight: 'bold'}}>Message</p>
                                {m.V3}
                              </Typography>
                            </td>
                          </tr>
                          )}                                                                                                            
                            </tbody>
                        </table>
       </div>
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        
           <Box sx={{ ...style, width: 500 }}>
           <div className="modal-dialog" role="document">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">FAUALT REPORT</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleModalClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group my-2">
                            <h6>Machine No.:</h6>
                            <input readOnly type="text" className="form-control" name="machine" />
                            <div className="invalid-feedback"/>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group my-2">
                            <h6>User Name:</h6>
                            <input readOnly type="text" className="form-control" name="userName" />
                            <div className="invalid-feedback"/>
                        </div>
                    </div>
                     <div className="col-md-12">
                        <div className="form-group my-2">
                            <h6>Fault Reported:</h6>
                            <input type="text" className="form-control" name="fault" />
                            <div className="invalid-feedback"/>
                        </div>
                    </div>
                     <div className="col-md-12">
                        <div className="form-group my-2">
                            <h6>Action Taken:</h6>
                            <input type="text" className="form-control" name="action" />
                            <div className="invalid-feedback"/>
                        </div>
                    </div>
                      <div className="col-md-6">
                        <div className="form-group my-2">
                            <h6>Status:</h6>
                            <select className="form-control" name="faultStatus">
                                <option value="Completed" selected>Completed</option>
                                <option value="Pending">Pending</option>
                              

                            </select>
                            <div className="invalid-feedback"/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={SubmitForm}>Save Report</button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleModalClose}>Close</button>
            </div>
        </div>
    </div>
            </Box>
            </Modal>
    </>
  );
}

UserTableRow.propTypes = {
 
  m:PropTypes.any,
  key: PropTypes.any,
  sr:PropTypes.any,
  testMode:PropTypes.any,
  board:PropTypes.any,
   handleClick: PropTypes.func

};