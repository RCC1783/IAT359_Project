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
        <SafeAreaView style = {[styles.container, {justifyContent: 'center'}]}>
            <Text style = {styles.headerText}>Log In</Text>

            <TextInput
                style = {styles.input}
                placeholder="Email"
                placeholderTextColor={'#D95635'}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />

            <TextInput
                style = {styles.input}
                placeholder="Password"
                placeholderTextColor={'#D95635'}
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                autoCapitalize='none'
            />

            <Pressable style = {styles.homeButton} onPress={signIn}>
                <Text style = {styles.btnText}>Sign In</Text>
            </Pressable>

            <Text>Don't have an account?</Text>
            <Pressable style = {[styles.homeButton, { backgroundColor: "#5A53BF" }]} onPress={signUp}>
                <Text style = {styles.btnText}>Sign Up</Text>
            </Pressable>

            {/* CLOUDS */}
            <View style = {[styles.cloud, {width: 175, height: 175, top: -100, left: 25, zIndex: 0, backgroundColor: '#B6BCFB'}]}></View>
            <View style = {[styles.cloud, {width: 175, height: 175, top: -150, left: 150, zIndex: 0, backgroundColor: '#B6BCFB'}]}></View>
            <View style = {[styles.cloud, {top: -50, left: -50}]}></View>
            <View style = {[styles.cloud, {top: -120, left: 80}]}></View>
            <View style = {[styles.cloud, {width: 200, top: -165, left: 205}]}></View>

            <View style = {[styles.cloud, {bottom: -70, right: 10, width: 175, height: 175, borderRadius: 175, zIndex: 0, backgroundColor: '#B6BCFB'}]}></View>
            <View style = {[styles.cloud, {bottom: -100, right: -150, width: 300, height: 300, borderRadius: 150}]}></View>
            <View style = {[styles.cloud, {bottom: -120, right: 50, width: 250, height: 250, borderRadius: 125}]}></View>
        </SafeAreaView>
    );
}
