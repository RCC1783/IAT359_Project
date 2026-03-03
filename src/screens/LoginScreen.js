import { StyleSheet, Text, View, SafeAreaView, Button, TextInput } from 'react-native';

import { useState } from 'react';

import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
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
            alert('User: ' + email + 'successfully signed up.');
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    }

    async function signIn() {
        try {
            const response = await signInWithEmailAndPassword(fbAuth, email, password);

            alert('User: ' + email + ' signed in.');
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    }
 
    return(
        <SafeAreaView styles = {styles.container}>
            <Text>~ Login ~</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                autoCapitalize='none'
            />

            <View style={styles.buttonContainer}>
                <Button title="Sign Up" onPress={signUp} />
            </View>

            <View style={styles.buttonContainer}>
                <Button title="Sign In" onPress={signIn} />
            </View>

            <Button title="Home Screen" onPress={() => navigation.navigate("home")}/>
        </SafeAreaView>
    );
}
