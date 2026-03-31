import { StyleSheet, Text, View, SafeAreaView, Button, Switch, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { CustomHeader, saveUserData, UserData } from '../../globals';
import * as FileSystem from 'expo-file-system/legacy';

export default function SettingsScreen() {
    const [testSetting, setTestSetting] = useState(false);
    const fbAuth = auth;
    const user = fbAuth.currentUser;

    const saveSettings = async () => {
        try {
            await AsyncStorage.setItem('test', JSON.stringify(testSetting));
        } catch (error) {
        console.error('Error saving settings: ', error);
        }
    };

    const loadSettings = async() => {
        try {
            const savedTest = await AsyncStorage.getItem('test');

            if (savedTest !== null) setTestSetting(JSON.parse(savedTest));
        } catch (error) {
            console.error('Error loading settings: ', error);
        }
    };

    async function signOut() {
        try {
            await AsyncStorage.removeItem('uid');

            alert('User signed out.');
            navigation.navigate('welcome');  
        } catch (error) {
            console.error('error signing out', error);
        }
    }

    async function deleteUserData() {
        try{
            let uid = await AsyncStorage.getItem('uid');
            await AsyncStorage.setItem(uid, JSON.stringify(new UserData))
            console.log("Cleared user data");
        } catch (e){
            console.error("Failed to delete userData", e);
        }

        try {
            const audioDirectory = FileSystem.documentDirectory + 'audio/';
            const audioFiles = await FileSystem.readDirectoryAsync(audioDirectory);
            await Promise.all(audioFiles.map((fileName) => {
                FileSystem.deleteAsync(audioDirectory + fileName, { idempotent: true })
            }));
            
            console.log('All recordings deleted');

        } catch (error) {
            console.error('Failed to delete recordings', error);
        }
    }

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        saveSettings();
    }, [testSetting]);

    const navigation = useNavigation();
    return(
        <SafeAreaView style = {[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
            <CustomHeader screenName={"Settings"} navigation={navigation}/>
            <Text style = {styles.headerText}>Settings</Text>

            <Text style = {[styles.btnText, { color: 'black' }]}>{ user ? `Logged in as: ${user.email}` : 'Not Loogged in... how...?'}</Text>

            <Text></Text>

            <View style = {styles.setSwitch}>
                <Text>TEST SETTING</Text>
                <Switch value = {testSetting} onValueChange = {setTestSetting}/>
            </View>
            <Pressable style = {styles.homeButton} onPress = {signOut}>
                <Text style = {styles.btnText}>Sign Out</Text>
            </Pressable> 

            <Pressable style = {styles.homeButton} onPress = {saveSettings}>
                <Text style = {styles.btnText}>SAVE SETTINGS</Text>
            </Pressable>  

            <Pressable style = {[styles.homeButton, { backgroundColor: 'red' }]} onPress = {deleteUserData}>
                <Text style = {styles.btnText}>DELETE LOCAL USER DATA</Text>
            </Pressable>  
        </SafeAreaView>
    );
}