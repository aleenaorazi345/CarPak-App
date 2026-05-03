import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { notificationScreenStyles } from '../styles/notificationScreenStyles.config';

export default function NotificationScreen({ navigation }) {
  const [notifications] = React.useState([
    { 
      id: 1, 
      title: 'New Message', 
      description: 'You have a new message from John', 
      time: '5 min ago',
      read: false 
    },
    { 
      id: 2, 
      title: 'Update Available', 
      description: 'A new version of the app is available', 
      time: '1 hour ago',
      read: true 
    },
    { 
      id: 3, 
      title: 'Promotion', 
      description: 'Check out our latest deals', 
      time: '2 hours ago',
      read: true 
    },
  ]);

  const renderNotification = ({ item }) => (
    <View style={[
      notificationScreenStyles.notificationItem,
      !item.read && notificationScreenStyles.notificationItemUnread
    ]}>
      <View style={notificationScreenStyles.notificationContent}>
        <Text style={notificationScreenStyles.notificationTitle}>{item.title}</Text>
        <Text style={notificationScreenStyles.notificationDescription}>{item.description}</Text>
        <Text style={notificationScreenStyles.notificationTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={notificationScreenStyles.container} edges={['top']}>
      {/* Header */}
      <View style={notificationScreenStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={notificationScreenStyles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={notificationScreenStyles.headerTitle}>Notifications</Text>
        <View style={notificationScreenStyles.placeholder} />
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={notificationScreenStyles.listContent}
        ListEmptyComponent={
          <View style={notificationScreenStyles.emptyContainer}>
            <Text style={notificationScreenStyles.emptyText}>No notifications</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}