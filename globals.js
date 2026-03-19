import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity, Pressable } from 'react-native';
import { styles } from "./src/styles";
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  img = 0;
  recordingURI = '';
  constructor(date, text = "", recordingURI = '') {
    this.date = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    this.text = text;
    this.recordingURI = recordingURI;
  }
}

// Ended up not really being super useful since stringify causes it to loose its type
export class UserData{
    //don't need a key at the top since the uID is the key for local storage
    logs = [];
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