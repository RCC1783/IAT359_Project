import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity, Pressable } from 'react-native';
import { styles } from "./src/styles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
// export const 


export const CustomHeader =({screenName, navigation}) => {
    if(navigation != null){ 
        return(
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', height: 'fit-content', minHeight: 55}}>
                <Pressable onPress={() => navigation.goBack()} style={{margin: 10}}>
                    <Text style={{paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, fontSize: 22, backgroundColor: '#ad6794', color: '#FFF', textAlignVertical:"top" }}>{'<-'}</Text>
                </Pressable>
                <Text style={{color: "#FFFF", backgroundColor: '#ad6794', paddingLeft: 35, paddingRight: 15, paddingTop: 7, paddingBottom: 10, borderTopStartRadius: 10, borderBottomStartRadius: 30, textAlignVertical: 'top', textAlign:'right', fontSize: 18, fontWeight: 'bold'}}>{screenName}</Text>
            </View>
        );
    } else{
        return(
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems:'center', height: 'fit-content', minHeight: 55}}>
                <Text style={{color: "#FFFF", backgroundColor: '#ad6794', paddingLeft: 35, paddingRight: 15, paddingTop: 7, paddingBottom: 10, borderTopStartRadius: 10, borderBottomStartRadius: 30, textAlignVertical: 'top', textAlign:'right', fontSize: 18, fontWeight: 'bold'}}>{screenName}</Text>
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
    logs = [/* {id: projectID, date: sdfsd, image: } */];
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
                    <Image style={{width: 100, height: 100}} source={{uri: logData.image}}/>
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