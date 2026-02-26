import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';

import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';

export default function SelectedProjectScreen({route}) {
    const {projectID} = route.params;
    
    const navigation = useNavigation();
    return(
        <SafeAreaView>
            <Text>~ selected project ~</Text>
            <Button title="Shop Screen" onPress={() => navigation.navigate("shop", {project: projectID})}/>
        </SafeAreaView>
    );
}