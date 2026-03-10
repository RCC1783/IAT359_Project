import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native';
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { styles } from '../styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";

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

            console.log(savedUID);
            console.log(allUsers);

            if (savedUID) {
                if (allUsers.includes(savedUID)) {
                    console.log("User is logged in, navigating to home screen: ", savedUID);
                    navigation.navigate('home');
                } else {
                    console.log("User ID doesn't exist in Firebase, clearing uid in storage. LOGIN AGAIN !")
                    AsyncStorage.removeItem('uid');
                    navigation.navigate('login');
                }
            } else {
                navigation.navigate('login');
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    useEffect(() => {
        checkUser();
    }, []);

    return(
        <SafeAreaView>
            <Text style = {styles.headerText}>~ Welcome! ~</Text>

            <Pressable style = {[styles.homeButton, styles.androidBoxShdw, styles.boxShadow]} onPress={() => checkUser()}>
                <Text style = {styles.btnText}>Logged in?</Text>
            </Pressable>
        </SafeAreaView>
    );
}