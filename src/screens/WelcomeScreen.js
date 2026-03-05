import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { styles } from '../styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";

// for this screen i need an await to see if the user is logged in, if they are, send them to home, if not send them to login
// im assuming this is like a splash screen? :O
export default function WelcomeScreen() {
    const navigation = useNavigation();

    async function checkUser() { // check if the user is logged in
        try {
            const curUserID = await AsyncStorage.getItem('uid');
            console.log(curUserID);
            if (curUserID) {
                console.log('found user: ', curUserID)
                navigation.navigate('home');
            console.log('running');
            } else {
                navigation.navigate('login');
            }
        } catch (error) {
            console.log('Error checking for user: ', error);
        }
    }

    useEffect(() => {
        checkUser();
    }, []);

    return(
        <SafeAreaView>
            <Text>~ Welcome! ~</Text>

            <Button title="Are you logged in?" onPress={() => checkUser()}/>
        </SafeAreaView>
    );
}