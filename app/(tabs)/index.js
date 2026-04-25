import { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import NavigationDrawer from '../navigationdrawer';
import NotificationIcon from '../notificationicon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#F4B400', // yellow theme
  },

  menuIcon: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 15,
  },

  budgetCard: {
    backgroundColor: '#FFD700',
    padding: 15,
    margin: 10,
    borderRadius: 12,
  },

  cardText: {
    fontWeight: 'bold',
  },

  categoryCard: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    margin: 10,
    borderRadius: 10,
  },

  recommendCard: {
    width: 160,
    backgroundColor: '#fff8dc',
    padding: 15,
    margin: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },

  listCard: {
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
});

export default function HomeScreen({ navigation }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const goToNotifications = () => {
    navigation.navigate('Notifications');
  };

  // 🟡 DATA

  const budgetData = [
    { id: '1', label: 'Under 1M' },
    { id: '2', label: '1M - 3M' },
    { id: '3', label: '3M - 5M' },
  ];

  const categories = [
    { id: '1', name: 'Sedan' },
    { id: '2', name: 'SUV' },
    { id: '3', name: 'Hatchback' },
    { id: '4', name: 'Sports' },
  ];

  const recommended = [
    { id: '1', name: 'Toyota Corolla', price: '3.2M' },
    { id: '2', name: 'Honda Civic', price: '4.5M' },
    { id: '3', name: 'Tesla Model 3', price: '12M' },
  ];

  const allCars = [
    { id: '1', name: 'Toyota Aqua', price: '2.8M' },
    { id: '2', name: 'Honda Vezel', price: '5.5M' },
    { id: '3', name: 'Suzuki Alto', price: '1.8M' },
    { id: '4', name: 'BMW X5', price: '18M' },
  ];

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleDrawer}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>CarPak</Text>

        <NotificationIcon onPress={goToNotifications} />
      </View>

      {/* DRAWER */}
      {drawerOpen && (
        <NavigationDrawer
          onClose={() => setDrawerOpen(false)}
          navigation={navigation}
        />
      )}

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 🟡 BUDGET */}
        <Text style={styles.sectionTitle}>Budget</Text>

        <FlatList
          data={budgetData}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.budgetCard}>
              <Text style={styles.cardText}>{item.label}</Text>
            </View>
          )}
        />

        {/* 🟡 CATEGORIES */}
        <Text style={styles.sectionTitle}>Categories</Text>

        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.categoryCard}>
              <Text>{item.name}</Text>
            </View>
          )}
        />

        {/* 🚗 RECOMMENDED */}
        <Text style={styles.sectionTitle}>Recommended For You</Text>

        <FlatList
          data={recommended}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.recommendCard}>
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              <Text>{item.price}</Text>
            </View>
          )}
        />

        {/* 🚘 ALL CARS */}
        <Text style={styles.sectionTitle}>All Cars</Text>

        <FlatList
          data={allCars}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.listCard}>
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              <Text>{item.price}</Text>
            </View>
          )}
        />

      </ScrollView>
    </View>
  );
}