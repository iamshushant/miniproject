import React from 'react';
import Box from '@mui/material/Box';
import {Typography} from '@mui/material';
import { user_log } from './Data/user_log';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setEmpName, selectEmp } from './Features/EmpDetails/EmpSlice';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


export default function Userlog(props) {

  const { data, data2 } = props;

  const [inpVal, setInpVal] = useState('');

  const emp = useSelector(selectEmp);
  const dispatch = useDispatch();

  // console.log(emp);

  // const [selectedOption, setSelectedOption] = useState('');

  const navigate = useNavigate();
  const redirectTo = (e) => {
    dispatch(setEmpName({ 
      emp: e.target.textContent
    }));
    navigate('/EmployeeDetails');
  }
  
  const selectedDetails = (emp_name) => {
    const emp = data ? data.find(d => d.name === emp_name) : '';
    return emp.condition;
  }

  return (
    <Box sx={{p: 2}}>
    <DrawerHeader />
      <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center'}}>
      <Typography variant='h4' sx={{fontFamily: 'Poppins', fontWeight: 600, my: 2}}>User Activity Log</Typography>
      <Box sx={{width: '100%', display:'flex'}}>
          <input type="text" placeholder="Search by Device ID..." value={inpVal} onChange={(e)=>{setInpVal(e.target.value)}} 
          className='inp-box inp-srch' />
          {inpVal &&
            <button className='btns cross' variant="contained" onClick={()=>{setInpVal('')}}><CloseIcon /></button>
          }
        </Box>
      </Box>

      <div className="outer-wrapper-2">
          <div className="table-wrapper-3">
          <table>
            <thead>
              <tr>
                <th align="right"><b>DATE</b></th>
                <th align="right"><b>Device ID</b></th>
                <th align="right"><b>User ID</b></th>
                <th align="right"><b>Location</b></th>
                <th align="right"><b>Condition</b></th>
                <th align="right"><b>Remarks</b></th>
              </tr>
            </thead>
            <tbody>
            {data2 ? data2.filter((row)=>{
              if (inpVal === '' && row.uid !== '') {
                return row;
              }
              else if (row.deviceId.toLowerCase().includes(inpVal.toLowerCase()) && row.uid !== '' ){
                return row;
              }
            }).map((row, i) => (
                              <tr key={i}>
                                  <td>{row.createdAt}</td>
                                  <td>{row.deviceId}</td>
                                  <td style={{color: '#1976d2', cursor: 'pointer'}} onClick={redirectTo}>{row.uid}</td>
                                  <td>{row.location.latitude} , {row.location.longitude}</td>
                                  <td>{selectedDetails(row.uid)}</td>
                                  <td>NA</td>
                              </tr>
                          )): ''}
            </tbody>
        </table>
          </div>
      </div>
    </Box>
  )
}
