import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const boothFrame = require("@/assets/booth/BoothFrame.png");
const boothCurtain = require("@/assets/booth/BoothCurtain.png");
const boothRightPanel = require("@/assets/booth/BoothRightPanel.png");

export default function HomeScreen() {
  const curtainProgress = useRef(new Animated.Value(0)).current;

  const handleStart = () => {
    Animated.timing(curtainProgress, {
      toValue: 1,
      duration: 900,
      useNativeDriver: false,
    }).start(() => {
      router.push("/select-theme");
    });
  };

  const curtainWidth = curtainProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["100%", "35%"],
  });

  return (
    <View style={styles.page}>
      <View style={styles.boothStage}>
        <Image source={boothFrame} style={styles.boothFrame} />

        <Animated.Image
          source={boothCurtain}
          style={[
            styles.curtain,
            {
              width: curtainWidth,
              },
          ]}
        />
        
        <Image source={boothRightPanel} style={styles.rightPanel} />

        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startText}>Tap to Enter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#1A0F0A",
    alignItems: "center",
    justifyContent: "center",
  },

  boothStage: {
    width: "100%",
    maxWidth: 430,
    aspectRatio: 9 / 16,
    position: "relative",
    overflow: "hidden",
  },

  boothFrame: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  curtain: {
    position: "absolute",
    width: "100%",
    height: "100%",
    right: 5,
    resizeMode: "stretch",
  },

  rightPanel: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  startButton: {
    position: "absolute",
    left: "43%",
    top: "28%",
    width: "36%",
    height: "48%",
    alignItems: "center",
    justifyContent: "center",
  },

  startText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    overflow: "hidden",
  },
});