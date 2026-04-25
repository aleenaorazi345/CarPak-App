import { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

import styles from '../../styles/searchStyles.config'; // ✅ USING YOUR STYLES

export default function SearchScreen() {
  const router = useRouter();

  const [cars, setCars] = useState([]);
  const [query, setQuery] = useState('');

  // 🔥 FETCH FROM FIRESTORE (same as home)
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Cars'));

        const carList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCars(carList);
      } catch (error) {
        console.log('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, []);

  // 🔍 FILTER ONLY BY NAME
  const filteredCars = cars.filter(car =>
    car.name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>

      {/* 🔙 HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Search</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* 🔍 SEARCH BAR */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          placeholder="Search car by name"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      {/* 🚗 RESULTS */}
      <FlatList
        data={filteredCars}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
  style={styles.carCard}
  onPress={() =>
    router.push({
      pathname: '/cardetails',
      params: { car: JSON.stringify(item) },
    })
  }
>
            <Text style={styles.carTitle}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noDataText}>No cars found</Text>
        }
      />
    </View>
  );
}