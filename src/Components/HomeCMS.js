import React from "react";
import { useState, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Paper } from "@mui/material";

// import { folium_data } from './Data/folium_data'

// import DevicesIcon from '@mui/icons-material/Devices';
// import TvIcon from '@mui/icons-material/Tv';
// import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled';
// import HealingIcon from '@mui/icons-material/Healing';
// import HeightIcon from '@mui/icons-material/Height';
// import MedicationIcon from '@mui/icons-material/Medication';
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import L from "leaflet";
import "../App.css";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import "leaflet-draw/dist/leaflet.draw.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  FeatureGroup,
  useMap,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import MarkerClusterGroup from "react-leaflet-cluster";

import { Icon, divIcon, point } from "leaflet";

import logo from "./Images/logo2.png";

function customIconF(condition) {
  // console.log(marker);

  if (condition === "stable") {
    return customIcon2;
  }
  if (condition === "unstable") {
    return customIcon;
  }
  if (condition === "dangerous") {
    return customIcon3;
  }
  if (condition === "critical") {
    return customIcon4;
  } else return customIcon;
}

// create custom icon
const customIcon = new Icon({
  iconUrl: require("./Images/all.png"),
  iconSize: [38, 38],
});
const customIcon2 = new Icon({
  iconUrl: require("./Images/stable.png"),
  iconSize: [38, 38],
});
const customIcon3 = new Icon({
  iconUrl: require("./Images/unstable.png"),
  iconSize: [38, 38],
});
const customIcon4 = new Icon({
  iconUrl: require("./Images/critical.png"),
  iconSize: [38, 38],
});

const initialPosition = [29.4289, 76.9309]; // latitute, longitude
// custom cluster icon
const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span className="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: L.point(50, 50, true),
  });
};

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

