const API = process.env.REACT_APP_API;

export const getAllMobiVendDevices=async(serial)=> {
  
    try {
      const headers = new Headers({
        'x-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      });

      const response = await fetch(`${API}/mobivend/getAllMobiVendDevices`, { method: 'POST', headers,body:JSON.stringify({serial}) });
      const json = await response.json();
      // console.log(json)
      return json;
    } catch (error) {
      console.error('Error fetching data:', error);
  
      return [];
    }
  }

  export const getAllMobiVendQrCodes=async(merchant_id)=> {
    try {
      const headers = new Headers({
        'x-token': sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
      });

      const response = await fetch(`${API}/mobivend/getAllMobiVendQrCodes`, { method: 'POST', headers,body:JSON.stringify({merchant_id}) });
      const json = await response.json();
      return json;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }