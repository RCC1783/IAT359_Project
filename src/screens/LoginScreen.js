import { StyleSheet, Text, View, SafeAreaView, Button, TextInput, Pressable } from 'react-native';
import { doc, setDoc } from "firebase/firestore";
import { useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

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

            await AsyncStorage.setItem('uid', JSON.stringify(response.user.uid));
            const docRef = await setDoc(doc(db, 'users', response.user.uid), {
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
        try {
            const response = await signInWithEmailAndPassword(fbAuth, email, password);

            alert('User: ' + email + ' signed in.');
            await AsyncStorage.setItem('uid', JSON.stringify(response.user.uid));
            navigation.navigate('home');  
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    }
 
    return (
        <SafeAreaView styles = {styles.container}>
            <Text>~ Login ~</Text>

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
