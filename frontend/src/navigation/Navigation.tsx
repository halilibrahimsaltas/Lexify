import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { View, Text, StyleSheet } from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// @ts-ignore
import Feather from 'react-native-vector-icons/Feather';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';

import BooksScreen from '../screens/BooksScreen';
import SavedWordsScreen from '../screens/SavedWordsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddBookScreen from '../screens/AddBookScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import BookReaderScreen from '../screens/BookReaderScreen';
import LoginScreen from '../screens/LoginScreen';
import LogoutScreen from '../screens/LogoutScreen';
import LoadingScreen from '../components/LoadingScreen';
import DictionaryScreen from '../screens/DictionaryScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: DrawerContentComponentProps) => (
  <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, paddingTop: 0 }}>
    {/* Header */}
    <View style={styles.drawerHeader}>
      <MaterialCommunityIcons name="book-open-page-variant" size={44} color="#007AFF" style={{ marginBottom: 8 }} />
      <Text style={styles.drawerAppName}>Lexify</Text>
    </View>
    {/* Main Menu */}
    <View style={styles.menuSection}>
      <DrawerItem
        label="Kitaplarım"
        icon={({ color, size }) => <MaterialCommunityIcons name="bookshelf" size={size} color={color} />}
        onPress={() => props.navigation.navigate('Kitaplarım')}
        labelStyle={styles.menuLabel}
      />
      <DrawerItem
        label="Favori Kelimeler"
        icon={({ color, size }) => <Feather name="star" size={size} color={color} />}
        onPress={() => props.navigation.navigate('Favori Kelimeler')}
        labelStyle={styles.menuLabel}
      />
      <DrawerItem
        label="Sözlük"
        icon={({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />}
        onPress={() => props.navigation.navigate('Sözlük')}
        labelStyle={styles.menuLabel}
      />
      <DrawerItem
        label="Profil"
        icon={({ color, size }) => <Feather name="user" size={size} color={color} />}
        onPress={() => props.navigation.navigate('Profil')}
        labelStyle={styles.menuLabel}
      />
    </View>
    {/* Divider */}
    <View style={styles.divider} />
    {/* Bottom Menu */}
    <View style={styles.menuSection}>
      <DrawerItem
        label="Ayarlar"
        icon={({ color, size }) => <Feather name="settings" size={size} color={color} />}
        onPress={() => {}}
        labelStyle={styles.menuLabel}
      />
      <DrawerItem
        label="Geri Bildirim Gönder"
        icon={({ color, size }) => <Feather name="message-square" size={size} color={color} />}
        onPress={() => {}}
        labelStyle={styles.menuLabel}
      />
      <DrawerItem
        label="Çıkış Yap"
        icon={({ color, size }) => <MaterialCommunityIcons name="logout" size={size} color={color} />}
        onPress={() => props.navigation.navigate('Çıkış Yap')}
        labelStyle={styles.menuLabel}
      />
    </View>
  </DrawerContentScrollView>
);

const DrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="Kitaplarım"
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerShown: true, // Hamburger menüsü ve başlık barı gözüksün
      swipeEnabled: true, // Kaydırarak açma aktif
      headerTitle: "Lexify", // Başlıkta uygulama adı
      headerStyle: {
        backgroundColor: '#FFF8E1',
      },
      headerTintColor: '#4B3F2F',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily: 'Merriweather',
      },
      drawerActiveTintColor: '#007AFF',
      drawerInactiveTintColor: '#4B3F2F',
      drawerActiveBackgroundColor: '#FAF3DD',
      drawerStyle: {
        backgroundColor: '#FFF8E1',
        width: 280,
      },
    }}
  >
    <Drawer.Screen name="Kitaplarım" component={BooksScreen} />
    <Drawer.Screen name="Favori Kelimeler" component={SavedWordsScreen} />
    <Drawer.Screen name="Sözlük" component={DictionaryScreen} />
    <Drawer.Screen name="Profil" component={ProfileScreen} />
    <Drawer.Screen name="Çıkış Yap" component={LogoutScreen} />
  </Drawer.Navigator>
);

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
            backgroundColor: '#FFF8E1',
          },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
            <Stack.Screen name="AddBook" component={AddBookScreen} />
            <Stack.Screen name="BookDetail" component={BookDetailScreen} />
            <Stack.Screen name="BookReader" component={BookReaderScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 24,
    backgroundColor: '#FFF8E1',
    borderBottomWidth: 1,
    borderBottomColor: '#F7C873',
  },
  drawerAppName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B3F2F',
    fontFamily: 'Merriweather',
  },
  drawerAppDesc: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Merriweather',
    marginTop: 2,
  },
  menuSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: -10,
  },
  divider: {
    height: 1,
    backgroundColor: '#F7C873',
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export default Navigation;