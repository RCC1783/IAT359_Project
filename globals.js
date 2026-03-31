import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity, Pressable, FlatList, Alert } from 'react-native';
import { styles } from "./src/styles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import * as FileSystem from 'expo-file-system/legacy';
import { Audio } from "expo-av";


export const CustomHeader =({screenName, navigation}) => {
    if(navigation != null){ 
        return(
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', maxHeight: 50, minHeight: 55, minWidth: "100%"}}>
                <Pressable onPress={() => navigation.goBack()} style={{margin: 10}}>
                    <Text style={{paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, fontSize: 22, backgroundColor: '#5A53BF', color: '#FFF', textAlignVertical:"top" }}>{'<'}</Text>
                </Pressable>
                <Text style={{color: "#FFFF", backgroundColor: '#5A53BF', paddingLeft: 50, paddingRight: 30, paddingTop: 7, paddingBottom: 10, borderTopStartRadius: 10, borderBottomStartRadius: 30, textAlignVertical: 'top', textAlign:'right', fontSize: 18, fontWeight: 'bold'}}>{screenName}</Text>
            </View>
        );
    } else{
        return(
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems:'center', height: 'fit-content', minHeight: 55}}>
                <Text style={{color: "#FFFF", backgroundColor: '#5A53BF', borderRadius: 10, paddingLeft: 35, paddingRight: 15, paddingTop: 7, paddingBottom: 10, borderTopStartRadius: 10, borderBottomStartRadius: 30, textAlignVertical: 'top', textAlign:'right', fontSize: 18, fontWeight: 'bold'}}>{screenName}</Text>
            </View>
        );
    }
}

//Class for storing/making a new log that will then get updated to the firebase data
export class Log {
  date = "";
  text = "";
  constructor(date, text = "") {
    this.date = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    this.text = text;
  }
}

// Ended up not really being super useful since stringify causes it to loose its type
export class UserData{
    //don't need a key at the top since the uID is the key for local storage
    logs = [/* {id: projectID, date: sdfsd, image: sfds, recordingURI: recordingURI} */];
    refImages = [];
}

export async function saveUserData(uID, newUserData){
    try{
        await AsyncStorage.setItem(uID, newUserData);
        console.log("Succ");
        return 1;
    } catch (e){
        console.error("Failed to save user data")
        return -1;
    }
}

export function ProjectDetails({projectID, projectName}){
    const [logData, setLogData] = useState(null);
    useEffect(() => {
        async function getMatchingLocalLog() {
            try {
                let uid = await AsyncStorage.getItem('uid');
                let userData = await AsyncStorage.getItem(uid);
                userData = JSON.parse(userData);
                if(userData == undefined){
                    console.error("UD is undefined");
                    return;
                }
                let log = userData.logs.filter((log) => {
                    return log.id == projectID;
                });
                setLogData(log[log.length - 1]);
            } catch (error) {
                console.error("Failed to get matching local log",e);
            }
        }
        getMatchingLocalLog();
    }, [])

    return(
        <View>
            {logData == null && (
                <View style={{flex: 1, flexDirection: "row", gap: 20}}>
                    {/* <Text>{logData.date}</Text> */}
                    <View style={{width: 100, height: 100, backgroundColor: "white"}}/>
                    <View>
                        <Text>{projectName}</Text>
                        <Text>No recent logs saved on device</Text>
                    </View>
                </View>
            )}
            {logData != null && (
                <View style={{flex: 1, flexDirection: "row", gap: 20}}>
                    {/* <Text>{logData.date}</Text> */}
                    {logData.image != '' ? (<Image style={{width: 100, height: 100}} source={{uri: logData.image}}/>) : (<View style={{width: 100, height: 100, backgroundColor:"white"}}></View>)}
                    <View>
                        <Text>{projectName}</Text>
                        <Text>{logData.date}</Text>
                        <Text>{logData.text}</Text>
                    </View>
                </View>
            )}
        </View>
    );
}

export function RoomView(){
    const [currentProject, setCurrentProj] = useState();
    useEffect(() => {
        const fetchProject = async() => {
            try{
                const fbAuth = auth;
                const user = fbAuth.currentUser;

                const projectRef = doc(db, user.email, projectID);
                const project = await getDoc(projectRef);
                
                setCurrentProj(project.data());
                console.log("current proj:", project);
            } catch (e){
                console.error("Failed to fetch project", e);
            }
        }
        fetchProject();
    }, [updator]);

    return(
        <View style={styles.roomContainer}>
            <Text>{currentProject != undefined ? currentProject.roomSetup.flooring.imgSrc : "Loading"}</Text>
            <Image 
                style={styles.roomImage}
                source={currentProject != undefined ? currentProject.roomSetup.wallpaper.imgSrc : null}/>
            <Image 
                style={styles.roomImage}
                source={currentProject != undefined ? currentProject.roomSetup.flooring.imgSrc : null}/>
            
        </View>
    )
}

export async function playRecording(uri){
    try{
        const data = await Audio.Sound.createAsync({uri: uri});
        console.log("data: ",data);
        data.sound.replayAsync();
    } catch (e){
        console.error("Failed to play audio", e);
    }
}

async function deleteLog(log){
    try{
        if(log.recordingURI != '') await FileSystem.deleteAsync(log.recordingURI, {idempotent: true});

        const uid = await AsyncStorage.getItem('uid');
        let userData = await AsyncStorage.getItem(uid);
        userData = JSON.parse(userData);

        const newLogArray = userData.logs.filter((l) => {
            return !(l.id == log.id && l.date == log.date);
        });

        userData.logs = newLogArray;
        await saveUserData(uid, JSON.stringify(userData));
        console.log("Deleted log");
    }catch (e){
        console.error("Failed to delete log.", e);
    }
}

export function LogView({projectID}){
    const [projectLogs, setProjectLogs] = useState([]);
    useEffect(() => {
        const fetchLogs = async () =>  {
            try{
                const uid = await AsyncStorage.getItem('uid');
                let userData = await AsyncStorage.getItem(uid);
                userData = JSON.parse(userData);

                const logs = userData.logs.filter((log) => {
                    return log.id === projectID;
                })
                setProjectLogs(logs);
            }catch (e){
                console.error("failed getting project logs:", e);
            }
        }
        fetchLogs();
    },[])
    return(
        <View style={{flex:1, minHeight: 100, margin: 20}}>
            <FlatList
                // https://medium.com/@bhagwat12rawat/how-to-invert-and-reverse-a-flatlist-in-react-native-20c3be76b16
                data={projectLogs.slice().reverse()}
                keyExtractor={item => item.date}
                renderItem={({item}) => (
                    <View style={{flex: 1, flexDirection: "row", gap: 10, marginRight: 20}}>
                        {item.image != '' ? (<Image 
                            style={{width: 100, height: 100, backgroundColor: "#656565"}}
                            source={{uri: item.image}}/>) : (<View style={{width:100, height:100, backgroundColor:"white"}}/>)}
                        <View>
                            <Text>{item.date}</Text>
                            <Text>{item.text}</Text>
                            {item.recordingURI != '' && (
                            <Pressable onPress={() => playRecording(item.recordingURI)}>
                                <Text>Play</Text>
                            </Pressable>
                            )}
                            <Pressable onPress={() => Alert.alert("Delete log?", "Deleted logs cannot be restored", [
                                {
                                    text: "Delete",
                                    onPress: () => deleteLog(item)
                                },
                                {
                                    text: "Nevermind"
                                }
                            ])}>
                                <Text style={{color:"red"}}>Delete</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
                horizontal
                
            />
        </View>
    )
}