import { StyleSheet, Text, View, SafeAreaView, Button, TouchableOpacity, FlatList} from 'react-native';
import {
  and,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';
import {db} from '../firebaseConfig'
import { shopList } from '../shopItems';
import { useEffect } from 'react';

// Experimenting w data structures
const roomItem = {
    id:"default_walls", // unique name/id that identifies the object
    type: "wallpaper", // The type (wallpaper, flooring, etc.) that the object is
    imgSrc:"..." //path to the image file
};

const log1 = {
    date:"",
    img:"",
    text:""
}



async function printAll() {
    const querySnapshot = await getDocs(collection(db, "projects"));
    querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
    });

}

async function purchaseItem(item, id) {
    const currentProj = test_proj; //Would probably have a getCurrentRoom method to get active room

    if(currentProj.minutes < item.cost){
        console.log("POOR!");
        return;
    }
    currentProj.minutes = currentProj.minutes - item.cost;
    console.log("purchased", item.item.name, "- You have $", currentProj.minutes, " remaining");

    const updatedProj = {
        ...currentProj,
        ownedItems:[ ...ownedItems, item]
    };

    //save/overwrite room in firestore (not working)
    const docRef = doc(db, "projects", id);
    await updateDoc(docRef, {
        minutes: currentProj.minutes
    });
}

export default function ShopScreen({route}) {
    const navigation = useNavigation();
    const {project} = route.params;

    return(
        <SafeAreaView>
            <Text>~ Shop ~</Text>
            <TouchableOpacity onPress={printAll}>
                <Text>Console all</Text>
            </TouchableOpacity>
            <FlatList
                data={shopList}
                keyExtractor={item => item.item.id}
                renderItem={({item}) => (
                    <View style={styles.shopItem}>
                        <View>
                            <Text>{item.item.name}</Text>
                            <Text>${item.cost}</Text>
                        </View>
                        <TouchableOpacity onPress={() => purchaseItem(item, project)}>
                            <Text>Purchase?</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}