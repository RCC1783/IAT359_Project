import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { and, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";

import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';
import {db} from '../firebaseConfig'
import { FlatList } from 'react-native';
import { CustomHeader } from '../../globals';

async function updateProj(project, projectID) {
    try{
        const projectRef = doc(db, "projects", projectID);
        await updateDoc(projectRef, {
            ...project
        });
    } catch (e){
        console.error(e);
    }
}

function editRoomSetup(type, item, project, projectID){
    switch (type){
        case "wallpaper": {
            project.roomSetup.wallpaper = item;
        }
        case "flooring": {
            project.roomSetup.flooring = item;
        }
    }

    updateProj(project, projectID);

    return project;
}

export default function SelectedProjectScreen({route}) {
    const {projectID} = route.params;
    const navigation = useNavigation();
  
    const [currentProject, setCurrentProj] = useState();
    const [updator, updateProj] = useState();

    const [roomEditorOpen, setRoomEditorOpen] = useState(false);

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
            <CustomHeader screenName={currentProject != undefined? currentProject.name : "Loading"} navigation={navigation}></CustomHeader>

            {roomEditorOpen && (
                <View style={styles.popupView}>
                    <Text>Walls</Text>
                    <FlatList 
                        data={currentProject != undefined ? currentProject.ownedItems.filter((item) => {return item.type == "wallpaper";}) : null}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => (
                            <TouchableOpacity onPress={() => updateProj(editRoomSetup("wallpaper", item, currentProject, projectID))}>
                                <Text>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        horizontal={true}
                    />
                    <Text>Floors</Text>
                    <FlatList 
                        data={currentProject != undefined ? currentProject.ownedItems.filter((item) => {return item.type == "flooring";}) : null}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => (
                            <TouchableOpacity onPress={() => updateProj(editRoomSetup("flooring", item, currentProject, projectID))}>
                                <Text>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        horizontal={true}
                    />
                    <Button title='Close' onPress={() => setRoomEditorOpen(false)}/>
                </View>
            )}

            {/* May put this into its own function so it can be reused (once I figure out how...) */}
            <View style={styles.roomContainer}>
                <Text>{currentProject != undefined ? currentProject.roomSetup.flooring.imgSrc : "Loading"}</Text>
                <Image 
                    style={styles.roomImage}
                    source={currentProject != undefined ? currentProject.roomSetup.wallpaper.imgSrc : null}/>
                <Image 
                    style={styles.roomImage}
                    source={currentProject != undefined ? currentProject.roomSetup.flooring.imgSrc : null}/>
                
            </View>

            <Button title='Edit Room' onPress={() => setRoomEditorOpen(true)}/>

            <Button title="Shop Screen" onPress={() => navigation.navigate("shop", {projectID: projectID})}/>

            <Button
              title="Jump Back In!"
              onPress={() => navigation.navigate("active", { projectID: projectID })}
            />
        </SafeAreaView>
    );
}
