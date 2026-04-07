import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
  TextInput,
  Pressable,
  Image,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useState, useRef, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles";
import {
  CommonActions,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { mod } from "firebase/firestore/pipelines";

import SelectedProjectScreen from "./SelectedProjectScreen";
import { doc, setDoc, collection, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

import { Audio } from "expo-av";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";

import {
  CustomHeader,
  Log,
  saveUserData,
  playRecording,
  LogView,
  RoomView,
} from "../../globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";

//For making the stopwatch I got help from geeksforgeeks.org/react-native/create-a-stop-watch-using-react-native/
//https://firebase.google.com/docs/firestore/manage-data/add-data For adding data to Firebase

async function updateProj(project, projectID) {
  try {
    const fbAuth = auth;
    const user = fbAuth.currentUser;

    const projectRef = doc(db, user.email, projectID);
    await updateDoc(projectRef, { ...project });
  } catch (e) {
    console.error(e);
  }
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

  //For starting the stopwatch as soon as the user opens the active screen
  useFocusEffect(
    useCallback(() => {
      startStopWatch();

      return () => {};
    }, []),
  );

  // ###    Saving   ###
  function saveLog(newLog, project) {
    if (project == undefined) {
      console.error("Project undefined");
      return undefined;
    }
    //if there's nothing in the text input just return
    if (newLog.text == "" && logPhoto == "" && recordingURI == "")
      return project;
    try {
      saveLocalLogData(newLog.date);
      setShowModal(false);
    } catch (e) {
      console.error("An error occurred while trying to save", e);
    }
    return project;
  }

  async function saveLocalLogData(date) {
    console.log("Start save locally");
    try {
      let uID = await AsyncStorage.getItem("uid");
      let userData = await AsyncStorage.getItem(uID);
      console.log("userData", userData);

      userData = JSON.parse(userData);

      userData.logs = [
        ...userData.logs,
        {
          id: projectID,
          date: date,
          text: text,
          image: logPhoto,
          recordingURI:
            recordingURI != "" ? await saveToStorage(recordingURI) : "",
        },
      ];

      await saveUserData(uID, JSON.stringify(userData));

      console.log("Local log data:", userData.logs);

      setLogPhoto("");
      setRecordingURI("");
      onChangeText("");
    } catch (e) {
      console.error("Failed to save log locally", e);
    }
  }

  // ###    Camera Section    ###
  const cameraRef = useRef(null);
  const [cameraPermission, setCameraPermission] = useCameraPermissions();

  const [photoMode, enablePhotoMode] = useState(false);
  const [logPhoto, setLogPhoto] = useState("");

  function CameraButton() {
    if (!cameraPermission) {
      return (
        <View>
          <Text>Camera perms loading</Text>
        </View>
      );
    }

    if (!cameraPermission.granted) {
      return (
        <View>
          <Text>
            You must allow the camera to be used! Please press the button below
            for a prompt or enable permissions in your settings.
          </Text>
          <Button title="Allow Camera" onPress={setCameraPermission} />
        </View>
      );
    }

    async function takePhoto() {
      if (cameraRef.current) {
        try {
          const photo = await cameraRef.current.takePictureAsync({
            base64: true,
            quality: 0.25,
          });

          const base64Image = `data:image/jpg;base64,${photo.base64}`;

          setLogPhoto(base64Image);
          enablePhotoMode(false);
        } catch (e) {
          console.error(e);
        }
      }
    }

    return (
      <View style={{ flex: 1, minHeight: 180 }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          {/* https://stackoverflow.com/questions/42398660/how-to-display-emoji-in-react-app */}
          <Text>{`${String.fromCodePoint("0x2193")} Press to take a photo ${String.fromCodePoint("0x2193")}`}</Text>
          <Pressable
            style={{
              height: 300,
              width: 300,
              borderRadius: 20,
              overflow: "hidden",
              backgroundColor: "#656565",
            }}
            onPress={
              photoMode
                ? () => takePhoto()
                : () => enablePhotoMode((current) => !current)
            }
          >
            {photoMode && (
              <CameraView
                ref={cameraRef}
                active={photoMode}
                cameraRatio="1:1"
                style={{ flex: 1 }}
              />
            )}
            {!photoMode && logPhoto == null && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#828282",
                }}
              >
                <Text style={{ width: "60%", textAlign: "center" }}>
                  Press to enable camera
                </Text>
              </View>
            )}
            {!photoMode && logPhoto != "" && (
              <View style={{ flex: 1 }}>
                {/* https://stackoverflow.com/questions/29380265/does-react-native-support-base64-encoded-images */}
                <Image style={{ flex: 1 }} source={{ uri: logPhoto }} />
              </View>
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  // ###    Mic Section    ###
  const [isRecording, setIsRecording] = useState(false);
  const [activeRecording, setActiveRecording] = useState(null);
  const [recordingURI, setRecordingURI] = useState("");

  const [micPermission, setMicPermission] = Audio.usePermissions();

  const audioDirectory = FileSystem.documentDirectory + "audio/";

  function RecordButton() {
    return (
      <Pressable
        style={styles.homeButton}
        onPress={() => setIsRecording(!isRecording)}
      >
        <Text style={styles.btnText}>
          {isRecording ? "Recording..." : "Record Log"}
        </Text>
      </Pressable>
    );
  }

  async function saveToStorage(tempUri) {
    const fileName = `recording-${Date.now()}.m4a`;
    const dirExist = await FileSystem.getInfoAsync(audioDirectory);

    if (!dirExist.exists) {
      await FileSystem.makeDirectoryAsync(audioDirectory, {
        intermediates: true,
      });
    }

    try {
      await FileSystem.copyAsync({
        from: tempUri,
        to: audioDirectory + fileName,
      });
      console.log("Recording saved to", audioDirectory + fileName);
      return audioDirectory + fileName;
    } catch (error) {
      console.error("Failed to save recording", error);
      return "";
    }
  }

  useEffect(() => {
    async function checkMicPerms() {
      if (!micPermission.granted) {
        const { granted } = await setMicPermission();
        if (!granted) {
          Alert.alert("enable mic in settings");
          setIsRecording(false);
          return false;
        }
      }
      return true;
    }

    async function startRecording() {
      try {
        if (checkMicPerms() == false) return;

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
        );
        setActiveRecording(recording);
      } catch (e) {
        console.error(e);
      }
    }

    async function stopRecording() {
      try {
        await activeRecording.stopAndUnloadAsync();

        const toSave = await activeRecording.createNewLoadedSoundAsync();
        const uri = activeRecording.getURI();

        toSave.sound.replayAsync();

        setRecordingURI(uri);

        console.log("Recording URI", uri);

        setActiveRecording(null);
      } catch (e) {
        console.error("Error in stop recording func:", e);
      }
    }

    if (!isRecording && activeRecording == null) return;
    if (!isRecording && activeRecording != null) {
      stopRecording();
      return;
    }

    startRecording();
  }, [isRecording]);

  // ###    End Mic Section   ###

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const fbAuth = auth;
        const user = fbAuth.currentUser;

        const projectRef = doc(db, user.email, projectID);
        const project = await getDoc(projectRef);

        setCurrentProj(project.data());
        console.log("current proj:", project);
      } catch (e) {
        console.error("failed to fetch project", e);
      }
    };
    if (showModal == false) fetchProject();
  }, [showModal]);

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
      project.totalMinutes =
        project.totalMinutes + minutesToAdd - workedMinutes;

      setWorkedMinutes(minutesToAdd);
      // console.log(`minutes to add: ${minutesToAdd}, worked min: ${workedMinutes}`);
      updateProj(project, projectID);

      return project;
    }
  }

  const [endSession, setEndSession] = useState(false);
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
            "Would you like to create a project log?",
            [
              {
                //Yes then it will open the modal using openLogger
                text: "Yes please",
                onPress: () => {
                  setEndSession(true);
                  openLogger();
                },
              },
              {
                //Will send the user back to the project screen, but it will still save how many minutes they worked.
                text: "No thanks!",
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
    <SafeAreaView style={styles.container}>
      <CustomHeader screenName={"...Working"} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <RoomView projectID={projectID} />
          {showModal ? (
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                gap: 20,
                padding: 50,
                backgroundColor: "white",
                borderRadius: 20,
                maxWidth: '90%',
                width: '90%',
                alignSelf:'center',
                alignItems: 'center'
              }}
            >
              <Text style={styles.logHeader}>
                Take an image, record notes and write notes!
              </Text>
              <CameraButton />
              <RecordButton />
              
              <TextInput
                style={[styles.input, { marginBottom: 0 }]}
                placeholder="Today I..."
                value={text}
                onChangeText={onChangeText}
                multiline={true}
                maxLength={240}
              />
              
              <Text
                style={{ maxWidth: "60%", alignSelf: "center", marginTop: 0 }}
              >
                {text.length}/240
              </Text>
              {(isRecording || photoMode) && (
                <Text>
                  Stop recording or finish taking a photo before saving.
                </Text>
              )}

              <Pressable
                style={styles.homeButton}
                onPress={
                  isRecording
                    ? null
                    : () => {
                        setCurrentProj(
                          saveLog(new Log(new Date(), text), currentProject),
                        );
                        if (endSession) navigation.goBack();
                      }
                }
              >
                <Text style={styles.btnText}>
                  {endSession ? "Save and Exit" : "Save"}
                </Text>
              </Pressable>

              <Pressable
                style={styles.homeButton}
                onPress={() => {
                  setShowModal(false);
                  if (endSession) navigation.goBack();
                }}
              >
                <Text style={styles.btnText}>Dismiss</Text>
              </Pressable>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                padding: 20,
                backgroundColor: "white",
                borderRadius: 20,
                width: "90%",
                maxWidth: "90%",
                alignSelf: "center",
                gap: 20,
              }}
            >
              {/*Text to display the stopwatch for the user*/}
              <Text
                style={{
                  fontSize: 24,
                  alignSelf: "center",
                  backgroundColor: "#70a1e4",
                  color: "white",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 20,
                  minWidth: 120,
                  textAlign: "center",
                }}
              >
                {minutesToAdd < 10 ? `0${minutesToAdd}` : minutesToAdd}:
                {time % 60 < 10 ? `0${time % 60}` : time % 60}
              </Text>

              {/*check if the stopwatch is running*/}
              {running ? (
                <View>
                  <Text>Working...</Text>
                  <Pressable onPress={pauseStopWatch} style={styles.homeButton}>
                    <Text style={styles.btnText}>Pause</Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  <Pressable onPress={endStopWatch} style={styles.homeButton}>
                    <Text style={styles.btnText}>End Session</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => openLogger()}
                    style={styles.homeButton}
                  >
                    <Text style={styles.btnText}>Create a Log</Text>
                  </Pressable>
                </>
              )}
              {!running && (
                <TouchableOpacity
                  onPress={resumeStopWatch}
                  style={styles.homeButton}
                >
                  <Text style={styles.btnText}>Resume</Text>
                </TouchableOpacity>
              )}
              <View
                style={{
                  backgroundColor: "#f5edff",
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <Text>Logs</Text>
                <LogView projectID={projectID} autoReload={true} />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* CLOUDS */}
      <View style={[styles.cloud, { top: -50, left: -90 }]}></View>
      <View style={[styles.cloud, { top: -90, left: 50 }]}></View>
      <View style={[styles.cloud, { top: -120, left: 100 }]}></View>
    </SafeAreaView>
  );
}
