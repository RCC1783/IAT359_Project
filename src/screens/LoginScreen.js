import { StyleSheet, Text, View, SafeAreaView, Button, TextInput, Pressable } from 'react-native';
import { doc, setDoc } from "firebase/firestore";
import { useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { UserData } from '../../globals';

export default function LoginScreen({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const fbAuth = auth;

    async function signUp() {
        try {
            const response = await createUserWithEmailAndPassword(
                fbAuth,
                email,
                password,
            );

            console.log(response);

            let uid = JSON.stringify(response.user.uid);
            await AsyncStorage.setItem('uid', uid);
            await AsyncStorage.setItem(uid, JSON.stringify(new UserData));
            const docRef = await setDoc(doc(db, 'users', uid), {
                email: email,
            });
            alert('User: ' + email + 'successfully signed up.');
            navigation.navigate('home');            
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    }

    async function signIn() {
        let uid = null;
        try {
            const response = await signInWithEmailAndPassword(fbAuth, email, password);
            uid = JSON.stringify(response.user.uid);

            alert('User: ' + email + ' signed in.');
            await AsyncStorage.setItem('uid', uid);
            navigation.navigate('home');  

            let userData = null;
            try {
                userData = await AsyncStorage.getItem(uid);
                if(userData != null) {
                    console.log("user data found:", userData);
                    return;
                }

                console.log("User data not found, creating it now");
                await AsyncStorage.setItem(uid, JSON.stringify(new UserData));

            } catch (error) {
                console.log(error.message);
            }

        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
        
    }
 
    return (
        <SafeAreaView styles = {styles.container}>
            <Text style = {styles.headerText}>~ Login ~</Text>

            <TextInput
                style = {styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />

            <TextInput
                style = {styles.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                autoCapitalize='none'
            />

            <Pressable style = {[styles.homeButton, styles.androidBoxShdw, styles.boxShadow]} onPress={signUp}>
                <Text style = {styles.btnText}>Sign Up</Text>
            </Pressable>

            <Pressable style = {[styles.homeButton, styles.androidBoxShdw, styles.boxShadow]} onPress={signIn}>
                <Text style = {styles.btnText}>Sign In</Text>
            </Pressable>
        </SafeAreaView>
    );
}
