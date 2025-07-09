import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import { useLanguage } from "../contexts/LanguageContext";
import { SafeAreaView } from "react-native-safe-area-context";

const HelpScreen = () => {
  const { t } = useLanguage();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t("help_title")}</Text>
        <Text style={styles.paragraph}>{t("help_intro")}</Text>
        <Text style={styles.sectionTitle}>{t("help_section1_title")}</Text>
        <Text style={styles.paragraph}>{t("help_section1_text")}</Text>
        <Text style={styles.sectionTitle}>{t("help_section2_title")}</Text>
        <Text style={styles.paragraph}>{t("help_section2_text")}</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://www.gutenberg.org/")}
        >
          <Text style={styles.link}>{t("help_link_gutenberg")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://standardebooks.org/")}
        >
          <Text style={styles.link}>{t("help_link_standardebooks")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://manybooks.net/")}
        >
          <Text style={styles.link}>{t("help_link_manybooks")}</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t("help_section3_title")}</Text>
        <Text style={styles.paragraph}>{t("help_section3_text")}</Text>
        <Text style={styles.sectionTitle}>{t("help_section4_title")}</Text>
        <Text style={styles.paragraph}>{t("help_section4_text")}</Text>
        <Text style={styles.sectionTitle}>{t("help_section5_title")}</Text>
        <Text style={styles.paragraph}>{t("help_section5_text")}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4E2B1B",
    marginBottom: 18,
    fontFamily: "Roboto_500Medium",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4E2B1B",
    marginTop: 18,
    marginBottom: 8,
    fontFamily: "Roboto_500Medium",
  },
  paragraph: {
    fontSize: 15,
    color: "#4E2B1B",
    marginBottom: 10,
    fontFamily: "Roboto_400Regular",
  },
  link: {
    color: "#4E2B1B",
    fontFamily: "Roboto_400Regular",
    fontWeight: "bold",
    textDecorationLine: "none",
    marginBottom: 8,
    fontSize: 16,
  },
});

export default HelpScreen;
