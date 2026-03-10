import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { useState, useRef, useEffect } from "react";

import { styles } from "../styles";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { mod } from "firebase/firestore/pipelines";

import SelectedProjectScreen from "./SelectedProjectScreen";
import { doc, setDoc, collection, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

//For making the stopwatch I got help from geeksforgeeks.org/react-native/create-a-stop-watch-using-react-native/
//https://firebase.google.com/docs/firestore/manage-data/add-data For adding data to Firebase

//Class for storing/making a new log that will then get updated to the firebase data
class Log {
  date = "";
  text = "";
  img = 0;
  constructor(text, date) {
    this.date = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;;
    this.text = text;
  }
}

async function updateProj(project, projectID) {
  try {
    const projectRef = doc(db, "projects", projectID);
    await updateDoc(projectRef, { ...project });
  } catch (e) {
    console.error(e);
  }
}

function saveLog(newLog, projectID, project) {
  if(project == undefined){
    console.error("Project undefined");
    return undefined;
  }
  //if there's nothing in the text input just return
  if (newLog.text == '') return;
  try {
    project.logs = [...project.logs, { ...newLog }];
    // const docRef = await doc(db, "projects", projectID);
    // updateDoc(docRef, {
    //   logs: [...project.logs]
    // });
    // console.log(`new log created with ID: ${docRef.id}`);
    updateProj(project, projectID);
  } catch (e) {
    console.error("An error occurred while trying to save", e);
  }
  return project;
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

  //from Roan's code so that it knows which project data to look at
  const [currentProject, setCurrentProj] = useState();

  const [workedMinutes, setWorkedMinutes] = useState(0);
  const [minutesToAdd, setMinutesToAdd] = useState(0);

  //store the string that the user inputs into the text variable
  const [text, onChangeText] = useState("");

  //For toggling the modal popup for the user to input a log
  const [showModal, setShowModal] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectRef = doc(db, "projects", projectID);
        const project = await getDoc(projectRef);
        setCurrentProj(project.data());
        console.log("current proj:", project);
      } catch (e) {
        console.error("failed to fetch project", e);
      }
    };
    fetchProject();
  }, [running]);

  useEffect(() => {
    updateTotalMinutes(projectID, currentProject);
  }, [minutesToAdd]);

  function updateTotalMinutes(projectID, project) {
    if (project == undefined) {
      console.log("loading");
      return;
    } else {
      console.log(project);
      project.minutes = project.minutes + minutesToAdd - workedMinutes;

      setWorkedMinutes(minutesToAdd);
      // console.log(`minutes to add: ${minutesToAdd}, worked min: ${workedMinutes}`);
      updateProj(project, projectID);

      return project;
    }
  }

  const openLogger = () => {
    //set showModal to true to check if it should display the new popup
    setShowModal(true);
    // navigation.navigate("MyModal", { projectID: projectID });
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
    if (time > 0 && Math.floor(time / 60) > minutesToAdd) {
      setMinutesToAdd(Math.floor(time / 60));
    }
  };

  updateTimer();

  return (
    <View>
      {showModal ? (
        <View>
          <Text>Write your Notes here</Text>
          <TextInput
            placeholder="Today I drew..."
            value={text}
            onChangeText={onChangeText}
          />
          <Button
            title="Save"
            onPress={() => setCurrentProj(saveLog(new Log(text, new Date()), projectID, currentProject))}
          />
          <Button title="Dismiss" onPress={() => setShowModal(false)} />
        </View>
      ) : (
        <View>
          <Text>~ Active ~</Text>
          {/*Text to display the stopwatch for the user*/}
          <Text>
            {minutesToAdd < 10 ? `0${minutesToAdd}` : minutesToAdd}:
            {time % 60 < 10 ? `0${time % 60}` : time % 60}
          </Text>

          {/*check if the stopwatch is running*/}
          {running ? (
            <View>
              <Text>Working...</Text>
              <TouchableOpacity
                onPress={pauseStopWatch}
                style={styles.homeButton}
              >
                <Text>Pause</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TouchableOpacity
                onPress={startStopWatch}
                style={styles.homeButton}
              >
                <Text>Start</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={endStopWatch}
                style={styles.homeButton}
              >
                <Text>End Session</Text>
              </TouchableOpacity>
            </>
          )}
          {!running && (
            <TouchableOpacity
              onPress={resumeStopWatch}
              style={styles.homeButton}
            >
              <Text>Resume</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
