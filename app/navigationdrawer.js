import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { navigationDrawerStyles } from '../styles/navigationDrawerStyles.config';

export default function NavigationDrawer({ onClose }) {
  const router = useRouter();
  const auth = getAuth();

  const menuItems = [
    { name: 'Home', path: '/(tabs)/', icon: '🏠' },
    { name: 'Favorites', path: '/(tabs)/favorites', icon: '❤️' },
    { name: 'Search', path: '/(tabs)/search', icon: '🔍' },
    { name: 'Profile', path: '/(tabs)/profile', icon: '👤' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  const handlePress = (path) => {
    onClose();
    router.push(path);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              onClose();
              // Clear remember me data from AsyncStorage
              await AsyncStorage.multiRemove(['rememberMe', 'userEmail', 'userPassword']);
              // Sign out from Firebase
              await signOut(auth);
              // Navigate to login
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={navigationDrawerStyles.menuItem}
      onPress={() => handlePress(item.path)}
    >
      <Text style={navigationDrawerStyles.menuIcon}>{item.icon}</Text>
      <Text style={navigationDrawerStyles.menuText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={navigationDrawerStyles.drawerContainer}>
      <View style={navigationDrawerStyles.drawer}>
        {/* Header */}
        <View style={navigationDrawerStyles.drawerHeader}>
          <Text style={navigationDrawerStyles.drawerTitle}>Menu</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={navigationDrawerStyles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <FlatList
          data={menuItems}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.path}
          scrollEnabled={false}
        />

        {/* Logout */}
        <TouchableOpacity
          style={navigationDrawerStyles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={navigationDrawerStyles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Overlay to close drawer */}
      <TouchableOpacity
        style={navigationDrawerStyles.overlay}
        onPress={onClose}
      />
    </View>
  );
}