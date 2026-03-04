import { StyleSheet, Text, View, SafeAreaView, Button, TouchableOpacity, FlatList} from 'react-native';
import {
  and,
  collection,
  doc,
  getDoc,
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
import { useEffect, useState } from 'react';

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

async function updateProj(project, projectID) {
    //save/overwrite room in firestore (not working)
    try{
        const projectRef = doc(db, "projects", projectID);
        await updateDoc(projectRef, {
            ...project
        });
    } catch (e){
        console.error(e);
    }
}

function purchaseItem(item, projectID, project) {

    if(project.minutes < item.cost){
        console.log("POOR!");
        return;
    }
    project.minutes = project.minutes - item.cost;
    project.ownedItems = [...project.ownedItems, item.item];
    console.log("purchased", item.item.name, "- You have $", project.minutes, " remaining");

    updateProj(project, projectID);

    return project;

    // updateProj(project);
}

export default function ShopScreen({route}) {
    const navigation = useNavigation();
    const {projectID} = route.params;

    const [project, setCurrentProj] = useState();
    const [updator, updateProj] = useState();

    useEffect(() => {
        const fetchProject = async() => {
            try{
                const projectRef = doc(db, "projects", projectID);
                const project = await getDoc(projectRef);
                setCurrentProj(project.data());
                console.log("current proj:", project);
            } catch (e){
                console.error("Failed to fetch project", e);
            }
        }
        fetchProject();
    }, [updator]);

    return(
        <SafeAreaView>
            <Text>~ Shop ~</Text>
            <Text>minutes: {project != undefined ? project.minutes : "loading"}</Text>
            <TouchableOpacity onPress={printAll}>
                <Text>Console all</Text>
            </TouchableOpacity>
            <FlatList
            // Technically you can buy multiples of the same item atm...
                data={shopList}
                keyExtractor={item => item.item.id}
                renderItem={({item}) => (
                    <View style={styles.shopItem}>
                        <View>
                            <Text>{item.item.name}</Text>
                            <Text>${item.cost}</Text>
                        </View>
                        <TouchableOpacity onPress={() => updateProj(purchaseItem(item, projectID, project))}>
                            <Text>Purchase?</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}