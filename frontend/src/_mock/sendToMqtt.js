const API=process.env.REACT_APP_API || 'http://localhost:3000';


export const AllMacAddress=async()=> {
  
    try {
      const headers = new Headers({
        'x-token': sessionStorage.getItem('token'),
      });

      const response = await fetch(`${API}/mqtt/getAllMacAddress`, { method: 'GET', headers });
      const json = await response.json();
      // console.log(json)
      return json.data;
    } catch (error) {
      console.error('Error fetching data:', error);
  
      return [];
    }
  }

export const sendToMqtt=(serialNumber, message, additionalParams = {})=>{
    // Get user info from sessionStorage
    const userName = sessionStorage.getItem("name") || "Unknown User";
    const userEmail = sessionStorage.getItem("email") || "unknown@example.com";
    
    const obj={
     serialNumber,
     message,
     UserName: additionalParams.UserName || userName,
     EmailId: additionalParams.EmailId || userEmail,
     MacId: additionalParams.MacId || "",
     MachineId: additionalParams.MachineId || serialNumber
    }
    
    console.log('Sending MQTT message:', obj);
    
    fetch(`${API}/mqtt/sendToMqtt`,{
      method:'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(data => {
      console.log('MQTT response:', data);
      if (data.deviceConfigSaved) {
        console.log('Device config saved successfully');
      }
    })
    .catch(error => {
      console.error('Error sending MQTT message:', error);
    });
     
  
}

// Enhanced function with all parameters
export const sendToMqttWithConfig = (serialNumber, message, deviceConfig = {}) => {
  const userName = sessionStorage.getItem("name") || "Unknown User";
  const userEmail = sessionStorage.getItem("email") || "unknown@example.com";
  
  const obj = {
    serialNumber,
    message,
    UserName: deviceConfig.UserName || userName,
    EmailId: deviceConfig.EmailId || userEmail,
    MacId: deviceConfig.MacId || "",
    MachineId: deviceConfig.MachineId || serialNumber
  };
  
  console.log('Sending MQTT message with config:', obj);
  
  return fetch(`${API}/mqtt/sendToMqtt`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
  .then(response => response.json())
  .then(data => {
    console.log('MQTT response:', data);
    return data;
  })
  .catch(error => {
    console.error('Error sending MQTT message:', error);
    throw error;
  });
};