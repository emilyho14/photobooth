import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function StartPhotostripScreen() {
  return (
     <View>
        <TouchableOpacity onPress={() => router.push("/")}> 
          <Text> Back </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/select-theme")}> 
          <Text> Begin </Text>
        </TouchableOpacity>

     </View>
  );

}