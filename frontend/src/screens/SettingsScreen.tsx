import React from "react";
import { View, Text, Switch, StyleSheet, Linking } from "react-native";
import Constants from "expo-constants";
import { useTheme } from "../contexts/ThemeContext";

const SettingsScreen = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#222" : "#FFF8E1" },
      ]}
    >
      <View style={styles.aboutBox}>
        <Text style={styles.aboutTitle}>Hakkında</Text>
        <Text style={styles.aboutText}>
          Lexify - Kitap ve kelime uygulaması
        </Text>
        <Text style={styles.aboutText}>Versiyon: 1.0.2</Text>
        <Text style={styles.aboutText}>Halil İbrahim Saltaş</Text>
        <Text style={styles.aboutText}>
          İletişim: h.ibrahimsaltas@gmail.com
        </Text>
        <Text
          style={[
            styles.aboutText,
            { color: "#4E2B1B", textDecorationLine: "underline", fontSize: 20 },
          ]}
          onPress={() =>
            Linking.openURL("https://www.linkedin.com/in/halilibrahimsaltas/")
          }
        >
          Linkedin
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 24 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  label: { fontSize: 18 },
  aboutBox: { padding: 16, borderRadius: 12, backgroundColor: "#f7e7c6" },
  aboutTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    color: "#4E2B1B",
  },
  aboutText: { fontSize: 15, color: "#4E2B1B" },
});

export default SettingsScreen;
