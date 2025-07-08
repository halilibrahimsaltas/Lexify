import React from "react";
import { View, Text, Switch, StyleSheet, Linking } from "react-native";
import Constants from "expo-constants";
import { useLanguage } from "../contexts/LanguageContext";

const SettingsScreen = () => {
  const { t, language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const handleToggle = () => {
    setLanguage(isTR ? "en" : "tr");
  };

  return (
    <View style={[styles.container, { backgroundColor: "#FFF8E1" }]}>
      <View style={styles.row}>
        <Text style={styles.label}>{t("language")}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{ marginRight: 8, fontWeight: isTR ? "bold" : "normal" }}
          >
            {t("turkish")}
          </Text>
          <Switch
            value={!isTR}
            onValueChange={handleToggle}
            thumbColor={!isTR ? "#32341f" : "#F7C873"}
            trackColor={{ false: "#f7e7c6", true: "#F7C873" }}
          />
          <Text
            style={{ marginLeft: 8, fontWeight: !isTR ? "bold" : "normal" }}
          >
            {t("english")}
          </Text>
        </View>
      </View>
      <View style={styles.aboutBox}>
        <Text style={styles.aboutTitle}>{t("about")}</Text>
        <Text style={styles.aboutText}>
          Lexify - {t("app_title").toLowerCase()} {t("books").toLowerCase()}{" "}
          {t("and")} {t("words").toLowerCase()} {t("application")}
        </Text>
        <Text style={styles.aboutText}>{t("version")}: 1.0.2</Text>
        <Text style={styles.aboutText}>Halil İbrahim Saltaş</Text>
        <Text style={styles.aboutText}>
          {t("contact")}: h.ibrahimsaltas@gmail.com
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
