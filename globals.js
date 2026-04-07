import { StyleSheet, Text, View, Button, Image, TouchableOpacity, Pressable, FlatList, Alert, ScrollView } from 'react-native';
import * as React from 'react';
import { styles } from "./src/styles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {db, auth} from './src/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import * as FileSystem from 'expo-file-system/legacy';
import { Audio } from "expo-av";
import { useFocusEffect } from '@react-navigation/native';


export const CustomHeader =({screenName, navigation}) => {
    if(navigation != null){ 
        return(
            <View style={styles.navHeader}>
                <Pressable onPress={() => navigation.goBack()} style={{margin: 10}}>
                    <Text style={styles.backButton}>{'<'}</Text>
                </Pressable>
                <Text style={styles.screenName}>{screenName}</Text>
            </View>
        );
    } else{
        return(
            <View style={[styles.navHeader, {justifyContent:"flex-end"}]}>
                <Text style={styles.screenName}>{screenName}</Text>
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
                        <Text style = {styles.projHeader}>{projectName}</Text>
                        <Text style = {styles.projNote}>No recent logs saved on device</Text>
                    </View>
                </View>
            )}
            {logData != null && (
                <View style={{flex: 1, flexDirection: "row", gap: 20}}>
                    {/* <Text>{logData.date}</Text> */}
                    {logData.image != '' ? (<Image style={{width: 100, height: 100}} source={{uri: logData.image}}/>) : (<View style={{width: 100, height: 100, backgroundColor:"white"}}></View>)}
                    <View style = {{marginBottom: 10}}>
                        <Text style = {styles.projHeader}>{projectName}</Text>
                        <View style = {{backgroundColor: '#5A53BF', padding: 5, borderRadius: 10}}>
                            <Text style = {[styles.projSubtitle, {marginBottom: 5}]}>{logData.date}</Text>
                            <Text style = {styles.projNote}>{logData.text}</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

export function RoomView({projectID, autoReload = false}){
    if(projectID == null) return;
    const [currentProject, setCurrentProj] = useState();
    
    const fetchProject = async() => {
        try{
            const fbAuth = auth;
            const user = fbAuth.currentUser;

            const projectRef = doc(db, user.email, projectID);
            const project = await getDoc(projectRef);
            
            setCurrentProj(project.data());
            // console.log("Updated room view");
        } catch (e){
            console.error("Failed to fetch project", e);
        }
    }

    // https://reactnavigation.org/docs/function-after-focusing-screen/#triggering-an-action-with-a-focus-event-listener
    useFocusEffect(
        React.useCallback(() => {
        fetchProject();
        const interval = setInterval(() => {
            if(autoReload) fetchProject();
        }, 6000);
        return () => clearInterval(interval);
        }, [])
    );

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

export function LogView({projectID, autoReload = false}){
    const [projectLogs, setProjectLogs] = useState([]);

    const fetchLogs = async () =>  {
        try{
            const uid = await AsyncStorage.getItem('uid');
            let userData = await AsyncStorage.getItem(uid);
            userData = JSON.parse(userData);

            const logs = userData.logs.filter((log) => {
                return log.id === projectID;
            })
            setProjectLogs(logs);
            // console.log("Fetched logs");
        }catch (e){
            console.error("failed getting project logs:", e);
        }
    }

    // https://reactnavigation.org/docs/function-after-focusing-screen/#triggering-an-action-with-a-focus-event-listener
    useFocusEffect(
        React.useCallback(() => {
        fetchLogs();
        const interval = setInterval(() => {
            if(autoReload) fetchLogs();
        }, 1000);
        return () => clearInterval(interval);
        }, [])
    );

    // setInterval(fetchLogs, 6100);
    return(
        <View style={{flex:1, minHeight: 100, margin: 20}}>
            <FlatList
                // https://medium.com/@bhagwat12rawat/how-to-invert-and-reverse-a-flatlist-in-react-native-20c3be76b16
                data={projectLogs.slice().reverse()}
                keyExtractor={item => item.date}
                renderItem={({item}) => (
                    <View style={{flex: 1, flexDirection: "row", gap: 20, marginRight: 10, width: 270, padding: 15, borderRadius: 20, backgroundColor:"#5A53BF"}}>
                        {item.image != '' ? (<Image 
                            style={{width: 100, height: 100, backgroundColor: "#656565"}}
                            source={{uri: item.image}}/>) : (<View style={{width:100, height:100, backgroundColor:"#656565"}}/>)}
                        <View style={{width:'80%', maxHeight: 100}}>
                            <Text style={{color:'white'}}>{item.date}</Text>
                            <ScrollView style={{maxWidth:110}} nestedScrollEnabled={true}>
                                <Text style={{color:'white'}}>{item.text}</Text>
                            </ScrollView>
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