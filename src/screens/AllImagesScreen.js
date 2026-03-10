import { StyleSheet, Text, View, SafeAreaView, Button, FlatList, Image, Pressable, TextInput } from 'react-native';

import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

export default function AllImagesScreen() {
    const navigation = useNavigation();

    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    const [selectImagePopup, toggleSelectImagePopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [pageNum, setPageNum] = useState(1);

    const [fullscreenImage, setFullscreenImage] = useState(null)

    useEffect(() => {
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

    return(
        <SafeAreaView>
                <Text style={styles.btnText}>Add Images</Text>
            <Pressable style = {[styles.homeButton, styles.androidBoxShdw, styles.boxShadow]} onPress={() => toggleSelectImagePopup(true)}>
            <Text style = {styles.headerText}>~ All Images ~</Text>
            </Pressable>
            <FlatList
                data={selectedImages}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', margin: 2}}>
                        <Image 
                            style={{width: 100, height: 100}}
                            source={{uri: item.urls.thumb}}
                        />
                        <Text>{item.alt_description}</Text>
                    </View>
                )}
                numColumns={3}
            />

            {selectImagePopup && (
                <View style={styles.popupView}> 
                    <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between', width: '80%'}}>
                        <Pressable onPress={() => toggleSelectImagePopup(false)}><Text>Close</Text></Pressable>
                        <Pressable><Text>Save</Text></Pressable>
                    </View>

                    {/* https://stackoverflow.com/questions/67098132/how-to-call-function-on-enter-press-in-textinput-react-native */}
                    <TextInput onSubmitEditing={() => fetchUnsplash()} placeholder='Search' onChangeText={setSearchQuery}/>

                    <FlatList
                        data={images != undefined ? images : null}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => (
                            <Pressable style={{flex: 1, flexDirection: 'column', alignItems: 'center',margin: 2}}>
                                <Image 
                                    style={{width: 100, height: 100, borderRadius: 10, borderColor: '#656565', borderWidth: 3}}
                                    source={{uri: item.urls.thumb}}
                                />
                            </Pressable>
                        )}
                        numColumns={3}
                        style={{width: '100%'}}
                    />
                    <Text>Powered by Unsplash</Text>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between', width: '80%'}}>
                        <Pressable onPress={() => { pageNum > 1 ? setPageNum(pageNum - 1) : null; fetchUnsplash()}}><Text>{`<-`}</Text></Pressable>
                        <Pressable onPress={() => { setPageNum(pageNum + 1); fetchUnsplash() }}><Text>{`->`}</Text></Pressable>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}