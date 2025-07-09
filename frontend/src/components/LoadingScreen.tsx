import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/lottie/lexify-animation.json")}
        autoPlay
        loop
        style={{ width: 150, height: 150 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
  },
});
