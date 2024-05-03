import React, {useEffect, useState} from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';

export default function UniversalLog(props) {

    const { Empid, data } = props;

    const [info, setInfo] = useState(false);
    const [inpVal, setInpVal] = useState('');

    const [empId, setEmpId] = useState('');
    
    const sendEmpId = (id) => {
        setEmpId(id);
        Empid(id);
        setInfo(false);
    }

    const low = {
        backgroundColor: '#e8eaed',
        border: '1px solid black',
        padding: '3px'
    }
    const normal = {
        backgroundColor: '#fff',
        border: '1px solid black',
        padding: '3px'
    }
    const danger = {
        backgroundColor: '#f77e7e',
        border: '1px solid black',
        padding: '3px'
    }
    const warning = {
        backgroundColor: 'yellow',
        border: '1px solid black',
        padding: '3px'
    }
    const success = {
        backgroundColor: 'lightgreen',
        border: '1px solid black',
        padding: '3px'
    }

    const selColor = (name) => {
        if(name === 'Medical Alarm')
            return danger
        if(name === 'Environment Alarm')
            return danger
        if(name === 'Device Warning')
            return warning
        if(name === 'Medical Warning')
            return warning
        else
            return normal
        
    }

    const checks = (name) => {
        let alarms = [];
    
        const each = data ? data.find(det => det.uid === name) : '';
    
        if (each) {
            if (each.heartRate < 60 || each.heartRate > 100) {
                if (each.heartRate < 60) {
                    alarms.push(['Medical Warning', 'Heart Rate: Low']);
                } else if (each.heartRate > 100) {
                    alarms.push(['Medical Alarm', 'Heart Rate: Elevated']);
                }
            }
    
            if (each.spo2 < 95) {
                alarms.push(['Medical Alarm', 'SpO2: Low']);
            }
    
            if (each.respiratoryRate < 12 || each.respiratoryRate > 18) {
                if (each.respiratoryRate < 12) {
                    alarms.push(['Medical Alarm', 'Respiratory Rate: Low']);
                } else if (each.respiratoryRate > 18) {
                    alarms.push(['Medical Alarm', 'Respiratory Rate: Elevated']);
                }
            }
    
            if (each.bodyTemperature < 35.6 || each.bodyTemperature > 36.7) {
                if (each.bodyTemperature < 35.6) {
                    alarms.push(['Medical Alarm', 'Body Temperature: Low']);
                } else if (each.bodyTemperature > 36.7) {
                    alarms.push(['Medical Alarm', 'Body Temperature: Elevated']);
                }
            }
    
            if (each.environment) {
                if (each.environment.aqi >= 151 && each.environment.aqi <= 200) {
                    alarms.push(['Medical Warning', 'Air Quality Index: Unhealthy']);
                } else if (each.environment.aqi >= 300) {
                    alarms.push(['Medical Warning', 'Air Quality Index: Hazardous']);
                }
    
                if (each.environment.voc >= 1 && each.environment.voc <= 3) {
                    alarms.push(['Environment Alarm', 'VOC: High']);
                }
    
                if (each.environment.dew < 55) {
                    alarms.push(['Environment Alarm', 'Dew: Low']);
                }
            }
        }
    
        return alarms;
    }

    return (
        <>

            { info &&
            <div style={{position: 'absolute', right: '1%', bottom: '10%', width: '30%', zIndex: 5, backgroundColor: 'white', border: '1px solid black', minHeight: '300px', maxHeight: '300px', overflowY: 'scroll', overflowX: 'hidden', margin: '0px'}}>
            {/* <button className='btns cross' style={{margin: '10px'}} onClick={()=>{setInfo(false)}}>
                <CloseIcon />
            </button> */}
            <Box sx={{width: '95%', display:'flex', m: 2}}>
                <input type="text" placeholder="Search by Device ID..." value={inpVal} onChange={(e)=>{setInpVal(e.target.value)}} 
                className='inp-box inp-srch' />
                {inpVal &&
                    <button className='btns cross' variant="contained" onClick={()=>{setInpVal('')}}><CloseIcon /></button>
                }
            </Box>
                <div
                // style={{maxHeight: '400px', overflowY: 'scroll', margin: '0px'}}
                >
                    <table>
                        <thead>
                            <tr>
                                <th style={{ position: 'relative' }}>Device ID</th>
                                <th style={{ position: 'relative' }}>Message Type</th>
                                <th style={{ position: 'relative' }}>Message Desc</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data ? data.filter((s)=>{
                                if(inpVal === '' && s.uid !== ''){
                                    return s;
                                }
                                else if(s.deviceId.toLowerCase().includes(inpVal.toLowerCase()) && s.uid !== ''){
                                    return s;
                                }}).map((d) => {
                                    const alarms = checks(d.uid);
                                    if (alarms.length > 0)  {
                                        return alarms.map((alarm, index) => (
                                            <tr key={index}>
                                                {index === 0 ? (
                                                    <td style={{color: '#1976d2', cursor: 'pointer'}} onClick={() => {sendEmpId(d.deviceId)}}>{d.deviceId}</td>
                                                ) : (
                                                    <td></td>
                                                )}
                                                <td><strong style={selColor(alarm[0])}>{alarm[0]}</strong></td>
                                                <td>{alarm[1]}</td>
                                            </tr>
                                        ));
                                    }
                                })
                                : (
                                    <tr>
                                        <td><span>--</span></td>
                                        <td>--</td>
                                        <td>--</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            }

            <div>
                <NotificationsIcon onClick={()=>{setInfo(!info)}} sx={{border: '1px solid black', backgroundColor: 'white', p: 1, fontSize: '70px', borderRadius: '50%', position: 'fixed', right: '1%', bottom: '1%'}} />
            </div>
        </>
    )
}


/* 


TODO1: from alarm to emp-details redirect


*/