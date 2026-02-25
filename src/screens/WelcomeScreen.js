import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';

import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
    const navigation = useNavigation();
    return(
        <SafeAreaView>
            <Text>~ Welcome! ~</Text>
            <Button title="Shop Screen" onPress={() => navigation.navigate("shop")}/>
            <Button title="Home Screen" onPress={() => navigation.navigate("home")}/>
            <Button title="Settings Screen (does not exist rn)" onPress={() => navigation.navigate("shop")}/>
        </SafeAreaView>
    );
}