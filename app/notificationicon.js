import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { notificationIconStyles } from '../styles/notificationIconStyles.config';

export default function NotificationIcon({ onPress }) {
  const [notificationCount] = useState(3); // Change this based on your data

  return (
    <TouchableOpacity onPress={onPress} style={notificationIconStyles.container}>
      <Text style={notificationIconStyles.bell}>🔔</Text>
      {notificationCount > 0 && (
        <View style={notificationIconStyles.badge}>
          <Text style={notificationIconStyles.badgeText}>{notificationCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}