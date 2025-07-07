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

const localCovers = [
  require("../assets/bookcover/bookcard/ComfyUI_cover1_.png"),
  require("../assets/bookcover/bookcard/ComfyUI_cover2_.png"),
  require("../assets/bookcover/bookcard/ComfyUI_cover3_.png"),
  require("../assets/bookcover/bookcard/ComfyUI_cover5_.png"),
];

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

  const randomCover = React.useMemo(() => {
    return localCovers[Math.floor(Math.random() * localCovers.length)];
  }, []);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={book.coverImage ? { uri: book.coverImage } : randomCover}
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
    borderRadius: 14,
    elevation: 2,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 0,
    shadowColor: "rgba(0,0,0,0.08)",
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
  },
  cover: {
    width: 90,
    height: 128,
    borderRadius: 10,
    backgroundColor: "#FFF8E1",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    marginRight: 20,
  },
  info: {
    flex: 1,
    marginLeft: 0,
    justifyContent: "center",
    alignItems: "flex-start",
    marginRight: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4E2B1B",
    flex: 1,
    marginRight: 8,
    textAlign: "left",
  },
  author: {
    color: "#4E2B1B",
    fontSize: 16,
    marginTop: 4,
    textAlign: "left",
  },
  meta: {
    color: "#4E2B1B",
    fontSize: 13,
    marginTop: 4,
    textAlign: "left",
  },
  deleteButton: {
    padding: 8,
    marginLeft: 12,
  },
  editButton: {
    padding: 8,
    marginTop: 2,
    alignItems: "center",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#F3E6C4",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 16,
    width: "100%",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4E2B1B",
    borderRadius: 4,
    marginRight: 0,
  },
});

export default BookCard;
