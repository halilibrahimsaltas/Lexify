import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Book } from "../types";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface BookCardProps {
  book: Book;
  onPress: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onPress,
  onDelete,
  onEdit,
}) => {
  const userProgress =
    Array.isArray(book.progress) && book.progress.length > 0
      ? book.progress[0]
      : null;
  const totalPages = book.pages?.length || 1;
  const progress = userProgress
    ? (userProgress.currentPage || 0) / totalPages
    : 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{
          uri:
            book.coverImage ||
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F026%2F452%2F722%2Foriginal%2Fcute-book-icon-isolated-white-background-free-png.png&f=1&nofb=1&ipt=92cb83e0919b9cc8129a11cc47ba26d560d30ba343b4e72217b9801ac9f48b16",
        }}
        style={styles.cover}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {book.title}
          </Text>
          <View style={{ alignItems: "center", flexDirection: "row" }}>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Ionicons name="trash-outline" size={22} color="#4E2B1B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <MaterialCommunityIcons
                name="square-edit-outline"
                size={22}
                color="#4E2B1B"
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {book.category}
        </Text>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${Math.round(progress * 100)}%` },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF8E1",
    borderRadius: 0,
    elevation: 0,
    paddingVertical: 12,
    paddingHorizontal: 0,
    marginBottom: 0,
    alignItems: "flex-start",
    marginHorizontal: 0,
    borderWidth: 0,
    shadowColor: "transparent",
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
  },
  cover: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 18,
    marginRight: 18,
  },
  info: {
    flex: 1,
    marginLeft: 0,
    justifyContent: "center",
    alignItems: "flex-start",
    marginRight: 18,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#4E2B1B",
    flex: 1,
    marginRight: 8,
    textAlign: "left",
  },
  author: {
    color: "#4E2B1B",
    fontSize: 14,
    marginTop: 2,
    textAlign: "left",
  },
  meta: {
    color: "#4E2B1B",
    fontSize: 12,
    marginTop: 2,
    textAlign: "left",
  },
  deleteButton: {
    padding: 0,
    marginLeft: 4,
  },
  deleteText: {
    fontSize: 16,
    color: "#B85C38",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#F3E6C4",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 20,
    width: "100%",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#F7C873",
    borderRadius: 3,
    marginRight: 10,
  },
  editButton: {
    padding: 0,
    marginTop: 4,
    marginLeft: 4,
    alignItems: "center",
  },
});

export default BookCard;
