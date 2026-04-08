import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import {
  and,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { styles } from "../styles";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../firebaseConfig";
import { FlatList } from "react-native";
import { CustomHeader, LogView, RoomView, saveUserData } from "../../globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";

async function updateProj(project, projectID) {
  try {
    const fbAuth = auth;
    const user = fbAuth.currentUser;
    const projectRef = doc(db, user.email, projectID);
    await updateDoc(projectRef, {
      ...project,
    });
  } catch (e) {
    console.error(e);
  }
}

async function deleteProject(projectID, navigation) {
  // Delete local project info
  try {
    let uID = await AsyncStorage.getItem("uid");
    let userData = await AsyncStorage.getItem(uID);

    userData = JSON.parse(userData);

    // Create a new array that excludes logs associated with the project being deleted
    const projectLogs = userData.logs.filter((log) => {
      // Delete any recordings associated with the project if there are any now to prevent any data leaks
      if (log.id == projectID && log.recordingURI != "") {
        if (!deleteRecording(log.recordingURI)) throw Error("FAILED");
      }
      return log.id != projectID;
    });

    // Overwrite the logs in the userData to no longer include any from the deleted project.
    // NOTE: Since images are saved in a txt format we do not have to explicitly delete them.
    userData.logs = projectLogs;
    await saveUserData(uID, JSON.stringify(userData));
  } catch (e) {
    console.error("Failed to delete local project data", e);
    return;
  }

  // Delete project from firebase
  const fbAuth = auth;
  const user = fbAuth.currentUser;
  try {
    const projectRef = doc(db, user.email, projectID);
    deleteDoc(projectRef);
  } catch (e) {
    console.error("Failed to delete project from firebase.", e);
  }

  navigation.navigate("home");
}

async function deleteRecording(recording) {
  try {
    await FileSystem.deleteAsync(recording, { idempotent: true });
    console.log("Deleted recording");
    return true;
  } catch (error) {
    console.error("Failed to delete recording", error);
    return false;
  }
}

export default function SelectedProjectScreen({ route }) {
  const { projectID } = route.params;
  const navigation = useNavigation();

  const [currentProject, setCurrentProj] = useState();

  const [roomEditorOpen, setRoomEditorOpen] = useState(false);

  const fetchProject = async () => {
    try {
      const fbAuth = auth;
      const user = fbAuth.currentUser;

      const projectRef = doc(db, user.email, projectID);
      const project = await getDoc(projectRef);

      setCurrentProj(project.data());
    } catch (e) {
      console.error("Failed to fetch project", e);
    }
  };

  function editRoomSetup(type, item) {
    switch (type) {
      case "wallpaper": {
        currentProject.roomSetup.wallpaper = item;
        break;
      }
      case "flooring": {
        currentProject.roomSetup.flooring = item;
      }
    }

    updateProj(currentProject, projectID);

    // fetchProject();
  }

  useEffect(() => {
    fetchProject();
  }, [roomEditorOpen]);

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        screenName={
          currentProject != undefined ? currentProject.name : "Loading"
        }
        navigation={navigation}
      ></CustomHeader>

      <ScrollView
        style={{ width: "90%", alignSelf: "center" }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {roomEditorOpen && (
          <View style={[styles.popupView, { backgroundColor: "#623be343" }]}>
            <Text
              style={{
                textDecorationLine: "underline",
                fontSize: 18,
                fontWeight: "bold",
                color: "white",
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              Walls
            </Text>
            <FlatList
              data={
                currentProject != undefined
                  ? currentProject.ownedItems.filter((item) => {
                      return item.type == "wallpaper";
                    })
                  : null
              }
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#ba53bf",
                    maxWidth: "100%",
                    padding: 10,
                    margin: 5,
                    borderRadius: 10,
                  }}
                  onPress={() => editRoomSetup("wallpaper", item)}
                >
                  <Text style={styles.btnText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              horizontal={true}
            />
            <Text
              style={{
                textDecorationLine: "underline",
                fontSize: 18,
                fontWeight: "bold",
                color: "white",
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              Floors
            </Text>
            <FlatList
              data={
                currentProject != undefined
                  ? currentProject.ownedItems.filter((item) => {
                      return item.type == "flooring";
                    })
                  : null
              }
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#ba53bf",
                    maxWidth: "100%",
                    padding: 10,
                    margin: 5,
                    borderRadius: 10,
                  }}
                  onPress={() => editRoomSetup("flooring", item)}
                >
                  <Text style={styles.btnText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              horizontal={true}
            />
            <TouchableOpacity
              style={[styles.homeButton, { backgroundColor: "#5A53BF" }]}
              onPress={() => setRoomEditorOpen(false)}
            >
              <Text style={styles.btnText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        <RoomView projectID={projectID} autoReload={true} />

        <View
          style={{
            flex: 1,
            padding: 20,
            backgroundColor: "white",
            borderRadius: 20,
          }}
        >
          <Pressable
            style={styles.homeButton}
            onPress={() =>
              navigation.navigate("active", { projectID: projectID })
            }
          >
            <Text style={styles.btnText}>Start Working</Text>
          </Pressable>

          <Pressable
            style={styles.homeButton}
            onPress={() => setRoomEditorOpen(true)}
          >
            <Text style={styles.btnText}>Edit Room</Text>
          </Pressable>

          <Pressable
            style={styles.homeButton}
            onPress={() =>
              navigation.navigate("shop", { projectID: projectID })
            }
          >
            <Text style={styles.btnText}>Shop</Text>
          </Pressable>

          <View
            style={{
              backgroundColor: "#f5edff",
              padding: 10,
              borderRadius: 10,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <Text>Logs</Text>
            <LogView projectID={projectID} />
          </View>

          <Pressable
            style={[styles.homeButton, { backgroundColor: "red" }]}
            onPress={() =>
              Alert.alert(
                "Are you sure you want to delete this project",
                "There is no restoring it once deleted",
                [
                  {
                    text: "Delete",
                    onPress: () => deleteProject(projectID, navigation),
                  },
                  {
                    text: "Nevermind",
                  },
                ],
              )
            }
          >
            <Text style={styles.btnText}>Delete Project</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* CLOUDS */}
      <View style={[styles.cloud, { top: -50, right: -50 }]}></View>
      <View style={[styles.cloud, { top: -50, right: 50 }]}></View>
      <View style={[styles.cloud, { top: -120, right: 100 }]}></View>
    </SafeAreaView>
  );
}
