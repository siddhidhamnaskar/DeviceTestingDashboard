// import $ from 'jquery';
import moment from "moment";
import Select from 'react-select';
import {useState, useEffect} from 'react';

import * as SwitchButtonModule from 'bootstrap-switch-button-react';
import Switch from 'react-switch';



import Card from '@mui/material/Card';
// import Stack from '@mui/material/Stack';
// import Table from '@mui/material/Table';
// import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';

// import TableContainer from '@mui/material/TableContainer';
// import TablePagination from '@mui/material/TablePagination';

// import { users } from 'src/_mock/user';
// import {GetClentNameDetails} from 'src/_mock/customers';

// import Scrollbar from 'src/components/scrollbar';

// import { emptyRows} from '../utils';

import {setTestMode} from './_mock/macAddress';
import {AllMacAddress} from './_mock/sendToMqtt';

// import Iconify from 'src/components/iconify';

// import TableNoData from '../table-no-data';
import UserTableRow from './user-table-row';
import Header from './components/Header';
import Navigation from './components/Navigation';
import DeviceConfigTable from './components/DeviceConfigTable';
import MobiVendTxnsTable from './components/MobiVendTxnsTable';
import MobivendVendingsTable from './components/MobivendVendingsTable';
import MobivendDeviceTable from './components/MobivendDeviceTable';
import MobivendQrCodesTable from './components/MobivendQrCodesTable';

// import UserTableHead from '../user-table-head';
// import TableEmptyRows from '../table-empty-rows';
// import UserTableToolbar from '../user-table-toolbar';
// import {  applyFilter, getComparator } from '../utils';
// ----------------------------------------------------------------------

