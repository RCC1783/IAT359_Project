import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { styles } from '../styles';
import { useNavigation } from '@react-navigation/native';

import { getAuth } from '../firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";

// for this screen i need an await to see if the user is logged in, if they are, send them to home, if not send them to login
// im assuming this is like a splash screen? :O
export default function WelcomeScreen( { route } ) {
    const { user } = route.params;

    const navigation = useNavigation();

    async function checkUser() { // check if the user is logged in
        console.log('hello');
        if (user) {
            navigation.navigate('home');
        console.log('running');
        } else {
            navigation.navigate('login');
                console.log('running2');
        }
    }

    useEffect(() => {
        checkUser();
    }, [user]);

    return(
        <SafeAreaView>
            <Text>~ Welcome! ~</Text>

            <Button title="Are you logged in?" onPress={() => checkUser()}/>
        </SafeAreaView>
    );
}