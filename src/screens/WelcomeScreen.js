import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { styles } from '../styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import { UserData } from '../../globals';

// for this screen i need an await to see if the user is logged in, if they are, send them to home, if not send them to login
// im assuming this is like a splash screen? :O
export default function WelcomeScreen() {
    const fbAuth = auth;

    const navigation = useNavigation();

    async function checkUser() { // check if the user is logged in
        try {
            const savedUID = await AsyncStorage.getItem('uid');
            const querySnapshot = await getDocs(collection(db, 'users'));
            let allUsers = [];
            querySnapshot.forEach((doc) => {
                allUsers.push(JSON.stringify(doc.id));
            })

            console.log("Saved UID:", savedUID);

            if (savedUID) {
                if (allUsers.includes(savedUID)) {
                    console.log("User is logged in, navigating to home screen: ", savedUID);

                    let userData = null;
                    try {
                        userData = await AsyncStorage.getItem(savedUID);
                        if (userData != null) {
                            console.log("user data found");
                        } else {
                            console.log("User data not found, creating it now");
                            await AsyncStorage.setItem(savedUID, JSON.stringify(new UserData));
                        }

                    } catch (error) {
                        console.error(error.message);
                    }

                    navigation.navigate('home');
                } else {
                    console.log("User ID doesn't exist in Firebase, clearing uid in storage. LOGIN AGAIN !")
                    AsyncStorage.removeItem('uid');
                    navigation.navigate('login');
                }
            } else {
                return navigation.navigate('login');
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }

        try {
            const savedUID = await AsyncStorage.getItem('uid');
            let userData = await AsyncStorage.getItem(savedUID);

            userData = JSON.parse(userData);

            if (!userData) {
                userData = new UserData;
                await AsyncStorage.setItem(savedUID, JSON.stringify(userData));
            } else {
                console.log("user data found:", userData);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        checkUser();
    }, []);

    return(
        <SafeAreaView style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDDEFF'}}>
            <Text style = {styles.headerText}>Welcome!</Text>

            <Pressable onPress={() => checkUser()}>
                <Text style = {styles.btnText}>Check User</Text>
                {/* walls  */}
                    <View style = {[styles.smallHome, { zIndex: -1 ,top: 140, left: 35, transform: [{ rotateX: '-25deg'}, { rotateY: '-45deg'}, { rotateZ: '0deg' }], backgroundColor: '#5A53BF' }]}></View>
                    <View style = {[styles.smallHome, { zIndex: -1, top: 41, right: 35, transform: [{ rotateX: '25deg'}, { rotateY: '-45deg'}, { rotateZ: '0deg' }], backgroundColor: '#B6BCFB' }]}></View>
                {/* walls  */}

                <View style = {[styles.smallHome, { backgroundColor: '#D95635' }]}></View>
            </Pressable>

            <View style = {[styles.cloud, {top: -100, right: -20, zIndex: 1, backgroundColor: '#B6BCFB'}]}></View>
            <View style = {[styles.cloud, {top: -50, right: -50}]}></View>
            <View style = {[styles.cloud, {top: -120, right: 80}]}></View>

            <View style = {[styles.cloud, {bottom: -50, left: -100, width: 200, height: 175, borderRadius: 175, zIndex: 1, backgroundColor: '#B6BCFB'}]}></View>
            <View style = {[styles.cloud, {bottom: -100, left: -150, width: 300, height: 300, borderRadius: 150}]}></View>
            <View style = {[styles.cloud, {bottom: -120, left: 50, width: 250, height: 250, borderRadius: 125}]}></View>
        </SafeAreaView>
    );
}