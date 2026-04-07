import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

import { useEffect, useState } from 'react';

import { CustomHeader, ProjectDetails } from '../../globals';
import {default_walls, wood_floors} from '../shopItems'

class Project{
    name = 'unnamed_project';
    minutes = 0;
    totalMinutes = 0;
    ownedItems = [default_walls, wood_floors];
    roomSetup = {
        wallpaper: {default_walls},
        flooring: {wood_floors},
    };
    constructor(name, minutes = 0){
        this.name = name;
        this.minutes = minutes;
    }
}


export default function ProjectsScreen() {
  const navigation = useNavigation();

    const [projectList, setProjectList] = useState([]);
    const [createMenuOpen, setCreateMenu] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProject, setNewProject] = useState(null);

    const fbAuth = auth;
    const user = fbAuth.currentUser;

    useEffect(() => {
        const fetchProjects = async() => {
            const querySnapshot = await getDocs(collection(db, user.email));

            let allDocs = [];
            querySnapshot.forEach((doc) => {
                allDocs.push({
                ...doc.data(),
                id: doc.id,
                });
            });

            setProjectList(allDocs);
        };

        fetchProjects();

    }, [createMenuOpen]);

    useEffect(() => {
        const createNewProject = async() => {
            if(newProject == null || newProjectName == '') return;
            try{
                // let uID = await AsyncStorage.getItem('uid');
                if(user == null) return;
                const docRef = doc(collection(db, user.email));
                setDoc(docRef, {
                    ...newProject
                });
                console.log("project created with ID:", docRef.id);
                setNewProjectName('');
                setCreateMenu(false);
            } catch (e){
                console.error("Failed to create a new project.", e);
            }
        }

        createNewProject();
    }, [newProject]);

    return(
        <SafeAreaView style = {styles.container}>
            <CustomHeader screenName={"Projects"} navigation={navigation}/>
            <TouchableOpacity style = {[styles.homeButton, { justifyContent: 'center', alignSelf: 'center' }]} onPress={() => setCreateMenu(true)}>
                <Text style = {styles.btnText}>New Project</Text>
            </TouchableOpacity>
            <FlatList
                data={projectList}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <View style={styles.shopItem}>
                        <TouchableOpacity onPress={() => navigation.navigate("selectedProject", {projectID: item.id})}>
                            <ProjectDetails projectID={item.id} projectName={item.name}/>
                        </TouchableOpacity>
                    </View>
                )}
            />
            {createMenuOpen && (
                <View style={styles.popupView}>
                    <TextInput
                        style={styles.input}
                        placeholder='Name Your Project...'
                        placeholderTextColor = {'#D95635'}
                        value={newProjectName}
                        onChangeText={setNewProjectName}
                    />
                    <TouchableOpacity style = {styles.homeButton} onPress={() => setNewProject(new Project(newProjectName))}>
                        <Text style = {styles.btnText}>Create Project</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.homeButton} onPress={() => {setCreateMenu(false); setNewProjectName('');}}>
                        <Text style = {styles.btnText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}

        
                {/* CLOUDS */}
                <View style = {[styles.cloud, {top: -50, left: 50}]}></View>
                <View style = {[styles.cloud, {top: -120, left: 100}]}></View>
                <View style = {[styles.cloud, {top: -90, left: -50}]}></View>

            <View style = {[styles.cloud, {bottom: -50, right: -100, width: 200, height: 175, borderRadius: 175, zIndex: -1, backgroundColor: '#B6BCFB'}]}></View>
            <View style = {[styles.cloud, {bottom: -100, right: -150, width: 300, height: 300, borderRadius: 150}]}></View>
            <View style = {[styles.cloud, {bottom: -120, left: 90, width: 250, height: 250, borderRadius: 125}]}></View>
        </SafeAreaView>
    );
}
