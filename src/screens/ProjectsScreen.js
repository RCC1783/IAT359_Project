import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';

import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';

export default function ProjectsScreen() {
    const navigation = useNavigation();
    return(
        <SafeAreaView>
            <Text>~ Projects ~</Text>
        </SafeAreaView>
    );
}