export default function HomeCMS(props) {
  const { data, data2, toLocate } = props;

  // const map = useMap();

  // const [position, setPosition] = useState([null, null]);

  const selectedDetails = (emp_name) => {
    const emp = data ? data.find((d) => d.name === emp_name) : "";
    return emp.condition;
  };

  // useEffect(() => {
  //   if(toLocate){
  //     setPosition([toLocate?.Latitude, toLocate?.Longitude]);
  //     map.flyTo([toLocate?.Latitude, toLocate?.Longitude]);
  //   }
  // }, [toLocate?.Latitude, toLocate?.Longitude, map]);

  const [Cond, setCond] = useState("All");

  const changeCond = () => {
    setCond("All");
    setStatus(true);
  };
  const changeCondS = () => {
    setCond("Stable");
    setStatus(false);
  };
  const changeCondU = () => {
    setCond("Unstable");
    if (status) {
      setStatus(false);
    }
  };
  const changeCondD = () => {
    setCond("Dangerous");
    if (status) {
      setStatus(false);
    }
  };
  const changeCondC = () => {
    setCond("Critical");
    if (status) {
      setStatus(false);
    }
  };

  const [status, setStatus] = useState(true);

  const _onCreate = (e) => console.log(e);

  return (
    <Box sx={{ px: { xl: 3, lg: 3, md: 0, sm: 0 }, mt: 2 }}>
      {/* <DrawerHeader /> */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontFamily: "Poppins", fontWeight: 600 }}
        >
          Casualty Management Platform
        </Typography>
        <img src={logo} alt="cms" width="100px" />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xl: "repeat(5, 1fr)",
            lg: "repeat(5, 1fr)",
            md: "1fr 1fr 1.5fr 0.5fr 1fr",
            sm: "1fr 1fr 1.5fr 0.5fr 1fr",
          },
          maxWidth: { xl: "90%", lg: "90%", md: "100%", sm: "100%" },
          gap: "30px",
          my: 3,
        }}
      >
        <Box>
          <Typography>All Devices</Typography>
          <Typography variant="h4">240</Typography>
        </Box>
        <Box>
          <Typography>Active Devices</Typography>
          <Typography variant="h4">200</Typography>
          <Typography
            sx={{ display: "flex", alignItems: "center", color: "#3db28c" }}
          >
            <ArrowUpwardIcon />
            12
          </Typography>
        </Box>
        <Box>
          <Typography>Not Active Devices</Typography>
          <Typography variant="h4">40</Typography>
          <Typography
            sx={{ display: "flex", alignItems: "center", color: "#ff4b4b" }}
          >
            <ArrowDownwardIcon />3
          </Typography>
        </Box>
        <Box>
          <Typography>Injuries</Typography>
          <Typography variant="h4">0</Typography>
        </Box>
        <Box>
          <Typography>Altitude</Typography>
          <Typography variant="h4">219m</Typography>
        </Box>
      </Box>

      <Typography
        variant="h4"
        sx={{ fontFamily: "Poppins", fontWeight: 600, mt: 4 }}
      >
        Health Condition
      </Typography>

      <Box className="army-cms-maps">
        <Box
          className="radio-groups"
          sx={{ my: 3, display: "flex", gap: "50px" }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              id="All"
              name="last option"
              className="All"
              value="All"
              onChange={changeCond}
              checked={status}
            />
            <label htmlFor="All">All</label>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              id="Stable"
              name="last option"
              className="Stable"
              value="Stable"
              onChange={changeCondS}
            />
            <label htmlFor="Stable">Stable</label>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              id="Unstable"
              name="last option"
              className="Unstable"
              value="Unstable"
              color="primary"
              onChange={changeCondU}
            />
            <label htmlFor="Unstable">Unstable</label>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              id="Dangerous"
              name="last option"
              className="Dangerous"
              value="Dangerous"
              color="primary"
              onChange={changeCondD}
            />
            <label htmlFor="Dangerous">Dangerous</label>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              id="Critical"
              name="last option"
              className="Critical"
              value="Critical"
              onChange={changeCondC}
            />
            <label htmlFor="Critical">Critical</label>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "start" }}>
          <MapContainer center={initialPosition} zoom={12} minZoom={12}>
            <FeatureGroup>
              <EditControl
                position="topleft"
                // onCreated={_onCreate}
                draw={{}}
              />
            </FeatureGroup>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <MarkerClusterGroup
              chunkedLoading
              iconCreateFunction={createClusterCustomIcon}
            >
              {data2
                ? data2
                    .filter((d) => {
                      if (d.uid !== "") {
                        if (selectedDetails(d.uid) === Cond.toLowerCase()) {
                          return d;
                        }
                      }
                      if (Cond === "All" && d.uid !== "") {
                        return d;
                      }
                    })
                    .map((marker, i) => (
                      <Marker
                        key={i}
                        position={[
                          marker.location.latitude.toFixed(4),
                          marker.location.longitude.toFixed(4),
                        ]}
                        icon={customIconF(selectedDetails(marker.uid))}
                      >
                        <Popup>
                          <Typography align="center">{marker.uid}</Typography>
                          <Typography align="center">
                            {selectedDetails(marker.uid)}
                          </Typography>
                          <Typography>
                            {marker.location.latitude.toFixed(4)},
                            {marker.location.longitude.toFixed(4)}
                          </Typography>
                        </Popup>
                      </Marker>
                    ))
                : ""}
            </MarkerClusterGroup>
          </MapContainer>

          <Paper
            sx={{
              bgcolor: "#e8f2fc",
              width: { xl: "25%", lg: "25%", md: "30%", sm: "30%" },
              margin: "0 auto",
              p: 3,
            }}
            elevation={5}
          >
            <Typography variant="h5" align="center" sx={{ fontWeight: "600" }}>
              Legend
            </Typography>
            <Typography sx={{ bgcolor: "#e8f2fc", p: 1 }}>
              🟢 Green: Normal Vitals
            </Typography>
            <Typography sx={{ bgcolor: "#e8f2fc", p: 1 }}>
              🟡 Yellow: Slight Irregularity in Vitals
            </Typography>
            <Typography sx={{ bgcolor: "#e8f2fc", p: 1 }}>
              🔴 Red: High Irregularity in Vitals
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

//  🟢Green: Normal Vitals
//  🟡Yellow: Slight Irregularity in Vitals
//  🔴Red: High Irregularity in Vitals
