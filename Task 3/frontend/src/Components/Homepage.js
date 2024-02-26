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
  const [timeWhenBreakStated,setTimeWhenBreakStated ] = useState(null);
  const [breakTimer, setBreakTimer] = useState(0);
  const [curTimerID, setCurTimerID] = useState(null);
  const [breakTimerID, setBreakTimerID] = useState(null);
  const [timerID, setTimerID] = useState(null);
  // let timer;

  // useEffect(() => {
  //   let timer;
  //   if (isClockIn && !isOnBreak) {
  //     let seconds = 0;
  //     let minutes = 0;
  //     let hours = 0;
  //     timer = setInterval(() => {
  //       seconds++;
  //       if (seconds === 60) {
  //         seconds = 0;
  //         minutes++;
  //         if (minutes === 60) {
  //           minutes = 0;
  //           hours++;
  //         }
  //       }
  //       const formattedTime = formatTime(hours, minutes, seconds);
  //       setCurTime(formattedTime);
  //     }, 1000);
  //   } else if (isOnBreak) {
  //     clearInterval(timer);
  //     let seconds = 0;
  //     let minutes = 0;
  //     let hours = 0;
  //     timer = setInterval(() => {
  //       seconds++;
  //       if (seconds === 60) {
  //         seconds = 0;
  //         minutes++;
  //         if (minutes === 60) {
  //           minutes = 0;
  //           hours++;
  //         }
  //       }
  //       const formattedTime = formatTime(hours, minutes, seconds);
  //       setCurTime(formattedTime);
  //     }, 1000);
  //   } else {
  //     clearInterval(timer);
  //   }
  //   return () => clearInterval(timer);
  // }, [isClockIn, isOnBreak]);

  useEffect(()=>{
    if(isClockIn && !isOnBreak){
      setCurTimerID(
        setInterval(() => {
          setCurTime((prevTime) => incrementTime(prevTime));
        }, 1000)
      );
    }else{
      clearInterval(curTimerID);
    }
    return ()=>clearInterval(curTimerID);
  }, [isClockIn,isOnBreak])

  useEffect(() => {
    if (isOnBreak) {
      clearInterval(timerID);
      setTimerID(
        setInterval(() => {
          setBreakTimer((prevTime) => prevTime + 1);
          setBreakTime(secondsToTime(breakTimer + 1));
        }, 1000)
      );
    } else {
      clearInterval(timerID);
      setTimerID(
        setInterval(() => {
          setCurTime((prevTime) => incrementTime(prevTime));
        }, 1000)
      );
    }
    return () => clearInterval(timerID);
  }, [isOnBreak, breakTimer]);

  const incrementTime = (time) => {
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
    return `${String(newHours).padStart(2, "0")}:${String(
      newMinutes
    ).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;
  };

  const secondsToTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

//   const handleBreakInOut = () => {
//     setOnBreak(!isOnBreak);
//     let timer;
//     if (!isOnBreak) {
//         clearInterval(timer); // Pause the timer for current time
//         setBreakTime("00:00:00");
//         setTimeWhenBreakStated(curtime);
//     } else {
//         // End break, log the break time
//         const endTime = new Date().toLocaleTimeString();
//         const entry = { type: "break", startTime: timeWhenBreakStated, endTime };
//         setTimeEntery([...timeEntery, entry]);
//         setTimeWhenBreakStated(null);
        
//         // Resume the timer for current time
//         let seconds = 0;
//         let minutes = 0;
//         let hours = 0;
//         timer = setInterval(() => {
//             seconds++;
//             if (seconds === 60) {
//                 seconds = 0;
//                 minutes++;
//                 if (minutes === 60) {
//                     minutes = 0;
//                     hours++;
//                 }
//             }
//             const formattedTime = formatTime(hours, minutes, seconds);
//             setCurTime(formattedTime);
//         }, 1000);
//     }
// };

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
      clearInterval(timerID);
      setBreakTime("00:00:00");
      setBreakTimer(0);
    } else {
      clearInterval(timerID);
      setCurTime("00:00:00");
    }
  };

  const handleClockOut = ()=>{
    setIsClockIn(false);
    setOnBreak(false);

    const endTime = new Date().toLocaleTimeString();
    const entry = {type: 'clock-Out', startTime: curtime, endTime}
    setTimeEntery([...timeEntery, entry]);

    localStorage.setItem("timeEntries", JSON.stringify(timeEntery));
  }

  // const formatTime = (hours, minutes, seconds) => {
  //   return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
  // };

  // const pad = (num) => {
  //   return num < 10 ? "0" + num : num;
  // };

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
