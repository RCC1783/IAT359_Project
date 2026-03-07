import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';

import {styles} from '../styles';
import { useNavigation } from '@react-navigation/native';

export default function ActiveScreen() {
    const navigation = useNavigation();
    return(
        <SafeAreaView>
            <Text>~ Active ~</Text>

            <View>
                <Image source={{uri:'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDZncmJ2eWZoZXA2bDV1NjYxMTJjZm9jcnVpdW9kMWYxZ211MzN4cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g3fEmm7GGlpG03a5K5/giphy.gif'}}/>
            </View>
        </SafeAreaView>
    );
}