import { StyleSheet, Text, View, SafeAreaView, Button, FlatList, TouchableOpacity } from 'react-native';

import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useEffect, useState } from 'react';

const test_proj = {
    name:"test project", // Display name of the project
    minutes: 500,

    logs:[ // array containing log objects
        {}
    ],

    ownedItems: [], //Array of roomItems that can be used to populate the room

    roomSetup: { // Object populated with roomItems controlling the layout of the room
        wallpaper: {},
        flooring: {},
    },
};

async function addProj(){
    try{
        const docRef = await doc(collection(db, 'projects'));
        setDoc(docRef, test_proj);
        console.log("Document written with ID: ", docRef.id);
    } catch (e){
        console.error("Error", e);
    }
}

export default function ProjectsScreen() {
    const navigation = useNavigation();

    const [projectList, setProjectList] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            const querySnapshot = await getDocs(collection(db, "projects"));

            let allDocs = [];
            querySnapshot.forEach((doc) => {
                allDocs.push({
                    ...doc.data(),
                    id: doc.id
                });
            });

            setProjectList(allDocs);
        }

        fetchData();
    }, []);

    return(
        <SafeAreaView>
            <Text>~ Projects ~</Text>
            <TouchableOpacity onPress={addProj}>
                <Text>Add Room</Text>
            </TouchableOpacity>
            <FlatList
                data={projectList}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <View>
                        <TouchableOpacity onPress={() => navigation.navigate("selectedProject", {projectID: item.id})}>
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}