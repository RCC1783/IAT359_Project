import { StyleSheet, Text, View, Button, FlatList, Image, Pressable, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { CustomHeader, Log, UserData, saveUserData} from '../../globals';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AllImagesScreen() {
    const navigation = useNavigation();

    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    const [selectImagePopup, toggleSelectImagePopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [pageNum, setPageNum] = useState(1);

    const [fullscreenImage, setFullscreenImage] = useState(false);
    const [selImgID, setSelImgID] = useState(null); // selected image ID for fullscreen view

    useEffect(() => {
        const getImages = async () => {
            let uID = await AsyncStorage.getItem('uid');
            let userData = await AsyncStorage.getItem(uID);

            userData = JSON.parse(userData);

            console.log("UserData:", userData);

            setSelectedImages(userData.refImages);
        }
        getImages();
        fetchUnsplash();
    }, [selectImagePopup]);

    useEffect(() => {
        setPageNum(1);
        // fetchUnsplash();
    },[searchQuery]);

    async function fetchUnsplash() {
        // const unsplashKey = process.env.UNSPLASH_ACESS;
        const unsplashKey = "SNmzkWnLsnTfNnc3wIGUZ5YhdbyuquKWw9JEIz_jw-Y";

        if(searchQuery != ''){
            try{
                const response = await fetch(`https://api.unsplash.com/search/photos/?client_id=${unsplashKey}&query=${searchQuery}&per_page=12&page=${pageNum}`,);
                const data = await response.json();

                if(response.ok){
                    setImages(data.results);
                    // console.log("Unsplash Data:", data);
                } else{
                    console.error("FAIL");
                }
            } catch (e) {
                console.error("ERROR: Failed to Unsplash.", e);
            }
        }else{
            try{
                const response = await fetch(`https://api.unsplash.com/photos/?client_id=${unsplashKey}&per_page=12&page=${pageNum}`,);
                const data = await response.json();

                if(response.ok){
                    setImages(data);
                    // console.log("Unsplash Data:", data);
                } else{
                    console.error("FAIL");
                }
            } catch (e) {
                console.error("ERROR: Failed to Unsplash.", e);
            }
        }
    }

    async function addImage(imageItem){
        if(selectedImages.findIndex((item) => item.id === imageItem.id) != -1) {
            console.log("Already present");
            return;
        }

        setSelectedImages([...selectedImages, imageItem]);

        try{
            let uID = await AsyncStorage.getItem('uid');
            let userData = await AsyncStorage.getItem(uID);
            console.log("userData",userData);
            // if(userData == null) return;

            userData = JSON.parse(userData);

            userData.refImages = [...selectedImages, imageItem];

            console.log("Updated ref Images:", userData.refImages);

            // userData.updateImages(imageItem);

            await saveUserData(uID, JSON.stringify(userData));

            console.log("SKJFH");

        } catch (e){
            console.error("Failed to save images", e)
        }
    }

    async function deleteItem(imageItem) {
        try {
            let uID = await AsyncStorage.getItem('uid');
            let userData = await AsyncStorage.getItem(uID);

            userData = JSON.parse(userData);
            const updatedImages = userData.refImages.filter((item) => item.id !== imageItem.id);
            userData.refImages = updatedImages;

            setSelectedImages(updatedImages);
            await saveUserData(uID, JSON.stringify(userData));
            console.log('OWNED');
        } catch (e) {
            console.error("Failed to delete image", e);
        }
    }

    return(
        <SafeAreaView style = {styles.container}>
            <CustomHeader screenName={"Images"} navigation={navigation}/>
            <Pressable style={[styles.homeButton, { justifyContent: 'center', alignSelf: 'center' }]} onPress={() => toggleSelectImagePopup(true)}>
                <Text style={styles.btnText}>Add Images</Text>
            </Pressable>
            <Modal
                animationType = 'fade'
                transparent = {true}
                visible = {fullscreenImage}
                onRequestClose = {() => {
                    setFullscreenImage(false);
                }}
            >
                <SafeAreaView style = {styles.container}>
                    <Pressable onPress={() => setFullscreenImage(false)} style={styles.homeButton}>
                        <Text style={{fontSize: 18}}>Close</Text>
                    </Pressable>
                    <Image
                        style={{width: '90%', height: '60%', objectFit: "contain"}}
                        source = {{uri:selImgID}}
                    />
                </SafeAreaView>
            </Modal>
            <FlatList
                data={selectedImages}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', margin: 2}}>
                        <Pressable onPress={() => Alert.alert("Image", "Select",
                            [
                                {
                                    text: "View Image.", onPress: () => {
                                        if(item.type == "unsplash"){
                                            setFullscreenImage(true)
                                            setSelImgID(item.urls.regular);
                                        } else{
                                            setFullscreenImage(true)
                                            setSelImgID(item.uri);
                                        }
                                    }
                                },
                                {
                                    text: "Delete Image.", onPress: () => Alert.alert("Are you sure?", "This will delete the image.",
                                        [
                                            {
                                                text: "Yes.", onPress: () => deleteItem(item)
                                            },
                                            {
                                                text: "No", style: "cancel"
                                            }
                                        ]
                                    )
                                }
                            ]
                        )}>
                            <Image 
                                style={{width: 100, height: 100}}
                                source={item.type == "unsplash" ? {uri: item.urls.thumb} : {uri: item.uri}}
                            />
                        </Pressable>
                        <Text>{item.alt_description}</Text>
                    </View>
                )}
                numColumns={3}
                style={{minWidth:"100%"}}
            />

            {selectImagePopup && (
                <View style={styles.popupView}> 
                    <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between', width: '80%'}}>
                        <Pressable style = {{backgroundColor: "#D95635", padding: 10, borderRadius: 10 }} onPress={() => {
                            toggleSelectImagePopup(false);
                            setPageNum(1);
                        }}>
                            <Text style = {styles.btnText}>Close</Text>
                        </Pressable>
                        <Pressable
                            style = {{backgroundColor: "#D95635", padding: 10, borderRadius: 10 }}
                            title='Camera'
                            onPress={() => {
                                // toggleSelectImagePopup(false);
                                setPageNum(1);
                                navigation.navigate("Camera");
                            }}
                        >
                            <Text style = {[styles.btnText]}>CAMERA</Text>
                        </Pressable>
                    </View>

                    {/* https://stackoverflow.com/questions/67098132/how-to-call-function-on-enter-press-in-textinput-react-native */}
                    <TextInput style = {[styles.input, { textAlign: 'center'}]} onSubmitEditing={() => fetchUnsplash()} placeholder='Search' placeholderTextColor={'#D95635'} onChangeText={setSearchQuery}/>

                    <FlatList
                        data={images != undefined ? images : null}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => (
                            <Pressable onPress={() => Alert.alert("Save Image?", "Confirm?", 
                                [
                                    {
                                        text: "Yes?",
                                        onPress: () => addImage({id: item.id, urls: item.urls, type: "unsplash"})
                                    },
                                    {
                                        text: "No"
                                    }
                                ]
                            )} style={{flex: 1, flexDirection: 'column', alignItems: 'center',margin: 2}}>
                                <Image 
                                    style={{width: 100, height: 100, borderRadius: 10, borderColor: '#342b60', borderWidth: 3}}
                                    source={{uri: item.urls.thumb}}
                                />
                            </Pressable>
                        )}
                        numColumns={3}
                        style={{minWidth: '100%'}}
                    />
                    <Text style = {styles.btnText}>Powered by Unsplash</Text>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between', alignContent:'center', width: '80%'}}>
                        <Pressable style = {{backgroundColor: "#D95635", padding: 10, borderRadius: 10 }} onPress={() => { pageNum > 1 ? setPageNum(pageNum - 1) : null; fetchUnsplash()}}><Text style = {[styles.btnText, { fontWeight: 'bold'}]}>{`<`}</Text></Pressable>
                        <Text style = {{backgroundColor: "#D95635", padding: 10, borderRadius: 10, color: "white" }}>{pageNum}</Text>
                        <Pressable style = {{backgroundColor: "#D95635", padding: 10, borderRadius: 10 }} onPress={() => { setPageNum(pageNum + 1); fetchUnsplash() }}><Text style = {[styles.btnText, { fontWeight: 'bold'}]}>{`>`}</Text></Pressable>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}