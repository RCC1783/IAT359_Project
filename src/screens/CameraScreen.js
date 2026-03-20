// Referenced official documentation: https://docs.expo.dev/versions/latest/sdk/camera/#cameraview

import { StyleSheet, Text, View, SafeAreaView, Button, Pressable, Image } from 'react-native';

import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';
import { useRef, useState, useEffect } from 'react';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { UserData, saveUserData} from '../../globals';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraScreen() {
    const navigation = useNavigation();

    const cameraRef = useRef(null);
    const [cameraPermission, setCameraPermission] = useCameraPermissions();
    // const [facing, setFacing] = useState<CameraType>('back');

    const [photoMode, enablePhotoMode] = useState(false);
    const [logPhoto, setLogPhoto] = useState(null);

    if(!cameraPermission) {
        return(
            <SafeAreaView>
                <Text>Camera perms loading</Text>
            </SafeAreaView>
        );
    }

    if(!cameraPermission.granted) {
        return(
            <SafeAreaView>
                <Text>You fool! You must allow the camera to be used!</Text>
                <Button title='Allow Camera' onPress={setCameraPermission}/>
            </SafeAreaView>
        );
    }

    async function takePhoto() {
        if(cameraRef.current){
            try{
                let uID = await AsyncStorage.getItem('uid');
                let userData = await AsyncStorage.getItem(uID);

                userData = JSON.parse(userData);

                const photo = await cameraRef.current.takePictureAsync({
                    base64: true,
                    quality: 0.25
                });
                // The actual image. Should be saved locally so that it can be used for a log. Probably will need some sort of key to find the photo and link it to the log?
                const base64Image = `data:image/jpg;base64,${photo.base64}`;

                userData.refImages = [...userData.refImages, {id: Date.now().toString(), urls: { thumb: base64Image, regular: base64Image }}];
                await saveUserData(uID, JSON.stringify(userData));
                setLogPhoto(base64Image);

                enablePhotoMode(false);
            } catch (e){
                console.error(e);
            }
        }
    }

    return(
        <SafeAreaView style={{flex:1}}>
            <Text style = {styles.headerText}>~ Camera Test Screen ~</Text>
            {/* <Button title='toggle photo mode' onPress={() => enablePhotoMode(current => !current)}/> */}
            <View style={{flex: 1, alignItems: 'center'}}>
                {/* https://stackoverflow.com/questions/42398660/how-to-display-emoji-in-react-app */}
                <Text>{`${String.fromCodePoint('0x2193')} Press to take a photo ${String.fromCodePoint('0x2193')}`}</Text>
                <Pressable 
                style={{height: 150, width: 150, borderRadius: 20, overflow: 'hidden'}}
                onPress={photoMode ? () => takePhoto() : () => enablePhotoMode(current => !current)}>
                    {photoMode && (
                        <CameraView ref={cameraRef} active={photoMode} cameraRatio='1:1' style={{flex:1}}/>
                    )}
                    {!photoMode && logPhoto == null && (
                        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#828282'}}>
                            <Text style={{width: '60%', textAlign: 'center'}}>Press to enable camera</Text>
                        </View>
                    )}
                    {!photoMode && logPhoto != null && (
                        <View style={{flex:1}}>
                            {/* https://stackoverflow.com/questions/29380265/does-react-native-support-base64-encoded-images */}
                            <Image style={{flex:1}} source={{uri: logPhoto}}/>
                        </View>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}