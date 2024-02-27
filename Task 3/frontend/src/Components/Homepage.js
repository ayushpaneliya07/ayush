import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "./Homepage.css";

export const Homepage = () => { 
  const [curtime, setCurTime] = useState("00:00:00");
  const [breakTime, setBreakTime] = useState("00:00:00");
  const [isOnBreak, setOnBreak] = useState(false);
  const [isClockIn, setIsClockIn] = useState(false);
  const [selectOption, setSelectOption] = useState("");

  useEffect(() => {
    // Load data from session storage when the component mounts
    const storedData = sessionStorage.getItem('punchInOutData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setIsClockIn(parsedData.isClockIn);
      setOnBreak(parsedData.isOnBreak);
      setCurTime(parsedData.curtime);
      setBreakTime(parsedData.breakTime);
    }
  }, []);

  useEffect(() => {
    // Save data to sessionStorage whenever there's a change
    const dataToSave = {
      isClockIn,
      isOnBreak,
      curtime,
      breakTime
    };
    sessionStorage.setItem('punchInOutData', JSON.stringify(dataToSave));
  }, [isClockIn, isOnBreak, curtime, breakTime]);

  useEffect(() => {
    let curTimerID;
    if (isClockIn && !isOnBreak) {
      curTimerID = setInterval(() => {
        setCurTime((prevTime) => incrementTime(prevTime));
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

  const handleClockIn = () => {
    setIsClockIn(true);
    setCurTime("00:00:00");
    setBreakTime("00:00:00");

    if (!selectOption) {
      alert("Please select an option.");
      setIsClockIn(false);
      return;
    }
  };

  const handleBreakInOut = () => {
    setOnBreak(!isOnBreak);
  };
  
  const handleClockOut = () => {
    setIsClockIn(false);
    setOnBreak(false);
  };

  return (
    <div className="timer_container">
      <div className="time_name">
        <div className="current_set">
          <h4 className="current_time">current time</h4>
          <h1 className="current_timer">{curtime}</h1>
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
