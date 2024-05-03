import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from './Components/Nav';
import Login from './Components/Login';

import { 
  // useEffect, 
  useState } from 'react';
// import axios from 'axios';
// import HomeCMS from './Components/HomeCMS';
// import InjuryReport from './Components/InjuryReport';
// import EvacuationDetails from './Components/EvacuationDetails';
// import EmployeeDetails from './Components/EmployeeDetails';
// import Records from './Components/Records';
// import Userlog from './Components/Userlog';
import NotFound from './Components/NotFound';

import { selectUser } from './Components/Features/UserAuth/UserSlice';
import { useSelector } from 'react-redux';


function App() {


  const user = useSelector(selectUser);


  return (
    <Router>
      {user?.loggedIn ? 
      <>
        <Nav />
        
      </>
      : 
        <>
          <Login />
          <Routes>
            <Route path="/*" element={<NotFound />}></Route>
          </Routes>
        </>
      }
    </Router>
  );
}

export default App;

// dark - #202123
// black - #343541
// mid dark - #444654
// red - #ff4b4b
// blue - 


// body - 
//black == background-color: #262730;
//   color: white;
// nav - 
//dark grey == background-color: #343541;
//   color: white;
// nav .sidebar - 
// background-color: #343541;
//   color: white;

