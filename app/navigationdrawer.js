import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { navigationDrawerStyles } from '../styles/navigationDrawerStyles.config';

export default function NavigationDrawer({ onClose, navigation }) {
  const menuItems = [
    { name: 'Home', screen: 'Home', icon: '🏠' },
    { name: 'Favorites', screen: 'Favorites', icon: '❤️' },
    { name: 'Profile', screen: 'Profile', icon: '👤' },
    { name: 'Search', screen: 'Search', icon: '🔍' },
    { name: 'Settings', screen: 'Settings', icon: '⚙️' },
  ];

  const handlePress = (screen) => {
    onClose();
    navigation.navigate(screen);
  };

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={navigationDrawerStyles.menuItem}
      onPress={() => handlePress(item.screen)}
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
          keyExtractor={(item) => item.screen}
          scrollEnabled={false}
        />

        {/* Logout */}
        <TouchableOpacity style={navigationDrawerStyles.logoutButton}>
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