export default function BoardTable() {

  const [activeTab, setActiveTab] = useState('mqtt');
  const [options1,setOptions1]=useState([]);
  const [options2,setOptions2]=useState([]);
  const [options3,setOptions3]=useState([]);

  const [selectedOption1, setSelectedOption1] = useState({id:-1});
  const [selectedOption2, setSelectedOption2] = useState({id:-1});
  const [selectedOption3, setSelectedOption3] = useState({id:-1});

  const [value1,setValue1]=useState({});
  const [value2,setValue2]=useState({});
  const [value3,setValue3]=useState({});

  const SwitchButton = SwitchButtonModule.SwitchButton;

  const [isChecked, setIsChecked] = useState(false);

  // const [page, setPage] = useState(0);

  // const [order] = useState('asc');

  const [selected, setSelected] = useState([]);

  // const [orderBy] = useState('name');

  // const [filterName, setFilterName] = useState('');

  // const [rowsPerPage, setRowsPerPage] = useState(10);

  const [data,setData]=useState([])

  // const online = a => moment().diff(moment.utc((a.lastHeartBeatTime)), 'minute') < 10;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const online = a => {
     
      if (!a?.lastHeartBeatTime) return false; // Ensure valid timestamp
      
     
      return moment().diff(moment.utc(a.lastHeartBeatTime), 'minute') < 10;
    };

  useEffect(()=>{
    console.log('SwitchButton:', SwitchButton); // This should log a function or class
    AllMacAddress().then((res)=>{
      console.log(res);
      const filteredData=res.filter((elem)=> online(elem) );
      
      setData(filteredData);

      const formattedData = filteredData.map((option,i) => ({
        value: option.MacID,
        label: option.MacID,
        id:i
      }));

    

      setOptions1(formattedData);
     
      setOptions2(formattedData);

      setOptions3(formattedData);
      // console.log(selectedOption1.id>=0);
      if(selectedOption1.id>=0)
        {
          // console.log(res[selectedOption1.id]);
          setValue1(filteredData[selectedOption1.id]);
         
        }
        if(selectedOption2.id>=0)
          {
            setValue2(filteredData[selectedOption2.id]);
          }

          if(selectedOption3.id>=0)
            {
              setValue3(filteredData[selectedOption3.id]);
            }
     
      
      
    })

   

    const Interval=setInterval(()=>{
      AllMacAddress().then((res)=>{
    
        const filteredData=res.filter((elem)=> online(elem) );
        setData(filteredData);
        const formattedData = filteredData.map((option,i) => ({
          value: option.MacID,
          label: `${option.MacID} ${option.SNoutput}`,
          id:i
        }));
  
      
  
        setOptions1(formattedData);
       
        setOptions2(formattedData);

        setOptions3(formattedData);
        // console.log(selectedOption1.id>=0);
        if(selectedOption1.id>=0)
          {
            // console.log(res[selectedOption1.id]);
            setValue1(filteredData[selectedOption1.id]);
           
          }
          if(selectedOption2.id>=0)
            {
              setValue2(filteredData[selectedOption2.id]);
            }
            if(selectedOption3.id>=0)
              {
                setValue3(filteredData[selectedOption3.id]);
              }
        
        
      })
  
       
    },500)



  

    return()=>{
      clearInterval(Interval);
    }
 

  },[selectedOption1,selectedOption2,selectedOption3])

  
  

  // const handleSort = (event, id) => {
  //   const isAsc = orderBy === id && order === 'asc';
  //   if (id !== '') {
  //     setOrder(isAsc ? 'desc' : 'asc');
  //     setOrderBy(id);
  //   }
  // };

  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = dataFiltered.map((n) => n.name);
  //     setSelected(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleSelectChange1 = (elem) => {
    setSelectedOption1(elem);
    
   
    AllMacAddress().then((res)=>{
    
      const filteredData=res.filter((m)=> online(m) )
      console.log(filteredData)
      setData(filteredData);
      console.log(data);
      // setValue1(res[elem.id]);
      
    })
  };
  const handleSelectChange2 = (elem) => {
    setSelectedOption2(elem);
    AllMacAddress().then((res)=>{
      const filteredData=res.filter((m)=> online(m) )
      console.log(filteredData)
      setData(filteredData);
      
    })
  };

  const handleSelectChange3 = (elem) => {
    setSelectedOption3(elem);
    AllMacAddress().then((res)=>{
      const filteredData=res.filter((m)=> online(m) )
      console.log(filteredData)
      setData(filteredData);
      
    })
  };
   
   const handleChange = () => {
    setTestMode();
   
  };
  
  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setPage(0);
  //   setRowsPerPage(parseInt(event.target.value, 10));
  // };

  // const handleFilterByName = (event) => {
  //   // setPage(0);
  //   setFilterName(event.target.value);
  // };

  // const dataFiltered = applyFilter({
  //   inputData: data,
  //   comparator: getComparator(order, orderBy),
  //   filterName,
  // });

  // const notFound = !dataFiltered.length && !!filterName;

  return (
    <>
    
        <Container maxWidth='xxl'>
          <Card spacing={2} sx={{padding:'10px', justifyContent:'center'}}>
            <div className="row" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
              <div className="col-md-10">
                <div className="form-group my-2">
                  <h6>Board:</h6>
                  <Select
                    name="board1"
                    value={selectedOption1}
                    onChange={handleSelectChange1}
                    options={options1}
                    isSearchable // Equivalent to isSearchable={true}
                    placeholder="Select option..."
                  />
                  {/* <input type="text" className="form-control" name="machine" /> */}
                  <div className="invalid-feedback"/>
                </div>
              </div>
            </div>
            {/* <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 'bold' }}>
              {isChecked ? 'TEST MODE ON' : 'TEST MODE OFF'}
            </span>
            <Switch
              onChange={handleChange}
              checked={isChecked}
              onColor="#28a745"
              offColor="#dc3545"
              uncheckedIcon={false}
              checkedIcon={false}
              height={20}
              width={48}
            />
          </div> */}

            {/* {selectedOption1.id>=0? <div className="row">
                                  
                                          <div className="col-12 sw-parent"> */}
                                            
                                              {/* <SwitchButton
                                            
                                              checked={isChecked}
                                              onChange={handleChange}
                                              onlabel="TEST MODE ON"
                                              offlabel="TEST MODE OFF"
                                              onstyle='success'
                                              offstyle='danger'
                                              width={200}
                                          /> */}
                                          {/* </div>
                                      </div>:''
            } */}
        
            <div className='row' style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
              <div className="col-md-10">
                <UserTableRow
                  key={value1.id}
                  testMode={isChecked}
                  board={1}
                  m={value1}
                  handleClick={(event) => handleClick(event, value1.UID)}
                />
              </div>
            </div>
      
            {/* <UserTableToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            /> */}

           
          </Card>
        </Container>
      
    </>
  );
}