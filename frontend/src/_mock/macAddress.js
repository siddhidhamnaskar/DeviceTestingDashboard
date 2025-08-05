import moment from 'moment';

// import { store } from "../Redux/store";
// import { saveData } from "../Redux/action";

const API = process.env.REACT_APP_API || 'http://localhost:3000';

export const AllMacAddress=async()=> {
  
    try {
      const headers = new Headers({
        'x-token': sessionStorage.getItem('token'),
      });

      const response = await fetch(`${API}/kwikpay/getMacAddress`, { method: 'GET', headers });
      const json = await response.json();
      // console.log(json)
      return json.data;
    } catch (error) {
      console.error('Error fetching data:', error);
  
      return [];
    }
  }

  export const getData=async()=> {
  
    try {
      const headers = new Headers({
        'x-token': sessionStorage.getItem('token'),
      });
      const city=JSON.parse(sessionStorage.getItem("cities"));

      const response = await fetch(`${API}/kwikpay/getData?city=${city.join()}`, { method: 'GET', headers });
      const json = await response.json();

      // store.dispatch(saveData(json.data));
      // console.log(json)
      return json.data;
    } catch (error) {
      console.error('Error fetching data:', error);
  
      return [];
    }
  }

  export const getTestMode=async()=> {
  
    try {
      const headers = new Headers({
        'x-token': sessionStorage.getItem('token'),
      });
      const response = await fetch(`${API}/kwikpay/getTestMode`, { method: 'GET', headers });
      const json = await response.json();
      // console.log(json)
      return json.data;
    } catch (error) {
      console.error('Error fetching data:', error);
  
      return [];
    }
  }

  export const setTestMode=()=>{
  
    fetch(`${API}/kwikpay/setTestMode`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      }
    })
    
  
  }

  // Updated command functions to use MQTT instead of TCP sockets
  export const sendFota=(MacID,fota,name,type)=>{
    const obj={
      macId:MacID,
      command: `FOTA:${fota}:${type}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
   
 export const sendReset=(MacID,name)=>{
    const obj={
      macId:MacID,
      command: 'RESET',
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
     
  
  }
  
  export const sendV=(MacID,Pin,Pulse,name)=>{
    const obj={
      macId:MacID,
      command: `V:${Pin}:${Pulse}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
     
  
  }
  
  export const sendFW=(MacID,name)=>{
    const obj={
      macId:MacID,
      command: 'FW',
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
     
  
  }
  
 export const sendTC=(MacID,name)=>{
    const obj={
      macId:MacID,
      command: 'TC',
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
     
  
  }
  
  export const sendTV=(MacID,name)=>{
    const obj={
      macId:MacID,
      command: 'TV',
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
     
  
  }

  export const sendFotaUrl=(MacID,url,name)=>{
    const obj={
      macId:MacID,
      command: `FOTA_URL:${url}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
   
  export const askUrl=(MacID,name)=>{
    const obj={
      macId:MacID,
      command: 'ASK_URL',
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendCC=(MacID,name,UnixTS)=>{
    const obj={
      macId:MacID,
      command: `CC:${UnixTS}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const askCC=(MacID,name)=>{
    const obj={
      macId:MacID,
      command: 'ASK_CC',
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendQR=(MacID,name,QR)=>{
    const obj={
      macId:MacID,
      command: `QR:${QR}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const askQR=(MacID,name)=>{
    const obj={
      macId:MacID,
      command: 'ASK_QR',
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendIMG=(MacID,IMG,name)=>{
    const obj={
      macId:MacID,
      command: `IMG:${IMG}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const askStatus=(MacID,name)=>{
    const obj={
      macId:MacID,
      command: 'STATUS',
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const setSN=(MacID,name,SN)=>{
    const obj={
      macId:MacID,
      command: `SET_SN:${SN}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendMessage=(MacID,data)=>{
    const obj={
      macId:MacID,
      command: `MSG:${data}`,
      userName:sessionStorage.getItem("name")
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendPassThru=(MacID,name,SN)=>{
    const obj={
      macId:MacID,
      command: `PASS_THRU:${SN}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const checkPassThru=(MacID)=>{
    const obj={
      macId:MacID,
      command: 'CHECK_PASS_THRU',
      userName:sessionStorage.getItem("name")
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const setErase=(MacID,name,SN)=>{
    const obj={
      macId:MacID,
      command: `ERASE:${SN}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const setL=(MacID,name,SN)=>{
    const obj={
      macId:MacID,
      command: `SET_L:${SN}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const checkErase=(MacID)=>{
    const obj={
      macId:MacID,
      command: 'CHECK_ERASE',
      userName:sessionStorage.getItem("name")
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const checkSN=(MacID)=>{
    const obj={
      macId:MacID,
      command: 'CHECK_SN',
      userName:sessionStorage.getItem("name")
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const setPair=(MacID,name,SN)=>{
    const obj={
      macId:MacID,
      command: `PAIR:${SN}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const checkPair=(MacID)=>{
    const obj={
      macId:MacID,
      command: 'CHECK_PAIR',
      userName:sessionStorage.getItem("name")
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendLight=(MacID,light,position,name)=>{
    const obj={
      macId:MacID,
      command: `LIGHT:${light}:${position}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendHBT=(MacID,value,name)=>{
    const obj={
      macId:MacID,
      command: `HBT:${value}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendSIP=(MacID,ip,pin,name)=>{
    const obj={
      macId:MacID,
      command: `SIP:${ip}:${pin}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendSSID=(MacID,SSID,name)=>{
    const obj={
      macId:MacID,
      command: `SSID:${SSID}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const askSSID=(MacID,name)=>{
    const obj={
      macId:MacID,
      command: 'ASK_SSID',
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendPWD=(MacID,PWD,name)=>{
    const obj={
      macId:MacID,
      command: `PWD:${PWD}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendSSID1=(MacID,SSID1,name)=>{
    const obj={
      macId:MacID,
      command: `SSID1:${SSID1}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendPWD1=(MacID,PWD1,name)=>{
    const obj={
      macId:MacID,
      command: `PWD1:${PWD1}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
   export const sendSSID2=(MacID,SSID2,name)=>{
    const obj={
      macId:MacID,
      command: `SSID2:${SSID2}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
   export const sendPWD2=(MacID,PWD2,name)=>{
    const obj={
      macId:MacID,
      command: `PWD2:${PWD2}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendCA=(MacID,numValue,polarity,name)=>{
    const obj={
      macId:MacID,
      command: `CA:${numValue}:${polarity}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const askCA=(MacID,name)=>{
    const obj={
      macId:MacID,
      command: 'ASK_CA',
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const askSIP=(MacID,name)=>{
    const obj={
      macId:MacID,
      command: 'ASK_SIP',
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const modeTest1=(MacID,name)=>{
    const obj={
      macId:MacID,
      command: 'MODE_TEST1',
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const modeTest2=(MacID,name)=>{
    const obj={
      macId:MacID,
      command: 'MODE_TEST2',
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const modeTest3=(MacID,name)=>{
    const obj={
      macId:MacID,
      command: 'MODE_TEST3',
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const modeNone=(MacID,name)=>{
    const obj={
      macId:MacID,
      command: 'MODE_NONE',
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const getAllOutputs=async()=> {
  
    try {
      const headers = new Headers({
        'x-token': sessionStorage.getItem('token'),
      });

      const response = await fetch(`${API}/kwikpay/getAllOutputs`, { method: 'GET', headers });
      const json = await response.json();
      // console.log(json)
      return json.data;
    } catch (error) {
      console.error('Error fetching data:', error);
  
      return [];
    }
  }
  
  export const sendG1=async(MacID,SN,name)=>{
    const obj={
      macId:MacID,
      command: `G1:${SN}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendG2=async(MacID,SN,name)=>{
    const obj={
      macId:MacID,
      command: `G2:${SN}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendG3=async(MacID,SN,name)=>{
    const obj={
      macId:MacID,
      command: `G3:${SN}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendI=async(MacID,SN,name)=>{
    const obj={
      macId:MacID,
      command: `I:${SN}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendGF=async(MacID,SN,name)=>{
    const obj={
      macId:MacID,
      command: `GF:${SN}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendQ=async(MacID,SN,name)=>{
    const obj={
      macId:MacID,
      command: `Q:${SN}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendQ1=async(MacID,SN,name)=>{
    const obj={
      macId:MacID,
      command: `Q1:${SN}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendD=(MacID,unixTS,name)=>{
    const obj={
      macId:MacID,
      command: `D:${unixTS}`,
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }
  
  export const sendVS=(MacID,name)=>{
    const obj={
      macId:MacID,
      command: 'VS',
      userName:name
    }
    fetch(`${API}/kwikpay/sendCommand`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    
  
  }