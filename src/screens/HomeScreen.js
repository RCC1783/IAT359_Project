import { StyleSheet, Text, View, SafeAreaView, Button, Pressable } from 'react-native';

import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const navigation = useNavigation();
    return(
        <SafeAreaView>
            <Text>~ Welcome! ~</Text>
            {/* <Button title="Shop Screen" onPress={() => navigation.navigate("shop")}/> */}

            <Button title="Projects" onPress={() => navigation.navigate("projects")}/>
            <Button title="Home Screen" onPress={() => navigation.navigate("home")}/>

            <Pressable style = {styles.homeButton} onPress={() => navigation.navigate('settings')}>
                <Text>Settings</Text>
            </Pressable>
        </SafeAreaView>
    );
}