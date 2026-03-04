import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TouchableOpacity,
} from "react-native";
import { useState, useRef } from "react";

import { styles } from "../styles";
import { useNavigation } from "@react-navigation/native";
import { mod } from "firebase/firestore/pipelines";

//For making the stopwatch I got help from geeksforgeeks.org/react-native/create-a-stop-watch-using-react-native/

let belowTen = true;

export default function ActiveScreen() {
  //For updating the time displaying on the stopwatch
  const [time, setTime] = useState(0);
  //To keep track if the timer is running
  const [running, setRunning] = useState(false);
  //Store the interval ID
  const intervalRef = useRef(null);
  //Store the start time in ms
  const startTimeRef = useRef(0);

  let minutes = 0;

  const startStopWatch = () => {
    //set the start time
    startTimeRef.current = Date.now() - time * 1000;
    //start interval to update time every second
    intervalRef.current = setInterval(() => {
      //update time state with elapsed seconds
      setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    //set running to true
    setRunning(true);
  };

  const pauseStopWatch = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  const resetStopWatch = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    setRunning(false);
  };

  const resumeStopWatch = () => {
    startTimeRef.current = Date.now() - time * 1000;
    intervalRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    //set running to true so that the pause button appears again
    setRunning(true);
  };

  const updateTimer = () => {
    time >= 1 ? (minutes = Math.floor(time / 60)) : 0;
  };

  updateTimer();

  const navigation = useNavigation();
  return (
    <View>
      <Text>~ Active ~</Text>
      {/*Text to display the stopwatch for the user*/}
      <Text>
        {minutes < 10 ? `0${minutes}` : minutes}:
        {time % 60 < 10 ? `0${time % 60}` : time % 60}
      </Text>

      {/*check if the stopwatch is running*/}
      {running ? (
        <View>
          <Text>Working...</Text>
          <TouchableOpacity onPress={pauseStopWatch}>
            <Text>Pause</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity onPress={startStopWatch}>
            <Text>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={resetStopWatch}>
            <Text>Reset</Text>
          </TouchableOpacity>
        </>
      )}
      {!running && (
        <TouchableOpacity onPress={resumeStopWatch}>
          <Text>Resume</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
