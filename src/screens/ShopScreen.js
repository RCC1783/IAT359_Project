import { StyleSheet, Text, View, Button, TouchableOpacity, FlatList, Image} from 'react-native';
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
import { SafeAreaView } from 'react-native-safe-area-context';

import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../firebaseConfig';
import { shopList } from '../shopItems';
import { useEffect, useState } from 'react';
import { CustomHeader } from '../../globals';

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

async function updateProj(project, projectID) {
    try{
        const fbAuth = auth;
        const user = fbAuth.currentUser;

        const projectRef = doc(db, user.email, projectID);
        await updateDoc(projectRef, {
            ...project
        });
    } catch (e){
        console.error(e);
    }
}

function purchaseItem(item, projectID, project) {
    if(item.owned) return;

    if(project.minutes < item.cost){
        console.log("POOR!");
        return;
    }

    item.owned = true;
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

    const [currentProject, setCurrentProj] = useState();
    const [updator, updateProj] = useState();

    const keeperIdle = require('../images/shop/images.jpg');
    const keeperAnnoyed = require('../images/shop/download.jpg');
    const [keeperTxt, setKeeperTxt] = useState("Hey! Always great to see ya. Here's what I got for you to spruce up your room.");
    const [keeperSprite, setKeeperSprite] = useState(keeperIdle);
    
    useEffect(() => {
        const fetchProject = async() => {
            try{
                const fbAuth = auth;
                const user = fbAuth.currentUser;

                const projectRef = doc(db, user.email, projectID);
                const project = await getDoc(projectRef);

                setCurrentProj(project.data());
                console.log("current proj:", project);

                // Not my *favourite* way to do this but c'est la vie.
                // On update, checks every item in the owned items array against
                //  the shop items and marks them as owned if they are in both
                project.data().ownedItems.forEach((ownedItem) => {
                    shopList.forEach((shopItem) => {
                        if(shopItem.item.id == ownedItem.id){
                            shopItem.owned = true;
                        }
                    })
                })
            } catch (e){
                console.error("Failed to fetch project", e);
            }
        }
        fetchProject();
    }, [updator]);

    return(
        <SafeAreaView style = {styles.container}>
            <CustomHeader screenName={"Shop"} navigation={navigation}></CustomHeader>
            <View style={styles.shopHeader}>
                {/* <Text>~ Shop ~</Text> */}
                <Text style={styles.minutesDisplay}>Minutes: ${currentProject != undefined ? currentProject.minutes : "loading"}</Text>
   
                {/* Shopkeeper Textbox */}
                <Text style={styles.keeperText}>{keeperTxt}</Text>
                <TouchableOpacity style = {{alignSelf: 'center'}} onPress = {() => {setKeeperTxt("Hey! Quit pokin' me, and just buy somethin'!"); setKeeperSprite(keeperAnnoyed);}}>
                    <Image style={{marginTop: 5, width: 125, height: 125}} source={keeperSprite}/>
                </TouchableOpacity>

            </View>
            {/* <TouchableOpacity onPress={printAll}>
                <Text>Console all</Text>
            </TouchableOpacity> */}

            <FlatList
                style={styles.shopList}
                data={shopList}
                keyExtractor={item => item.item.id}
                renderItem={({item}) => (
                    <View style={styles.shopItem}>
                        <View>
                            <Text style = {[styles.shopItemTxt, {fontWeight: 'bold'}]}>{item.item.name}</Text>
                            <Text style = {[styles.shopItemTxt]}>${item.cost}</Text>
                        </View>
                        <TouchableOpacity style = {{backgroundColor: '#5A53BF', padding: 10, borderRadius: 15}}
                        onPress={() => {
                            const wasOwned = item.owned;

                            updateProj(purchaseItem(item, projectID, currentProject));
                            
                            if (currentProject.minutes < item.cost && !wasOwned){
                                setKeeperTxt("Sorry pal, looks like you'll have to grind for just a bit longer. Best of luck!");
                            } else if (wasOwned) {
                                setKeeperTxt("Always appreciate more coin, but looks like you already got that one.");
                            } else {
                                setKeeperTxt("Thanks! Hope that keeps ya goin' for just a bit longer.")
                            }
                        }}>
                            <Text style = {styles.shopItemTxt}>{item.owned ? "Owned" : "Purchase?"}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* CLOUDS */}
            <View style = {[styles.cloud, {top: -50, right: -50}]}></View>
            <View style = {[styles.cloud, {top: -120, right: 80}]}></View>

            <View style = {[styles.cloud, {bottom: -50, left: -100, width: 200, height: 175, borderRadius: 175, zIndex: 1, backgroundColor: '#B6BCFB'}]}></View>
            <View style = {[styles.cloud, {bottom: -100, left: -150, width: 300, height: 300, borderRadius: 150}]}></View>
            <View style = {[styles.cloud, {bottom: -120, left: 50, width: 250, height: 250, borderRadius: 125}]}></View>
        </SafeAreaView>
    );
}