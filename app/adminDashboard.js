import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../firebase/config';
import { deleteCar } from '../services/carService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F4B400',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 40,
  },
  carCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#F4B400',
  },
  carImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  carDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  carName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  carPrice: {
    fontSize: 15,
    color: '#F4B400',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  carInfoText: {
    fontSize: 12,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  editButton: {
    backgroundColor: '#E8F5E9',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  editText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  deleteText: {
    color: '#F44336',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});

export default function AdminDashboard() {
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'Cars'));
      const carList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCars(carList);
    } catch (error) {
      console.log('Error fetching cars:', error);
      Alert.alert('Error', 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = (carId, carName) => {
    Alert.alert(
      'Delete Car',
      `Are you sure you want to delete ${carName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCar(carId);
              setCars((prev) => prev.filter((car) => car.id !== carId));
              Alert.alert('Success', 'Car deleted successfully');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete car');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (car) => {
    router.push({
      pathname: '/editcar',
      params: { car: JSON.stringify(car) },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F4B400" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading Ads...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity onPress={fetchCars}>
          <Ionicons name="refresh" size={24} color="#F4B400" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AntDesign name="car" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No ads found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.carCard}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.carImage} />
            ) : (
              <View style={[styles.carImage, { justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="car" size={40} color="#ccc" />
              </View>
            )}
            <View style={styles.carDetails}>
              <Text style={styles.carName}>{item.name || 'Unknown Car'}</Text>
              <Text style={styles.carPrice}>PKR {item.price}</Text>
              <Text style={styles.carInfoText}>
                {item.year} • {item.transmission}
              </Text>
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEdit(item)}
                >
                  <AntDesign name="edit" size={14} color="#4CAF50" />
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(item.id, item.name)}
                >
                  <AntDesign name="delete" size={14} color="#F44336" />
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
