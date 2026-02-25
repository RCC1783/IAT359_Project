import { StyleSheet, Text, View, SafeAreaView, Button, TouchableOpacity} from 'react-native';
import {
  and,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';
import {db} from '../firebaseConfig'

async function addRoom(){
    try{
        const docRef = await doc(collection(db, 'rooms'));
        const newRoom = {
            wallpaper: "redWalls",
            floor: "default_floor",
            leftWallItem: "sofa",
        };
        setDoc(docRef, newRoom);
        console.log("Document written with ID: ", docRef.id);
    } catch (e){
        console.error("Error", e);
    }
}

export default function ShopScreen({navigation}) {
    return(
        <SafeAreaView>
            <Text>~ Shop ~</Text>
            <TouchableOpacity onPress={addRoom}>
                <Text>Add Room</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}