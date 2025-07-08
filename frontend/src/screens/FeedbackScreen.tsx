import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { postFeedback } from "../services/api";
import Toast from "../components/Toast";
import Button from "../components/Button";
import { useLanguage } from "../contexts/LanguageContext";

const FeedbackScreen = () => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "success"
  );
  const { t } = useLanguage();

  const handleSend = async () => {
    setSending(true);
    try {
      await postFeedback(subject, body);
      setToastMessage(t("feedback_sent"));
      setToastType("success");
      setToastVisible(true);
      setSubject("");
      setBody("");
    } catch (e) {
      setToastMessage(t("feedback_failed"));
      setToastType("error");
      setToastVisible(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("subject")}</Text>
      <TextInput
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
        placeholder={t("subject")}
      />
      <Text style={styles.label}>{t("description")}</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={body}
        onChangeText={setBody}
        placeholder={t("description")}
        multiline
      />
      <Button
        title={sending ? t("sending") : t("send")}
        onPress={handleSend}
        disabled={sending || !subject || !body}
        variant="primary"
        size="large"
        style={{ marginTop: 16 }}
      />
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF8E1" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4B3F2F",
  },
  label: { fontWeight: "bold", marginTop: 16, color: "#4B3F2F" },
  input: {
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 16,
    color: "#4B3F2F",
  },
});

export default FeedbackScreen;
