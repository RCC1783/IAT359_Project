import { StyleSheet, Text, View, SafeAreaView, Button, Switch, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
    const [testSetting, setTestSetting] = useState(false);

    const saveSettings = async () => {
        try {
            await AsyncStorage.setItem('test', JSON.stringify(testSetting));
        } catch (error) {
        console.error('Error saving settings: ', error);
        }
    };

    const loadSettings = async() => {
        try {
            const savedTest = await AsyncStorage.getItem('test');

            if (savedTest !== null) setTestSetting(JSON.parse(savedTest));
        } catch (error) {
            console.error('Error loading settings: ', error);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        saveSettings();
    }, [testSetting]);

    const navigation = useNavigation();
    return(
        <SafeAreaView>
            <Text>~ Settings ~</Text>

            <Text>TEST</Text>
            <Switch value = {testSetting} onValueChange = {setTestSetting} />

            <Pressable style = {styles.homeButton} onPress = {saveSettings}>
                <Text>SAVE SETTINGS</Text>
            </Pressable>  
        </SafeAreaView>
    );
}