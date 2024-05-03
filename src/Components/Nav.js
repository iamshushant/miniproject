import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { styled, useTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";

import {
  // BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectUser } from "./Features/UserAuth/UserSlice";
import { setEmpName, rmEmpName } from "./Features/EmpDetails/EmpSlice";

import HomeCMS from "./HomeCMS";
import InjuryReport from "./InjuryReport";
import EvacuationDetails from "./EvacuationDetails";
import EmployeeDetails from "./EmployeeDetails";
import Records from "./Records";
import Userlog from "./Userlog";
import { Button, Typography } from "@mui/material";
import NotFound from "./NotFound";
import UniversalLog from "./UniversalLog";
import JawaanAdd from "./AddNewJawaan";
import DeviceAdd from "./AddNewDevice";
import AddNewMedic from "./AddNewMedic";
import { AddRounded } from "@mui/icons-material";

const style = {
  position: "absolute",
  zIndex: 3,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  // marginTop: '10px',
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 2,
  fontFamily: "poppins",
};

const select = {
  p: 0,
  bgcolor: "#e0e0e0",
};

const drawerWidth = 300;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Nav() {
  const location = useLocation();

  // console.log('params',location.pathname);
  const theme = useTheme();

  // new jawaan
  const [openAddJawaanModal, setAddJawaanModal] = useState(false);
  // new device
  const [openAddDeviceModal, setAddDeviceModal] = useState(false);
  const [openAddMedicModal, setAddMedicModal] = useState(false);

  const handleOpenAddJawaanModal = () => {
    setAddJawaanModal(true);
  };

  const handleCloseAddJawaanModal = () => {
    setAddJawaanModal(false);
  };

  const handleOpenAddDeviceModal = () => {
    setAddDeviceModal(true);
  };

  const handleCloseAddDeviceModal = () => {
    setAddDeviceModal(false);
  };

  const handleOpenAddMedicModal = () => {
    setAddMedicModal(true);
  };

  const handleCloseAddMedicModal = () => {
    setAddMedicModal(false);
  };

  // Medic
  const [open, setOpen] = useState(true);

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [locfromId, setLocfromId] = useState("");

  // console.log('id after passing',locId);

  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [empData, setEmpData] = useState(null);
  // employee details api
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(
          "https://cms-backend-five.vercel.app/api/details/jawaanDetails",
          { username: user?.username },
          { headers: { Authorization: `Bearer ${user?.accessToken}` } }
        )
        .then((response) => {
          // console.log('r',response.data.jawaanDetails);
          setEmpData(response.data.jawaanDetails);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    setInterval(() => {
      fetchData();
    }, 3000);
  }, [user?.accessToken, user?.username]);

  const [devData, setDevData] = useState(null);

  // device details api
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(
          "https://cms-backend-five.vercel.app/api/details/deviceDetails",
          { username: user?.username },
          { headers: { Authorization: `Bearer ${user?.accessToken}` } }
        )
        .then((response) => {
          // console.log('r',response.data);
          setDevData(response.data.devices);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    setInterval(() => {
      fetchData();
    }, 3000);
  }, [user?.accessToken, user?.username]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     console.log('medic creation started');
  //     if (!user || !user.accessToken) {
  //       // Handle the case when there is no valid access token
  //       console.error('Invalid or missing access token');
  //       return;
  //     }
  //     // console.log(user?.accessToken);
  //     await axios.post('https://cms-backend-five.vercel.app/api/auth/register',
  //       {
  //         name: medicname,
  //         username: user_name,
  //         region: loc,
  //         password: pass,
  //         role: role.value
  //       },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${user?.accessToken}`
  //         }
  //       }
  //     )
  //     // console.log('medic created', res.data);
  //     setModalOpen(false);
  //     notifysuccess();

  //   }
  //   catch (err) {
  //     if (!err?.response) {
  //       console.log('No Server Response');
  //     } else if (err.response?.status === 400) {
  //       console.log('Invalid Credentials');
  //     } else if (err.response?.status === 401) {
  //       console.log('Unauthorized');
  //     } else {
  //       console.log('Invalid Credentials');
  //     }
  //   }
  // }

  const EmpidtoHome = (id) => {
    const loc = devData ? devData.find((d) => d.deviceId === id) : "";
    // setLocfromId(loc.uid);
    dispatch(
      setEmpName({
        emp: loc.uid,
      })
    );
    navigate("/EmployeeDetails");
  };

  const clear = () => {
    dispatch(logout());
    dispatch(rmEmpName());
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        sx={{
          mr: 2,
          ...(open && { display: "none" }),
          position: "absolute",
          left: 0,
          top: 0,
          border: "1px solid black",
          borderRadius: "0% 20% 20% 0%",
          px: 2,
          bgcolor: "#f0f2f6",
        }}
      >
        <ChevronRightIcon />
      </IconButton>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#f0f2f6",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader sx={{ bgcolor: "#f0f2f6 " }}>
          <Box
            sx={{
              position: "relative",
              left: "-35%",
              my: 2,
              bgcolor: "#f0f2f6 ",
            }}
          >
            <img
              src="https://imgs.search.brave.com/bo4w4r1nubPxDDyU76BRiKqRNpppJeeEH2BZVDUWXEg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/Y29sbGVnZXByYXZl/c2guY29tLzIwMTQv/MDYvSUlJVE0tR3dh/bGlvci1Mb2dvLWUx/NDA2NzQxOTc5ODIw/LnBuZw"
              alt="logo"
              width="135px"
            />
          </Box>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <List sx={{ bgcolor: "#f0f2f6", p: 0 }}>
          <ListItem
            component={Link}
            to="/"
            sx={location.pathname === "/" ? select : { p: 0 }}
          >
            <ListItemButton sx={{ px: 2 }}>
              <ListItemText
                primary="Home - CMS"
                sx={{ color: "black", p: 0 }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        <List sx={{ bgcolor: "#f0f2f6", p: 0 }}>
          <ListItem
            component={Link}
            to="/EmployeeDetails"
            sx={location.pathname === "/EmployeeDetails" ? select : { p: 0 }}
          >
            <ListItemButton sx={{ fontSize: "75px" }}>
              <ListItemText
                primary="Employee Details"
                sx={{ color: "black" }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Evacuation Details */}
        <List sx={{ bgcolor: "#f0f2f6", p: 0 }}>
          <ListItem
            component={Link}
            to="/EvacuationDetails"
            sx={location.pathname === "/EvacuationDetails" ? select : { p: 0 }}
          >
            <ListItemButton>
              <ListItemText
                primary="Evacuation Details"
                sx={{ color: "black" }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Injury Report */}
        <List sx={{ bgcolor: "#f0f2f6", p: 0 }}>
          <ListItem
            component={Link}
            to="/InjuryReport"
            sx={location.pathname === "/InjuryReport" ? select : { p: 0 }}
          >
            <ListItemButton>
              <ListItemText primary="Injury Report" sx={{ color: "black" }} />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Records */}
        <List sx={{ bgcolor: "#f0f2f6", p: 0 }}>
          <ListItem
            component={Link}
            to="/Records"
            sx={location.pathname === "/Records" ? select : { p: 0 }}
          >
            <ListItemButton>
              <ListItemText primary="Records" sx={{ color: "black" }} />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Userlog */}
        <List sx={{ bgcolor: "#f0f2f6", p: 0 }}>
          <ListItem
            component={Link}
            to="/Userlog"
            sx={location.pathname === "/Userlog" ? select : { p: 0 }}
          >
            <ListItemButton>
              <ListItemText primary="User Log" sx={{ color: "black" }} />
            </ListItemButton>
          </ListItem>
        </List>

        {/*  */}
        {user?.role === "admin" ? (
          <Box sx={{ bgcolor: "#f0f2f6", m: 2 }}>
            <Button
              variant="outlined"
              sx={{ mb: 2 }}
              onClick={handleOpenAddMedicModal}
            >
              Create Medic
            </Button>

            <Button
              variant="outlined"
              sx={{ mb: 2 }}
              onClick={handleOpenAddDeviceModal}
            >
              Add New Device
            </Button>

            <Button variant="outlined" onClick={handleOpenAddJawaanModal}>
              Add New Jawaan
            </Button>
          </Box>
        ) : (
          ""
        )}
        <List
          sx={{ bgcolor: "#f0f2f6", px: 1, position: "absolute", bottom: 0 }}
        >
          <ListItem component={Link} to="/login" onClick={clear}>
            <LogoutIcon sx={{ fontSize: "30px" }} />
            <ListItemButton>
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: 600 }} variant="h6">
                    Logout
                  </Typography>
                }
                sx={{ color: "black" }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <JawaanAdd
        open={openAddJawaanModal}
        onClose={handleCloseAddJawaanModal}
        data={devData}
      />

      <DeviceAdd
        open={openAddDeviceModal}
        onClose={handleCloseAddDeviceModal}
      />

      <AddNewMedic
        open={openAddMedicModal}
        onClose={handleCloseAddMedicModal}
      />

      <Main open={open}>
        <Routes>
          <Route
            path="/"
            element={<HomeCMS data={empData} data2={devData} />}
          ></Route>
          <Route
            path="/InjuryReport"
            element={<InjuryReport data={empData} data2={devData} />}
          ></Route>
          <Route
            path="/EvacuationDetails"
            element={<EvacuationDetails />}
          ></Route>
          <Route
            path="/EmployeeDetails"
            element={
              <EmployeeDetails
                data={empData}
                data2={devData}
                // toLocate={locfromId}
              />
            }
          ></Route>
          <Route
            path="/Records"
            element={<Records data={empData} data2={devData} />}
          ></Route>
          <Route
            path="/Userlog"
            element={<Userlog data={empData} data2={devData} />}
          ></Route>
          <Route path="/*" element={<NotFound />}></Route>
        </Routes>

        <UniversalLog data={devData} Empid={EmpidtoHome} />
      </Main>
    </Box>
  );
}
