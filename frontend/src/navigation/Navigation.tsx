import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { View, Text, StyleSheet, Image } from "react-native";
// @ts-ignore
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// @ts-ignore
import Feather from "react-native-vector-icons/Feather";
// @ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import { useLanguage } from "../contexts/LanguageContext";

import BooksScreen from "../screens/BooksScreen";
import SavedWordsScreen from "../screens/SavedWordsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AddBookScreen from "../screens/AddBookScreen";
import BookReaderScreen from "../screens/BookReaderScreen";
import LoginScreen from "../screens/LoginScreen";
import LogoutScreen from "../screens/LogoutScreen";
import LoadingScreen from "../components/LoadingScreen";
import DictionaryScreen from "../screens/DictionaryScreen";
import EditBookScreen from "../screens/EditBookScreen";
import FeedbackScreen from "../screens/FeedbackScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const state = props.state;
  const activeRoute = state.routeNames[state.index];
  const { t } = useLanguage();
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, paddingTop: 0 }}
    >
      {/* Header */}
      <View style={styles.drawerHeader}>
        <Image
          source={require("../assets/icon/Lexify_icon.png")}
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: "#FFF8E1",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 6,
            alignSelf: "center",
          }}
        />
        <Text style={styles.drawerAppName}>{t("app_title")}</Text>
      </View>
      {/* Main Menu */}
      <View style={styles.menuSection}>
        <DrawerItem
          label={t("books")}
          icon={({ size }) => (
            <MaterialCommunityIcons
              name="bookshelf"
              size={size}
              color="#4E2B1B"
            />
          )}
          onPress={() => props.navigation.navigate(t("books"))}
          labelStyle={styles.menuLabel}
          focused={activeRoute === t("books")}
        />
        <DrawerItem
          label={t("saved_words")}
          icon={({ size }) => (
            <Feather name="star" size={size} color="#4E2B1B" />
          )}
          onPress={() => props.navigation.navigate(t("saved_words"))}
          labelStyle={styles.menuLabel}
          focused={activeRoute === t("saved_words")}
        />
        <DrawerItem
          label={t("dictionary")}
          icon={({ size }) => (
            <Ionicons name="book-outline" size={size} color="#4E2B1B" />
          )}
          onPress={() => props.navigation.navigate(t("dictionary"))}
          labelStyle={styles.menuLabel}
          focused={activeRoute === t("dictionary")}
        />
        <DrawerItem
          label={t("profile")}
          icon={({ size }) => (
            <Feather name="user" size={size} color="#4E2B1B" />
          )}
          onPress={() => props.navigation.navigate(t("profile"))}
          labelStyle={styles.menuLabel}
          focused={activeRoute === t("profile")}
        />
      </View>
      {/* Divider */}
      <View style={styles.divider} />
      {/* Bottom Menu */}
      <View style={styles.menuSection}>
        <DrawerItem
          label={t("settings")}
          icon={({ size }) => (
            <Feather name="settings" size={size} color="#4E2B1B" />
          )}
          onPress={() => props.navigation.navigate(t("settings"))}
          labelStyle={styles.menuLabel}
        />
        <DrawerItem
          label={t("feedback")}
          icon={({ size }) => (
            <Feather name="message-square" size={size} color="#4E2B1B" />
          )}
          onPress={() => props.navigation.navigate(t("feedback"))}
          labelStyle={styles.menuLabel}
          focused={activeRoute === t("feedback")}
        />
        <DrawerItem
          label={t("logout")}
          icon={({ size }) => (
            <MaterialCommunityIcons name="logout" size={size} color="#4E2B1B" />
          )}
          onPress={() => props.navigation.navigate(t("logout"))}
          labelStyle={styles.menuLabel}
          focused={activeRoute === t("logout")}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  const { t } = useLanguage();
  return (
    <Drawer.Navigator
      initialRouteName={t("books")}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ route }) => ({
        headerShown: true,
        swipeEnabled: true,
        headerTitle: t(route.name),
        headerStyle: {
          backgroundColor: "rgb(248, 204, 123)",
        },
        headerTintColor: "#4E2B1B",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
          fontFamily: "Roboto_500Medium",
          color: "#4E2B1B",
        },
        drawerActiveTintColor: "#4E2B1B",
        drawerInactiveTintColor: "#4E2B1B",
        drawerActiveBackgroundColor: "rgb(248, 204, 123)",
        drawerStyle: {
          backgroundColor: "#FFF8E1",
          width: 280,
        },
        ...(route.name === t("saved_words") ? { unmountOnBlur: true } : {}),
      })}
    >
      <Drawer.Screen name={t("books")} component={BooksScreen} />
      <Drawer.Screen name={t("saved_words")} component={SavedWordsScreen} />
      <Drawer.Screen name={t("dictionary")} component={DictionaryScreen} />
      <Drawer.Screen name={t("profile")} component={ProfileScreen} />
      <Drawer.Screen name={t("settings")} component={SettingsScreen} />
      <Drawer.Screen name={t("logout")} component={LogoutScreen} />
      <Drawer.Screen name={t("feedback")} component={FeedbackScreen} />
    </Drawer.Navigator>
  );
};

const Navigation = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#FFF8E1",
          },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
            <Stack.Screen name="AddBook" component={AddBookScreen} />
            <Stack.Screen name="BookReader" component={BookReaderScreen} />
            <Stack.Screen name="EditBook" component={EditBookScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    flexDirection: "row", // ikon ve yazı yan yana
    alignItems: "center",
    paddingLeft: 10,
    justifyContent: "flex-start", // sola yasla
    paddingTop: 80, // üstte daha fazla boşluk
    paddingBottom: 20, // altta biraz daha boşluk
    backgroundColor: "#FFF8E1",
    borderBottomWidth: 1,
    borderBottomColor: "#F7C873",
  },
  drawerAppName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5D4037",
    fontFamily: "Lobster_400Regular", // Sadece Lexify için Lobster
    marginLeft: 18, // ikon ile yazı arası daha fazla boşluk
  },
  drawerAppDesc: {
    fontSize: 13,
    color: "#666",
    fontFamily: "Roboto_400Regular",
    marginTop: 2,
  },
  menuSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: -10,
    color: "#4E2B1B",
    fontFamily: "Roboto_500Medium",
  },
  divider: {
    height: 1,
    backgroundColor: "#F7C873",
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export default Navigation;
