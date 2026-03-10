import { StyleSheet, Text, View, SafeAreaView, Button, FlatList, TouchableOpacity, TextInput } from 'react-native';

import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useEffect, useState } from 'react';


class Project{
    name = 'unnamed_project';
    minutes = 0;
    logs = [];
    ownedItems = [];
    roomSetup = {
        wallpaper: {},
        flooring: {},
    };
    constructor(name, minutes = 0){
        this.name = name;
        this.minutes = minutes;
    }
}
const test_proj = {
  name: "test project", // Display name of the project
  minutes: 500,

    // array containing log objects
    logs:[],

  ownedItems: [], //Array of roomItems that can be used to populate the room

  roomSetup: {
    // Object populated with roomItems controlling the layout of the room
    wallpaper: {},
    flooring: {},
  },
};


export default function ProjectsScreen() {
  const navigation = useNavigation();

    const [projectList, setProjectList] = useState([]);
    const [createMenuOpen, setCreateMenu] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProject, setNewProject] = useState(null);

    useEffect(() => {
        const fetchProjects = async() => {
            const querySnapshot = await getDocs(collection(db, "projects"));

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
                const docRef = doc(collection(db, 'projects'));
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
        <SafeAreaView>
            <Text style = {styles.headerText}>~ Projects ~</Text>
            <TouchableOpacity onPress={() => setCreateMenu(true)}>
                <Text>New Project</Text>
            </TouchableOpacity>
            <FlatList
                data={projectList}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <View style={styles.shopItem}>
                        <TouchableOpacity onPress={() => navigation.navigate("selectedProject", {projectID: item.id})}>
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            {createMenuOpen && (
                <View style={styles.popupView}>
                    <TextInput
                        placeholder='Name your project'
                        value={newProjectName}
                        onChangeText={setNewProjectName}
                    />
                    <TouchableOpacity onPress={() => setNewProject(new Project(newProjectName))}>
                        <Text>Create Project</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setCreateMenu(false); setNewProjectName('');}}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}
