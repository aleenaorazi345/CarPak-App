import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navigationDrawerStyles } from '../styles/navigationDrawerStyles.config';

export default function NavigationDrawer({ onClose }) {
  const router = useRouter();
  const auth = getAuth();
  const insets = useSafeAreaInsets();

  const menuItems = [
    { name: 'Home', path: '/(tabs)/', icon: 'home-outline' },
    { name: 'Favorites', path: '/(tabs)/favorites', icon: 'heart-outline' },
    { name: 'Search', path: '/(tabs)/search', icon: 'search-outline' },
    { name: 'Profile', path: '/(tabs)/profile', icon: 'person-outline' },
    { name: 'Settings', path: '/settings', icon: 'settings-outline' },
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
      <Ionicons name={item.icon} size={20} color="#333" style={{ marginRight: 15 }} />
      <Text style={navigationDrawerStyles.menuText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[navigationDrawerStyles.drawerContainer, { bottom: 0 }]}>
      <View style={[navigationDrawerStyles.drawer, { paddingTop: insets.top || 20 }]}>
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
          <Text style={navigationDrawerStyles.logoutText}>Logout</Text>
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