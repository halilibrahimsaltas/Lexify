import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Book } from "../types";

interface BookCardProps {
  book: Book;
  onPress: () => void;
  onDelete: () => void;
  progress?: number; // 0-1 arası değer
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onPress,
  onDelete,
  progress = 0,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{
          uri:
            book.coverImage ||
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F026%2F452%2F722%2Foriginal%2Fcute-book-icon-isolated-white-background-free-png.png&f=1&nofb=1&ipt=92cb83e0919b9cc8129a11cc47ba26d560d30ba343b4e72217b9801ac9f48b16",
        }}
        style={styles.cover}
        resizeMode="contain"
      />

      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {book.title}
          </Text>
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Text style={styles.deleteText}>🗑</Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{ color: "#666", fontSize: 13, marginTop: 2 }}
          numberOfLines={1}
        >
          {book.author}
        </Text>
        <Text
          style={{ color: "#999", fontSize: 12, marginTop: 2 }}
          numberOfLines={1}
        >
          {book.category}
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
    marginHorizontal: 16,
  },
  cover: {
    width: 60,
    height: 90,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    fontSize: 16,
    color: "#ff3b30",
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#007AFF",
  },
});

export default BookCard;
