import { StyleSheet, Text, View, SafeAreaView, Button, Pressable, ImageBackground, Image } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';

export default function HomeScreen() {
    const navigation = useNavigation();
    const fbAuth = auth;
    const user = fbAuth.currentUser;

    return(
        <SafeAreaView style={{ zIndex: -1, flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDDEFF'}}>
            <Text style = {[styles.headerText, {alignSelf: 'flex-start', fontSize: 24}]}>    Welcome! {user ? `${user.email}` : 'Not Loogged in... how...?'}</Text>

            <Pressable style = {[styles.homeButton, { flexDirection: 'row', alignItems: 'center', backgroundColor: "#5A53BF" }]} onPress={() => navigation.navigate('projects')}>
                <Image style = {{ margin: 5, left: -75, width: 50, height: 50 }} source = {require('../images/home/phBlock.png')} />
                <Text style = {[styles.btnText, { left: -25, textAlign: 'center'}]}>Projects</Text>
            </Pressable>

            <Pressable style = {[styles.homeButton, { flexDirection: 'row', alignItems: 'center', backgroundColor: "#5A53BF" }]} onPress={() => navigation.navigate('allImages')}>
                <Image style = {{ margin: 5, left: -83, width: 50, height: 50 }} source = {require('../images/home/phBlock.png')} />
                <Text style = {[styles.btnText, { left: -28, textAlign: 'center'}]}>Images</Text>
            </Pressable>

            <Pressable style = {[styles.homeButton]} onPress={() => navigation.navigate('settings')}>
                <Text style = {styles.btnText}>Settings</Text>
            </Pressable>

            <Pressable style = {[styles.homeButton, styles.androidBoxShdw, styles.boxShadow]} onPress={() => navigation.navigate('micTest')}>
                <Text style = {styles.btnText}>Microphone Test</Text>
            </Pressable>

            <View>
                <Text style = {[styles.headerText, { fontSize: 20, alignSelf: 'flex-start'}]}>Jump back in!</Text>
                <View></View>
            </View>

            <Pressable style={[styles.homeButton, { margin: 5 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.headerText, { color: 'white', fontSize: 18, textAlign: 'center', textTransform: 'none'}]}>Title</Text>
                    <Text style={[styles.btnText, { fontSize: 14, textTransform: 'none' }]}>Time</Text>
                </View>
                <View style={{ alignSelf: 'center' }}>
                    <Image style={{ margin: 5, width: 270, height: 150 }} source={require('../images/home/phBlock.png')} />
                </View>
                <View>
                    <Text style={[styles.btnText, { textAlign: 'left' }]}>Note</Text>
                </View>
            </Pressable>

            {/* CLOUDS */}
            <View style = {[styles.cloud, {zIndex: -1, top: -100, right: -20, backgroundColor: '#B6BCFB'}]}></View>
            <View style = {[styles.cloud, {zIndex: -2, top: -50, right: -50}]}></View>
            <View style = {[styles.cloud, {zIndex: -2, top: -120, right: 80}]}></View>

            <View style = {[styles.cloud, {zIndex: -1, bottom: -50, left: -100, width: 200, height: 175, borderRadius: 175, backgroundColor: '#B6BCFB'}]}></View>
            <View style = {[styles.cloud, {zIndex: -2, bottom: -100, left: -150, width: 300, height: 300, borderRadius: 150}]}></View>
            <View style = {[styles.cloud, {zIndex: -2, bottom: -120, left: 50, width: 250, height: 250, borderRadius: 125}]}></View>
        </SafeAreaView>
    );
}