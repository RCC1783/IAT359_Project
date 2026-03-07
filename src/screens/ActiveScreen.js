import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState, useRef, useEffect } from "react";

import { styles } from "../styles";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { mod } from "firebase/firestore/pipelines";

import SelectedProjectScreen from "./SelectedProjectScreen";
import { doc, setDoc, collection } from "firebase/firestore";

//For making the stopwatch I got help from geeksforgeeks.org/react-native/create-a-stop-watch-using-react-native/
//https://firebase.google.com/docs/firestore/manage-data/add-data For adding data to Firebase

export function ModalScreen(route) {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Type your notes here</Text>
      {/* <Button title="Save" onPress={saveLog()} /> */}
      <Button
        title="Dismiss"
        onPress={() =>
          navigation.dispatch({
            ...CommonActions.goBack(),
            source: route.key,
            target: navigation.getState().key,
          })
        }
      />
    </View>
  );
}

export default function ActiveScreen({ route }) {
  //receiving the ProjectId
  const { projectID } = route.params;

  //For updating the time displaying on the stopwatch
  const [time, setTime] = useState(0);
  //To keep track if the timer is running
  const [running, setRunning] = useState(false);
  //Store the interval ID
  const intervalRef = useRef(null);
  //Store the start time in ms
  const startTimeRef = useRef(0);

  let addedMinutes = 0;

  const navigation = useNavigation();

  useEffect(
    (projectID) => {
      console.log("useEffect working");
      const updateTotalMinutes = async () => {
        console.log("works before try");
        try {
          setInterval(() => {
            //add the current time variable to the total minutes variable every minute
            console.log("total minutes is" + { projectID.minutes });
            setDoc(doc(db, "projects", projectID), {
              projectID,
              minutes: minutes + addedMinutes,
            });
          }, 1000);
        } catch (e) {
          console.error("Failed to fetch project", e);
        }
      };
      updateTotalMinutes();
    },
    [time],
  );

  const openLogger = () => {
    navigation.navigate("MyModal");
  };

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

  const endStopWatch = () => {
    //prompt the user with an alert to check if they want to quit their session
    Alert.alert("End Session", "Are you sure", [
      {
        text: "Yes",
        onPress: () => {
          //Prompt the user with a second alert to check if they would like to log anything
          Alert.alert(
            "Update Your Progress",
            "Would you like to log any progress or add an image?",
            [
              {
                //Yes then it will open the modal using openLogger
                text: "Yes",
                onPress: () => openLogger(),
              },
              {
                //Will send the user back to the project screen, but it will still save how many minutes they worked.
                text: "Maybe, Next Time",
                onPress: () => {
                  clearInterval(intervalRef.current);
                  // setTime(0);
                  setRunning(false);
                  //retrieve the total minutes and add the new time

                  navigation.goBack();
                },
              },
            ],
          );
        },
      },
      {
        text: "No",
        onPress: () => console.log("Session Continued"),
      },
    ]);
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
    time >= 1 ? (addedMinutes = Math.floor(time / 60)) : 0;
  };

  updateTimer();

  return (
    <View>
      <Text>~ Active ~</Text>
      {/*Text to display the stopwatch for the user*/}
      <Text>
        {addedMinutes < 10 ? `0${addedMinutes}` : addedMinutes}:
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
          <TouchableOpacity onPress={endStopWatch}>
            <Text>End Session</Text>
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
