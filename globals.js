import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity, Pressable } from 'react-native';
import { styles } from "./src/styles";
// export const 


export const CustomHeader =({screenName, navigation}) => {
    if(navigation != null){ 
        return(
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', height: 'fit-content', minHeight: 55}}>
                <Pressable onPress={() => navigation.goBack()} style={{margin: 10}}>
                    <Text style={{paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, fontSize: 22, backgroundColor: '#ad6794', color: '#FFF', textAlignVertical:"top" }}>{'<-'}</Text>
                </Pressable>
                <Text style={{color: "#FFFF", backgroundColor: '#ad6794', paddingLeft: 35, paddingRight: 15, paddingTop: 7, paddingBottom: 10, borderTopStartRadius: 10, borderBottomStartRadius: 30, textAlignVertical: 'top', textAlign:'right', fontSize: 18, fontWeight: 'bold'}}>{screenName}</Text>
            </View>
        );
    } else{
        return(
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems:'center', height: 'fit-content', minHeight: 55}}>
                <Text style={{color: "#FFFF", backgroundColor: '#ad6794', paddingLeft: 35, paddingRight: 15, paddingTop: 7, paddingBottom: 10, borderTopStartRadius: 10, borderBottomStartRadius: 30, textAlignVertical: 'top', textAlign:'right', fontSize: 18, fontWeight: 'bold'}}>{screenName}</Text>
            </View>
        );
    }
}