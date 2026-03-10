import { StyleSheet, Text, View, SafeAreaView, Button, Pressable, ImageBackground } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const navigation = useNavigation();
    return(
        <SafeAreaView>
            <Text style = {styles.btnText}>~ Welcome! ~</Text>
            {/*<Pressable style = {[styles.homeButton, styles.androidBoxShdw, styles.boxShadow]} onPress={() => navigation.navigate('shop')}>
                <Text style = {styles.btnText}>Shop</Text>
            </Pressable> */}

            <Pressable style = {[styles.homeButton, styles.androidBoxShdw, styles.boxShadow]} onPress={() => navigation.navigate('projects')}>
                <Text style = {styles.btnText}>Projects</Text>
            </Pressable>

            <Pressable style = {[styles.homeButton, styles.androidBoxShdw, styles.boxShadow]} onPress={() => navigation.navigate('home')}>
                <Text style = {styles.btnText}>Home</Text>
            </Pressable>

            <Pressable style = {[styles.homeButton, styles.androidBoxShdw, styles.boxShadow]} onPress={() => navigation.navigate('settings')}>
                <Text style = {styles.btnText}>Settings</Text>
            </Pressable>

            <Pressable onPress={() => navigation.navigate('allImages')}>
                <Text>Image Gallery</Text>
            </Pressable>
        </SafeAreaView>
    );
}