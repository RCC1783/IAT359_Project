import { StyleSheet, Text, View, SafeAreaView, Button, TouchableOpacity, FlatList} from 'react-native';
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
import { shopList } from '../shopItems';

// Experimenting w data structures
const roomItem = {
    id:"default_walls", // unique name/id that identifies the object
    type: "wallpaper", // The type (wallpaper, flooring, etc.) that the object is
    imgSrc:"..." //path to the image file
};

const room = {
    project:"project_name", // the room's id - linked to the name of the project which should be uniqe anyways
    ownedItems: [], //Array of roomItems that can be used to populate the room
    roomSetup: { // Object populated with roomItems controlling the layout of the room
        wallpaper: roomItem,
        flooring: roomItem,
    }
};

async function addRoom(){
    try{
        const docRef = await doc(collection(db, 'rooms'));
        setDoc(docRef, room);
        console.log("Document written with ID: ", docRef.id);
    } catch (e){
        console.error("Error", e);
    }
}

async function printAll() {
    const querySnapshot = await getDocs(collection(db, "rooms"));
    querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
    });

}

export default function ShopScreen({navigation}) {
    return(
        <SafeAreaView>
            <Text>~ Shop ~</Text>
            {/* <TouchableOpacity onPress={addRoom}>
                <Text>Add Room</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={printAll}>
                <Text>Console all</Text>
            </TouchableOpacity> */}
            <FlatList
                data={shopList}
                keyExtractor={item => item.item.id}
                renderItem={({item}) => (
                    <View style={styles.shopItem}>
                        <View>
                            <Text>{item.item.name}</Text>
                            <Text>${item.cost}</Text>
                        </View>
                        <TouchableOpacity><Text>Purchase?</Text></TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}