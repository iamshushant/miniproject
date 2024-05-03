import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
// import { Grid } from '@mui/material';

import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

import { mock_data } from "./Data/mock_data";
// import { temperature } from './Data/temperature';
// import { voc_data } from './Data/voc_data';
// import { humidity } from './Data/humidity';
// import { aqi_data } from './Data/aqi_data';
// import { ap_data } from './Data/ap_data';

import { styled } from "@mui/material/styles";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Records(props) {
  // console.log(voc_data);

  const { data, data2 } = props;

  // ------------------------------start(For charts)
  const [tempData, setTempData] = useState({
    labels: [],
    datasets: [
      {
        label: "Temperature",
        height: "80vh",
        data: [],
        backgroundColor: ["rgb(255,99,132)"],
      },
    ],
  }); // temp

  const [VOCData, setVOCData] = useState({
    labels: data2
      ? data2.filter((d) => d.uid !== "").map((d) => d.createdAt)
      : "",
    datasets: [
      {
        label: "Volatile Organic Compound Variation Log",
        height: "80vh",
        data: data2
          ? data2.filter((d) => d.uid !== "").map((d) => d.environment.VOC)
          : "",
        backgroundColor: ["#e98b50"],
      },
    ],
  }); // For VOC

  const [humiData, setHumiData] = useState({
    labels: data2
      ? data2.filter((d) => d.uid !== "").map((d) => d.createdAt)
      : "",
    datasets: [
      {
        label: "Humidity",
        height: "80vh",
        data: data2
          ? data2
              .filter((d) => d.uid !== "")
              .map((d) => d.environment.dewPoints)
          : "",
        backgroundColor: ["rgb(255,205,86)"],
      },
    ],
  }); // For humidity

  const [AQIData, setAQIData] = useState({
    labels: data2
      ? data2.filter((d) => d.uid !== "").map((d) => d.createdAt)
      : "",
    datasets: [
      {
        label: "Air Quality Index",
        height: "80vh",
        data: data2
          ? data2.filter((d) => d.uid !== "").map((d) => d.environment.aqi)
          : "",
        backgroundColor: ["rgb(75,192,192)"],
      },
    ],
  }); // For AQI

  const [APData, setAPData] = useState({
    labels: data2
      ? data2.filter((d) => d.uid !== "").map((d) => d.createdAt)
      : "",
    datasets: [
      {
        label: "Atmospheric Pressure (in hPa)",
        height: "80vh",
        data: data2
          ? data2
              .filter((d) => d.uid !== "")
              .map((d) => d.environment.ambientPressure)
          : "",
        backgroundColor: ["rgb(54,162,235)"],
      },
    ],
  }); // For AP

  useEffect(() => {
    // Update chart data when data2 changes
    if (data2 && data2.length > 0) {
      const labels = data2
        .filter((d) => d.uid !== "")
        .map((d) => d.updatedAt.slice(11, 19));
      const temperatureData = data2
        .filter((d) => d.uid !== "")
        .map((d) => d.environment.ambientTemperature);
      const vocData = data2
        .filter((d) => d.uid !== "")
        .map((d) => d.environment.voc);

      const humidityData = data2
        .filter((d) => d.uid !== "")
        .map((d) => d.environment.dewPoints);
      const aqiData = data2
        .filter((d) => d.uid !== "")
        .map((d) => d.environment.aqi);
      const apData = data2
        .filter((d) => d.uid !== "")
        .map((d) => d.environment.ambientPressure);

      setTempData({
        labels: labels,
        datasets: [
          {
            label: "Temperature",
            data: temperatureData,
            backgroundColor: ["rgb(255, 99, 132)"],
          },
        ],
      });
      setVOCData({
        labels: labels,
        datasets: [
          {
            label: "Volatile Organic Compound Variation Log",
            data: vocData,
            backgroundColor: ["#e98b50"],
          },
        ],
      });
      setHumiData({
        labels: labels,
        datasets: [
          {
            label: "Humidity",
            data: humidityData,
            backgroundColor: ["lightblue"],
          },
        ],
      });
      setAQIData({
        labels: labels,
        datasets: [
          {
            label: "Air Quality Index",
            data: aqiData,
            backgroundColor: ["gold"],
          },
        ],
      });
      setAPData({
        labels: labels,
        datasets: [
          {
            label: "Air Pressure",
            data: apData,
            backgroundColor: ["rgb(41,176,157)"],
          },
        ],
      });
    }
  }, [data2]);

  const optTemp = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Days",
        },
      },
      y: {
        title: {
          display: true,
          text: "Avg Temp (in degree celsius)",
        },
      },
    },
  };
  const optVOC = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Days",
        },
      },
      y: {
        title: {
          display: true,
          text: "VOC",
        },
      },
    },
  };
  const optHumi = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Days",
        },
      },
      y: {
        title: {
          display: true,
          text: "Humidity",
        },
      },
    },
  };
  const optAQI = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Days",
        },
      },
      y: {
        title: {
          display: true,
          text: "Air Quality Index",
        },
      },
    },
  };
  const optAP = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Days",
        },
      },
      y: {
        title: {
          display: true,
          text: "Atmospheric Pressure (in hPa)",
        },
      },
    },
  };

  // ------------------------------end

  const [value, setValue] = React.useState(0);

  const healthScoreFunc = (emp_name) => {
    const healthSc = data2 ? data2.find((d) => d.uid === emp_name) : "";
    let hr = healthSc?.heartRate;
    let spo2 = healthSc?.spo2;
    let rr = healthSc?.respiratoryRate;
    let temp = healthSc?.bodyTemperature;
    let hr_score = 0;
    let temp_score = 0;
    let spo2_score = 0;
    let rr_score = 0;
    if (hr >= 51 && hr <= 90) hr_score = 3;
    else if ((hr >= 40 && hr <= 50) || (hr >= 91 && hr <= 110)) hr_score = 2;
    else if (hr < 40 || hr >= 110) hr_score = 1;

    if (spo2 >= 96 && spo2 <= 100) spo2_score = 2;
    else if (spo2 >= 91 && spo2 <= 95) spo2_score = 1;
    else if (spo2 < 91) spo2_score = 0;

    if (temp >= 36.1 && temp <= 38.0) temp_score = 1;
    else if (temp < 36.1 || temp > 38.0) temp_score = 0;

    if (rr >= 8 && rr <= 16) rr_score = 2;
    else if (rr < 8 && rr > 16) rr_score = 1;
    else rr_score = 0;

    let Modified_NEWS =
      rr_score * 0.2 + spo2_score * 0.2 + temp_score * 0.15 + hr_score * 0.3;
    // (AVPU score * AVPU weight)

    let TOTAL_HEALTH_SCORE = (Modified_NEWS / 2.15) * 100;
    return parseInt(TOTAL_HEALTH_SCORE);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }; // MUI event

  return (
    <Box sx={{ px: 2 }}>
      <DrawerHeader />
      <Typography
        variant="h4"
        sx={{ fontFamily: "Poppins", fontWeight: 600, mb: 2 }}
      >
        Past records
      </Typography>
      <Box className="records-grid">
        <Box className="records-grid-child">
          <Container sx={{ width: "90%", marginTop: "20px" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="wrapped label tabs example"
              >
                <Tab label="Temperature" {...a11yProps(0)} />
                <Tab label="VOC" {...a11yProps(1)} />
                <Tab label="Humidity" {...a11yProps(2)} />
                <Tab label="Air Pressure" {...a11yProps(3)} wrapped />
                <Tab label="Air Quality Index" {...a11yProps(4)} wrapped />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Temperature Variation{" "}
              </Typography>
              <Line className="graphs" data={tempData} options={optTemp} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Volatile Organic Compound Variation{" "}
              </Typography>
              <Line data={VOCData} options={optVOC} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Humidity Variation{" "}
              </Typography>
              <Bar data={humiData} options={optHumi} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Atmospheric Pressure{" "}
              </Typography>
              <Line data={APData} options={optAP} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Air Quality Index{" "}
              </Typography>
              <Line data={AQIData} options={optAQI} />
            </CustomTabPanel>
          </Container>
        </Box>

        <Box className="records-grid-child">
          {/* <Typography variant='h4' sx={{fontFamily: 'Poppins', fontWeight: 600, mb: 2}}>Jawaan Health overview</Typography> */}
          <div className="outer-wrapper">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>
                      <b>ID</b>
                    </th>
                    <th>
                      <b>Name</b>
                    </th>
                    <th>
                      <b>Health Score</b>
                    </th>
                    <th>
                      <b>Injury Score</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data ? (
                    data.map((row) => (
                      <tr key={row.ID}>
                        <td>{row.id}</td>
                        <td>{row.name}</td>
                        <td>{healthScoreFunc(row.name)}%</td>
                        <td>--</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Box>
      </Box>
    </Box>
  );
}
