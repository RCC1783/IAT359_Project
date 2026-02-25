import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';

import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';

export default function AllImagesScreen() {
    const navigation = useNavigation();
    return(
        <SafeAreaView>
            <Text>~ All Images ~</Text>
        </SafeAreaView>
    );
}