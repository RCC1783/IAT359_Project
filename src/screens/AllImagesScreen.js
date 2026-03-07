import { StyleSheet, Text, View, SafeAreaView, Button, FlatList, Image } from 'react-native';

import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

export default function AllImagesScreen() {
    const navigation = useNavigation();

    const [images, setImages] = useState([]);

    useEffect(() => {
        fetchUnsplash();
    }, [])

    async function fetchUnsplash() {
        // const unsplashKey = process.env.UNSPLASH_ACESS;
        const unsplashKey = "SNmzkWnLsnTfNnc3wIGUZ5YhdbyuquKWw9JEIz_jw-Y";
        console.log(unsplashKey);
        try{
            const response = await fetch(`https://api.unsplash.com/photos/?client_id=${unsplashKey}`,);
            const data = await response.json();

            if(response.ok){
                setImages(data);
                // console.log("Unsplash Data:", data);
            } else{
                console.error("FAIL");
            }
        } catch (e) {
            console.error("ERROR: Failed to Unsplash.", e)
        }
    }

    return(
        <SafeAreaView>
            <Text>~ All Images ~</Text>
            <FlatList
                data={images != undefined ? images : null}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <View style={{flex: 1, flexDirection: 'column', margin: 2}}>
                        <Image 
                            style={{width: 100, height: 100}}
                            source={{uri: item.urls.thumb}}
                        />
                        <Text>{item.alt_description}</Text>
                    </View>
                )}
                numColumns={3}
            />
        </SafeAreaView>
    );
}