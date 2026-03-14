import { Text, View, SafeAreaView, Button, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';

export default function MicTestScreen() {
    const [recording, setRecording] = useState();
    const [recordings, setRecordings] = useState([]);

    const [micPermission, setMicPermission] = Audio.usePermissions();

    const audioDirectory = FileSystem.documentDirectory + 'audio/';

    async function startRecording() {
        try {
          if (micPermission.status !== 'granted') {
            await setMicPermission();
          }

          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
          });

          const { recording } = await Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
          );
          setRecording(recording);
        } catch (error) {
          console.error('Failed to start recording', error);
        }
    }

    async function stopRecording() {
        setRecording(undefined);
        await recording.stopAndUnloadAsync();

        let allRecordings = [...recordings];
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        allRecordings.push({
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            file: await saveToStorage(recording.getURI())
        });

        console.log(getDurationFormatted(status.durationMillis));

        setRecordings(allRecordings);

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        console.log('Saved in internal storage at', audioDirectory);
    }

    function getDurationFormatted(ms) {
        const minutes = ms / 1000 / 60;
        const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
        return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`;
    }

    function getRecordingLines() {
        return recordings.map((recordingLine, index) => {
            return (
                <SafeAreaView key={index} style={styles.row}>
                    <Text style={styles.fill}>Recording #{index + 1} - {recordingLine.duration}</Text>
                    <Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title='Play'></Button>
                    <Button style={styles.button} onPress={() => deleteRecording(index)} title='Delete'></Button>
                </SafeAreaView>
            );
        });
    }

    async function deleteAllRecordings() {
        try {
            const audioFiles = await FileSystem.readDirectoryAsync(audioDirectory);
            await Promise.all(audioFiles.map((fileName) => {
                FileSystem.deleteAsync(audioDirectory + fileName, { idempotent: true })
            }));
            
            console.log('All recordings deleted');

            setRecordings([]);
        } catch (error) {
            console.error('Failed to delete recordings', error);
        }
    }

    async function deleteRecording(index) {
        try {
            const recording = recordings[index];
            await FileSystem.deleteAsync(recording.file, { idempotent: true });
            const newRecordings = [...recordings];
            newRecordings.splice(index, 1);
            setRecordings(newRecordings);
        } catch (error) {
            console.error('Failed to delete recording', error);
        }
    }

    async function saveToStorage(tempUri) {
        const fileName = `recording-${Date.now()}.m4a`;
        const dirExist = await FileSystem.getInfoAsync(audioDirectory);

        if (!dirExist.exists) {
            await FileSystem.makeDirectoryAsync(audioDirectory, { intermediates: true });
        }

        try {
            await FileSystem.copyAsync({
                from: tempUri,
                to: audioDirectory + fileName,
            });
            console.log('Recording saved to', audioDirectory + fileName);
            return audioDirectory + fileName;
        } catch (error) {
            console.error('Failed to save recording', error);
            return null;
        }
    }

    const loadRecordings = async () => {
        try {  
            const dirExist = await FileSystem.getInfoAsync(audioDirectory);

            if (!dirExist.exists) {
                await FileSystem.makeDirectoryAsync(audioDirectory, { intermediates: true });
                setRecordings([]);
                return;
            }

            const audioFiles = await FileSystem.readDirectoryAsync(audioDirectory);

            const loadedRecordings = await Promise.all(audioFiles.map(async (file) => {
                const fileUri = audioDirectory + file;
                const { sound, status } = await Audio.Sound.createAsync({ uri: fileUri });
                const duration = getDurationFormatted(status.durationMillis);

                return {
                    sound,
                    duration,
                    file: fileUri,
                };
            }));
            setRecordings(loadedRecordings);
        } catch (error) {
            console.error('Failed to load recordings', error);
        }
    }

    useEffect(() => {
        loadRecordings();
    }, []);

    const navigation = useNavigation();
    return(
        <SafeAreaView style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffe8ff'}}>
            <Text style = {styles.headerText}>~ Mic Test Screen ~</Text>

            <Pressable style = {[styles.homeButton, styles.androidBoxShdw, styles.boxShadow]} onPress={() => recording ? stopRecording() : startRecording()}>
                <Text style = {styles.btnText}>{recording ? 'Stop Recording' : 'Start Recording'}</Text>
            </Pressable>
            {getRecordingLines()}   
            <Pressable style = {[styles.homeButton, styles.androidBoxShdw, styles.boxShadow]} onPress={() => deleteAllRecordings()}>
                <Text style = {styles.btnText}>{recordings.length > 0 ? 'Delete Recordings' : 'No Recordings'}</Text>
            </Pressable>
        </SafeAreaView>
    );
}