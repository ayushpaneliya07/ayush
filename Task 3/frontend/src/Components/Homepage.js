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
  const [timeEntery, setTimeEntery] = useState([]);

  useEffect(() => {
    let timer;
    if (isClockIn && !isOnBreak) {
      let seconds = 0;
      let minutes = 0;
      let hours = 0;
      timer = setInterval(() => {
        seconds++;
        if (seconds === 60) {
          seconds = 0;
          minutes++;
          if (minutes === 60) {
            minutes = 0;
            hours++;
          }
        }
        const formattedTime = formatTime(hours, minutes, seconds);
        setCurTime(formattedTime);
      }, 1000);
    } else if (isOnBreak) {
      let seconds = 0;
      let minutes = 0;
      let hours = 0;
      timer = setInterval(() => {
        seconds++;
        if (seconds === 60) {
          seconds = 0;
          minutes++;
          if (minutes === 60) {
            minutes = 0;
            hours++;
          }
        }
        const formattedTime = formatTime(hours, minutes, seconds);
        setCurTime(formattedTime);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isClockIn, isOnBreak]);

  const handleClockIn = () => {
    setIsClockIn(true);
    setCurTime("00:00:00");

    if (!selectOption) {
      alert("Please select an option.");
      setIsClockIn(false);
      return;
    }
  };

  const handleBreakInOut = () => {
    setOnBreak(!isOnBreak);
    if (!isOnBreak) {
      setBreakTime("00:00:00");
    } else {
      const endTime = new Date().toLocaleTimeString();
      const entry = { type: "break", startTime: "breakTime, endTime" };
      setTimeEntery([...timeEntery, entry]);
    }
  };

  const formatTime = (hours, minutes, seconds) => {
    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
  };

  const pad = (num) => {
    return num < 10 ? "0" + num : num;
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
          onClick={isClockIn ? "handleClockIn" : "handleClockOut"}
        >
          {!isClockIn ? "Clock In" : "Clock Out"}
        </Button>
      </div>
    </div>
  );
};
