import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';

import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';

export default function ProjectImagesScreen() {
    const navigation = useNavigation();
    return(
        <SafeAreaView>
            <Text>~ Project Images ~</Text>
        </SafeAreaView>
    );
}