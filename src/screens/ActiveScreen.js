import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

import { styles } from "../styles";
import { useNavigation } from "@react-navigation/native";

export default function ActiveScreen() {
  //For updating the time displaying on the stopwatch
  const [time, setTime] = useState(0);
  //To keep track if the timer is running
  const [running, setRunning] = useState(false);

  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <Text>~ Active ~</Text>

      {/*Text to display the stopwatch for the user*/}
      <Text>{time}</Text>

      {/*displaying the timer itself*/}

      {/*For Pausing and Resuming the stopwatch; also added reset and Start*/}
      <Button title="Pause" />
      <Button title="Resume" />
      <Button title="Start" />
      <Button title="Reset" />
    </SafeAreaView>
  );
}
