import React from "react"; // , { useEffect }
import Box from "@mui/material/Box";
import logo from "./Images/loginbanner.png";
import { Typography } from "@mui/material";
import {
  // Link,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useParams } from 'react-router-dom';
import Select from "react-select";

import { useDispatch } from "react-redux";
import { login } from "./Features/UserAuth/UserSlice";

import logo2 from "./Images/loginbanner.png";
import axios from "axios";

export default function Login() {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [role, setRole] = useState("");
  const [errMsg, setErrMsg] = useState("Incorrect Credentials");
  const navigate = useNavigate();

  const rolefunc = (opts) => {
    // setRole(opts);
    setRole(opts);
    // let x = Object.values(opts);
    // formData.medicname = [...x];
  };
  // console.log(role.value);
  const optrole = [
    { value: "admin", label: "Admin" },
    { value: "medic", label: "Medic" },
  ];

  const notifyerror = () => {
    toast.error(errMsg, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const nonempty = async (e) => {
    e.preventDefault();
    try {
      // if (role.value === role) {
      console.log("1st lvl clear");
      const res = await axios.post(
        "https://cms-backend-five.vercel.app/api/auth/login",
        {
          username: name,
          password: pass,
          role: role.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("login done");
      dispatch(
        login({
          username: name,
          role: role.value,
          accessToken: res.data.token,
          loggedIn: true,
        })
      );
      navigate("/");
      // }
      // else{
      //   notifyerror();
      // }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Invalid Credentials");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Invalid Credentials");
      }
      notifyerror();
    }
  };

  // console.log(name);
  // console.log(pass);
  // console.log(role);

  return (
    <Box className="login-page">
      <ToastContainer />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pt: 3,
          pr: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontFamily: "Poppins", fontWeight: 600 }}
        ></Typography>
        <img src={logo2} alt="cms" width="120px" />
      </Box>
      <Box
        sx={{
          width: "75%",
          border: "2px solid black",
          borderRadius: "30px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          margin: "auto",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ borderRight: "2px solid black" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              height: { xl: "320px", lg: "220px", md: "220px", sm: "220px" },
              mt: { xl: "80px", lg: "150px", md: "150px", sm: "150px" },
            }}
          >
            <img src={logo} alt="logo" width="100%" height="100%" />
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: "white",
            width: "90%",
            margin: "auto",
            p: 1,
            my: 2,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ fontFamily: "Poppins", fontWeight: 600 }}
          >
            Login
          </Typography>
          <form onSubmit={nonempty}>
            <Box sx={{ width: "100%", mt: 2 }}>
              <Typography sx={{ fontWeight: 600 }}>Username : </Typography>
              <input
                type="text"
                name="username"
                autoComplete="false"
                placeholder="Enter your User Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="inp-box inp-x"
                required
              />
            </Box>

            <Box sx={{ width: "100%", mt: 5 }}>
              <Typography sx={{ fontWeight: 600 }}>Password : </Typography>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={pass}
                onChange={(e) => {
                  setPass(e.target.value);
                }}
                className="inp-box inp-x"
                required
              />
            </Box>

            <Box sx={{ width: "100%", mt: 5 }}>
              <Typography sx={{ fontWeight: 600 }}>Role : </Typography>
              <Box className="roles">
                <Select
                  // defaultValue={opt}
                  name="roles"
                  options={optrole}
                  onChange={rolefunc}
                  value={role}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Choose your role..."
                  required
                />
              </Box>
            </Box>

            <button className="btns btns-l">Login</button>
          </form>

          {/* <Box sx={{display:'grid', gridTemplateColumns: '1fr 0.01fr 1fr', gap: '40px', maxWidth: '60%', margin: 'auto'}}>
              <Box sx={{borderBottom: '1px solid black', marginBottom: 1}}></Box>
              <Typography>or</Typography>
              <Box sx={{borderBottom: '1px solid black', marginBottom: 1}}></Box>
            </Box>

            <Box sx={{mt: 2}}>
              { heading === 'Medic Login'? 
                <Typography align='center'>
                  <Link to='/login/admin' className='hello'>Sign in as Admin</Link>
                </Typography>
                :
                <Typography align='center'>
                  <Link to='/login' className='hello'>Sign in as Medic</Link>
                </Typography>
              }
            </Box> */}
        </Box>
      </Box>
    </Box>
  );
}

// -----------------------------------

// Login.js

// 1.
// import { createContext } from react;
// const noteContext = createContext();

// export default noteContext;
// ---------------------
// 2.
// import React from react;
// import noteContext from

// const NoteState = (props) => {
// const [menu, setMenu] = useState(false);
// return (
// <noteContext.provider value={menu}>
// {props.children}
// </noteContext.provider>
// )}
// export default NoteState;
// ----------------------
// 3.
// outside <Router> use <NoteState>
// ----------------------
// 4.
// import noteContext from

// a = useContext(noteContext)

// {a.menu &&
// }
