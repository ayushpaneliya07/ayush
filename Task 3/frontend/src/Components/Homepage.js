import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "./Homepage.css";

export const Homepage = () => { 
  const [curTime, setcurTime] = useState("00:00:00");
  const [breakTime, setBreakTime] = useState("00:00:00");
  const [isOnBreak, setOnBreak] = useState(false);
  const [isClockIn, setIsClockIn] = useState(false);
  const [selectOption, setSelectOption] = useState("");

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('punchInOutData'));
    if (storedData) {
      setcurTime(storedData.curTime);
      setBreakTime(storedData.breakTime);
      setOnBreak(storedData.isOnBreak);
      setIsClockIn(storedData.isClockIn);
      setSelectOption(storedData.selectOption);
    }
  }, []);

  useEffect(() => {
    const dataToSave = { isClockIn, isOnBreak, curTime, breakTime, selectOption };
    localStorage.setItem('punchInOutData', JSON.stringify(dataToSave));
  }, [isClockIn, isOnBreak, curTime, breakTime, selectOption]);
   
  useEffect(() => {
    let curTimerID;
    if (isClockIn && !isOnBreak) {
      curTimerID = setInterval(() => {
        setcurTime((prevTime) => incrementTime(prevTime));
      }, 1000);
    }
    return () => clearInterval(curTimerID);
  }, [isClockIn, isOnBreak]);

  useEffect(() => {
    let timerID;
    if (isOnBreak) {
      timerID = setInterval(() => {
        setBreakTime((prevTime) => incrementTime(prevTime));
      }, 1000);
    }
    return () => clearInterval(timerID);
  }, [isOnBreak]);

  const incrementTime = (time) => {
    if (!time) {
      return "00:00:00"; // Return a default value if time is null or undefined
    }

    const [hours, minutes, seconds] = time.split(":").map(Number);
    let newSeconds = seconds + 1;
    let newMinutes = minutes;
    let newHours = hours;
    if (newSeconds === 60) {
      newSeconds = 0;
      newMinutes += 1;
    }
    if (newMinutes === 60) {
      newMinutes = 0;
      newHours += 1;
    }
    return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;
  };

  const handleClockIn = (e) => {
    setIsClockIn(true);
    setcurTime("00:00:00");
    setBreakTime("00:00:00");

    if (!selectOption) {
      alert("Please select an option.");
      setIsClockIn(false);
      return;
    }
  };

  const handleBreakInOut = (e) => {
    setOnBreak(!isOnBreak);
  };
  
  const handleClockOut = async (e) => {
    setIsClockIn(false);
    setOnBreak(false);
    const currentDate = new Date().toISOString().slice(0, 10);
    
    sendDataToServer({ isClockIn: false, isOnBreak, currentDate, curTime, breakTime});
  };

  const sendDataToServer = (data) => {
    fetch('http://localhost:3003/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(responseData => {
      console.log(responseData);
    })
    .catch(error => {
      console.error('Error sending data to server:', error);
    });
  };

  return (
    <div className="timer_container">
      <div className="time_name">
        <div className="current_set">
          <h4 className="current_time">current time</h4>
          <h1 className="current_timer">{curTime}</h1>
        </div>
        <div className="break_set">
          <h4 className="break_time">break time</h4>
          <h1 className="break_timer">{breakTime}</h1>
        </div>
      </div>
      <div className="timer_button">
        {!isClockIn ? (
          <Select
            className="select_section"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectOption}
            label="select"
            onChange={(e) => setSelectOption(e.target.value)}
          >
            <MenuItem value="Work form office">Work form office</MenuItem>
            <MenuItem value="Work form home">Work form home</MenuItem>
          </Select>
        ) : (
          <Button
            className="break_button"
            variant="contained"
            onClick={handleBreakInOut}
          >
            {isOnBreak ? "End Break" : "Take Break"}
          </Button>
        )}
        <Button
          className="clockin_button"
          variant="contained"
          onClick={() => (isClockIn ? handleClockOut() : handleClockIn())}
        >
          {!isClockIn ? "Clock In" : "Clock Out"}
        </Button>
      </div>
    </div>
  );
};
