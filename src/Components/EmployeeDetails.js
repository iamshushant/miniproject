import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { Button, Typography } from "@mui/material";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { useSelector, useDispatch } from "react-redux";
import { rmEmpName, selectEmp } from "./Features/EmpDetails/EmpSlice";

// import { mock_data1 } from './Data/mock_data1';
// import { mock_data } from './Data/mock_data';
// import { hr_data } from './Data/hr_data';
// import { hrv_data } from './Data/hrv_data';
// import { spo2_data } from './Data/spo2_data';
// import { body_temp } from './Data/body_temp';
// import { rr_data } from './Data/rr_data';
// import { folium_data } from './Data/folium_data';

// import { useSelector, useDispatch } from 'react-redux';
// import {
// empDetFalse,
// selectDetUser } from './Features/EmpDetails/UserDetSlice';

import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Container from "@mui/material/Container";

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

export default function JawaanDetails(props) {
  // console.log(data);
  // console.log('-----');

  const empDet = useSelector(selectEmp);
  const dispatch = useDispatch();

  useEffect(() => {
    if (empDet?.emp) {
      healthScoreFunc(empDet?.emp);
      setSelectedOption(empDet?.emp);
      dispatch(rmEmpName());
    }
  }, [empDet?.emp]);

  const { data, data2 } = props;

  const [healthSc, setHealthSc] = useState(false);

  const [selectedOption, setSelectedOption] = useState("");
  const selectedDetails = data
    ? data.find((d) => d.name === selectedOption)
    : "";
  const vitalsData = data2 ? data2.find((d) => d.uid === selectedOption) : "";

  const healthScoreFunc = (name) => {
    let status = data2 ? data2.find((d) => d.uid === name) : "";
    // console.log('status',status);
    let hr = status?.heartRate;
    let spo2 = status?.spo2;
    let temp = status?.bodyTemperature;
    let rr = status?.respiratoryRate;
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
    // console.log('THS',TOTAL_HEALTH_SCORE);
    setHealthSc(parseInt(TOTAL_HEALTH_SCORE));
  };

  function jsonToCsv(jsonData, excludedKeys = []) {
    const csvContent = [];
    const headers = Object.keys(jsonData).filter(
      (key) => !excludedKeys.includes(key)
    );

    // Loop through each object property
    for (const property in jsonData) {
      if (excludedKeys.includes(property)) {
        continue; // Skip excluded keys
      }
      const value = jsonData[property];

      // Create a new row for each key-value pair
      const row = [property]; // Start with the key in the first column

      // Handle single or multi-valued fields
      if (Array.isArray(value)) {
        // Add each element of the array to subsequent columns
        value.forEach((item, index) => {
          if (index >= row.length) {
            row.push(""); // Add empty cells if needed for alignment
          }
          row[index + 1] = item; // Add value to next column
        });
      } else {
        // Add single value to the next column
        row.push(value);
      }

      // Add the completed row to CSV content
      csvContent.push(row.join(","));
    }

    return csvContent.join("\n");
  }

  function downloadCSV() {
    const excludedKeys = ["_id", "share_token", "__v"];
    const csvString = jsonToCsv(selectedDetails, excludedKeys);

    const csvBlob = new Blob([csvString], { type: "text/csv" });
    const csvUrl = URL.createObjectURL(csvBlob);

    const link = document.createElement("a");
    link.href = csvUrl;
    link.download = "past_records.csv"; // Customize filename if needed
    link.click();

    URL.revokeObjectURL(csvUrl); // Revoke object URL after download
  }

  // console.log('selectedDetails', selectedDetails);

  // ------------------------------start(For charts)

  const [HRData, setHRData] = useState({
    labels: [],
    datasets: [
      {
        label: "Heart Rate (in beats per minute)",
        data: [],
        backgroundColor: ["rgb(54,162,235)"],
      },
    ],
  }); // For hr

  const [HRVData, setHRVData] = useState({
    labels: [],
    datasets: [
      {
        label: "HRV (in ms)",
        data: [],
        backgroundColor: ["rgb(255,205,86)"],
      },
    ],
  }); // For hrv

  const [Spo2Data, setSpo2Data] = useState({
    labels: [],
    datasets: [
      {
        label: "SP02 level (in %)",
        data: [],
        backgroundColor: ["rgb(75,192,192)"],
      },
    ],
  }); // For AQI

  const [rrData, setrrData] = useState({
    labels: [],
    datasets: [
      {
        label: "Respiratory Rate (breaths per minute)",
        data: [],
        backgroundColor: ["rgb(255,205,86)"],
      },
    ],
  }); // For AP

  const [tempData, setTempData] = useState({
    labels: [],
    datasets: [
      {
        label: "Avg Body temp (in degree celsius)",
        data: [],
        backgroundColor: ["rgb(255,99,132)"],
      },
    ],
  }); // body-temp

  // dynamic graph data
  useEffect(() => {
    // Update chart data when data changes
    if (data2 && data2.length > 0) {
      const labels = data2
        .filter((d) => d.uid !== "")
        .map((d) => d.updatedAt.slice(11, 19));
      const labelforJawaan = data2
        .filter((d) => d.uid !== "")
        .map((d) => d.updatedAt.slice(11, 19));

      // const jawaan = data2.find(d => d.uid === selectedOption);

      const hrData = data2.filter((d) => d.uid !== "").map((d) => d.heartRate);
      const hrvData = data2
        .filter((d) => d.uid !== "")
        .map((d) => d.heartRateVariability);
      const rrData = data2
        .filter((d) => d.uid !== "")
        .map((d) => d.respiratoryRate);
      const spo2Data = data2.filter((d) => d.uid !== "").map((d) => d.spo2);
      const tempData = data2
        .filter((d) => d.uid !== "")
        .map((d) => d.bodyTemperature);

      // const datasets = data2.map((jawaan, index) => {
      //   const hrData = data2.map((d) => d.heartRate);
      //   return {
      //     label: jawaan.uid, // Dynamically set the label to jawaan name
      //     data: hrData,
      //     backgroundColor: ['rgb(255, 99, 132)'],
      //   };
      // });

      // setHRData({
      //   labels: labels,
      //   datasets: datasets,
      // });

      setHRData({
        labels: labels,
        datasets: [
          {
            label: "Heart Rate (in beats per minute)",
            data: hrData,
            backgroundColor: ["rgb(255, 99, 132)"],
          },
        ],
      });

      setHRVData({
        labels: labels,
        datasets: [
          {
            label: "HRV (in ms)",
            data: hrvData,
            backgroundColor: ["rgb(255,43,43)"],
          },
        ],
      });

      setrrData({
        labels: labels,
        datasets: [
          {
            label: "Respiratory Rate (breaths per minute)",
            data: rrData,
            backgroundColor: ["lightblue"],
          },
        ],
      });

      setSpo2Data({
        labels: labels,
        datasets: [
          {
            label: "SP02 level (in %)",
            data: spo2Data,
            backgroundColor: ["gold"],
          },
        ],
      });

      setTempData({
        labels: labels,
        datasets: [
          {
            label: "Avg Body temp (in degree celsius)",
            data: tempData,
            backgroundColor: ["rgb(41,176,157)"],
          },
        ],
      });
    }
  }, [data]);

  const optHR = {
    scales: {
      x: {
        inital: 0,
        title: {
          display: true,
          text: "Days",
        },
      },
      y: {
        title: {
          display: true,
          text: "Heart Rate (in beats per minute)",
        },
        // beginAtZero: true
      },
    },
  };
  const optHRV = {
    scales: {
      x: {
        // beginAtZero: true,
        title: {
          display: true,
          text: "Days",
        },
      },
      y: {
        // beginAtZero: true,
        title: {
          display: true,
          text: "HRV (in ms)",
        },
      },
    },
  };
  const optSpo2 = {
    scales: {
      x: {
        // beginAtZero: true,
        title: {
          display: true,
          text: "Days",
        },
      },
      y: {
        // beginAtZero: true,
        title: {
          display: true,
          text: "SP02 level (in %)",
        },
      },
    },
  };
  const optRR = {
    scales: {
      x: {
        // beginAtZero: true,
        title: {
          display: true,
          text: "Days",
        },
      },
      y: {
        // beginAtZero: true,
        title: {
          display: true,
          text: "Respiratory Rate (breaths per minute)",
        },
      },
    },
  };
  const optTemp = {
    scales: {
      x: {
        // beginAtZero: true,
        title: {
          display: true,
          text: "Days",
        },
      },
      y: {
        // beginAtZero: true,
        title: {
          display: true,
          text: "Avg Body temp (in degree celsius)",
        },
      },
    },
  };

  // ------------------------------end

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [view, setView] = useState(false); // for showing/hiding the options
  const toggleHandler = () => setView(!view);

  const [inpValue, setInpValue] = useState("");

  return (
    <Box sx={{ p: 5 }}>
      {/* <DrawerHeader /> */}

      <Typography variant="h4" sx={{ fontFamily: "Poppins", fontWeight: 600 }}>
        Jawaan Details
      </Typography>

      <Box sx={{ p: 2, pb: 0, display: "flex", mx: 2, mt: 3 }}>
        <Box className="search-box">
          <Box className="search-tool" onClick={toggleHandler}>
            {selectedOption ? selectedOption : "Search for Jawaan ID"}
            <ExpandMoreIcon />
          </Box>

          {view && (
            <ul className="name-lists">
              <Box sx={{ position: "sticky", top: 0 }}>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Search for Jawaan"
                  className="inp-box inp-dr"
                  value={inpValue}
                  onChange={(e) => setInpValue(e.target.value)}
                />
              </Box>
              {data
                ? data
                    .filter((emp) => {
                      if (inpValue === "") {
                        return emp;
                      } else if (
                        emp.name.toLowerCase().includes(inpValue.toLowerCase())
                      ) {
                        return emp;
                      }
                    })
                    .map((emp) => {
                      return (
                        <li
                          key={emp.id}
                          onClick={() => {
                            setSelectedOption(emp.name);
                            toggleHandler();
                            healthScoreFunc(emp.name);
                          }}
                        >
                          {emp.name}
                        </li>
                      );
                    })
                : ""}
            </ul>
          )}
        </Box>
      </Box>

      <Box>
        <Box className="inj-data">
          <Box
            className="box-1"
            sx={{
              p: 3,
              display: { xl: "block", lg: "block", md: "grid", sm: "grid" },
              gridTemplateColumns: "1fr 1fr",
              alignItems: "center",
            }}
          >
            {selectedDetails && (
              <Box>
                <h1>{selectedDetails.name}</h1>
              </Box>
            )}
            {selectedDetails && (
              <Box sx={{ my: 3 }}>
                <h3>Health Score : </h3>
                <progress
                  id="injury"
                  className="jawaan-health-score"
                  value={healthSc}
                  max="100"
                ></progress>
                <br />
                <label htmlFor="injury">{healthSc}%</label>
                <Box sx={{ my: 3 }}>
                  <input
                    type="button"
                    value="Download Past Records"
                    className="btns"
                    onClick={downloadCSV}
                  />
                </Box>
              </Box>
            )}
          </Box>
          <Box className="box-2">
            {selectedDetails && (
              <Box sx={{ p: 3 }}>
                <h1>
                  {selectedDetails
                    ? selectedDetails.condition[0].toUpperCase() +
                      selectedDetails.condition.slice(1)
                    : "Stable"}
                </h1>
                <Accordion sx={{ my: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Medications</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {selectedDetails.medications}
                      {/* This area contains medication */}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion sx={{ my: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Treatments</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{selectedDetails.treatments}</Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion sx={{ my: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Past Injuries</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      No of Injuries. {selectedDetails.past_injuries}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion sx={{ my: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Records of Hospitilisation</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Past Records of Hospitilisation{" "}
                      {selectedDetails.hospitalization_records}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion sx={{ my: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Prescribtions</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{selectedDetails.prescriptions}</Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}
          </Box>
          <Box className="box-3" sx={{ p: 3 }}>
            {selectedDetails && (
              <Box>
                <h1>Vitals</h1>
                <Box className="box-3-child">
                  <Box sx={{ my: 2 }}>
                    <Typography>Spo2</Typography>
                    <Typography variant="h5" className="values">
                      {vitalsData.spo2}
                      <ArrowUpwardIcon
                        sx={{ color: "#3db28c", fontSize: "18px" }}
                      />
                      <ArrowDownwardIcon
                        sx={{ color: "#fb7979", fontSize: "18px" }}
                      />
                    </Typography>
                  </Box>

                  <Box sx={{ my: 2 }}>
                    <Typography>Heart Rate</Typography>
                    <Typography variant="h5" className="values">
                      {vitalsData.heartRate}
                      <ArrowUpwardIcon
                        sx={{ color: "#3db28c", fontSize: "18px" }}
                      />
                      <ArrowDownwardIcon
                        sx={{ color: "#fb7979", fontSize: "18px" }}
                      />
                    </Typography>
                  </Box>

                  <Box sx={{ my: 2 }}>
                    <Typography>Heart Rate Variablity</Typography>
                    <Typography variant="h5" className="values">
                      {vitalsData.heartRateVariability}
                      <ArrowUpwardIcon
                        sx={{ color: "#3db28c", fontSize: "18px" }}
                      />
                      <ArrowDownwardIcon
                        sx={{ color: "#fb7979", fontSize: "18px" }}
                      />
                    </Typography>
                  </Box>

                  <Box sx={{ my: 2 }}>
                    <Typography>Body Temperature</Typography>
                    <Typography variant="h5" className="values">
                      {vitalsData.bodyTemperature}
                      <ArrowUpwardIcon
                        sx={{ color: "#3db28c", fontSize: "18px" }}
                      />
                      <ArrowDownwardIcon
                        sx={{ color: "#fb7979", fontSize: "18px" }}
                      />
                    </Typography>
                  </Box>

                  <Box sx={{ my: 2 }}>
                    <Typography>Respiratory Rate</Typography>
                    <Typography variant="h5" className="values">
                      {vitalsData.respiratoryRate}
                      <ArrowUpwardIcon
                        sx={{ color: "#3db28c", fontSize: "18px" }}
                      />
                      <ArrowDownwardIcon
                        sx={{ color: "#fb7979", fontSize: "18px" }}
                      />
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        <Box className="other-details">
          {selectedDetails && (
            <Box className="records-grid-2">
              <Box className="records-grid-child">
                <Container sx={{ width: "90%", marginTop: "20px" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="wrapped label tabs example"
                    >
                      <Tab label="Heart Rate Data" {...a11yProps(0)} />
                      <Tab
                        label="Heart Rate Variality Data"
                        {...a11yProps(1)}
                      />
                      <Tab label="Spo2 Data" {...a11yProps(2)} wrapped />
                      <Tab label="Respiratory Rate" {...a11yProps(3)} wrapped />
                      <Tab label="Body Temperature" {...a11yProps(4)} />
                    </Tabs>
                  </Box>
                  <CustomTabPanel value={value} index={0}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Heart Rate Data
                    </Typography>
                    <Line data={HRData} options={optHR} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={1}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Heart Rate Variality Data
                    </Typography>
                    <Line data={HRVData} options={optHRV} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={2}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Spo2 Data
                    </Typography>
                    <Line data={Spo2Data} options={optSpo2} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={3}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Respiratory Rate
                    </Typography>
                    <Line data={rrData} options={optRR} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={4}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Body Temperature
                    </Typography>
                    <Line data={tempData} options={optTemp} />
                  </CustomTabPanel>
                </Container>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
