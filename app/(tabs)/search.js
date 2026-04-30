import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { getCars, addToFavorites, isFavorited, removeFromFavorites } from '../../services';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#F4B400',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },

  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#0f172a',
  },

  contentContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },

  carCard: {
    backgroundColor: '#1a2540',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#F4B400',
  },

  carImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#0f172a',
  },

  carDetails: {
    padding: 16,
  },

  carName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },

  carDescription: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },

  carInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  infoItem: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 12,
    color: '#F4B400',
    fontWeight: 'bold',
  },

  priceAndActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F4B400',
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },

  favoriteButtonActive: {
    backgroundColor: '#d32f2f',
  },

  favoriteButtonInactive: {
    backgroundColor: '#0f172a',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 14,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default function Search({ navigation }) {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const carsData = await getCars();
      setCars(carsData);
      setFilteredCars(carsData);
      
      // Load favorites status
      const favoriteStatus = new Set();
      for (const car of carsData) {
        const isFav = await isFavorited(car.id);
        if (isFav) {
          favoriteStatus.add(car.id);
        }
      }
      setFavorites(favoriteStatus);
    } catch (error) {
      console.error('Error fetching cars:', error);
      Alert.alert('Error', 'Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredCars(cars);
    } else {
      const filtered = cars.filter(
        car =>
          car.name.toLowerCase().includes(query.toLowerCase()) ||
          (car.model && car.model.toLowerCase().includes(query.toLowerCase())) ||
          (car.description && car.description.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredCars(filtered);
    }
  };

  const handleToggleFavorite = async (car) => {
    try {
      if (favorites.has(car.id)) {
        // Remove from favorites
        await removeFromFavorites(car.id);
        const newFavorites = new Set(favorites);
        newFavorites.delete(car.id);
        setFavorites(newFavorites);
        Alert.alert('Success', 'Removed from favorites');
      } else {
        // Add to favorites
        await addToFavorites(car.id, car);
        const newFavorites = new Set(favorites);
        newFavorites.add(car.id);
        setFavorites(newFavorites);
        Alert.alert('Success', 'Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status');
    }
  };

  const handleContact = (sellerId, carName) => {
    navigation.navigate('Messages', {
      sellerId: sellerId,
      sellerName: carName,
    });
  };

  const renderCarCard = ({ item }) => (
    <View style={styles.carCard}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.carImage} />
      ) : (
        <View style={[styles.carImage, { justifyContent: 'center', alignItems: 'center' }]}>
          <Ionicons name="car" size={60} color="#F4B400" />
        </View>
      )}
      <View style={styles.carDetails}>
        <Text style={styles.carName}>{item.name || 'Unknown Car'}</Text>
        {item.description && (
          <Text style={styles.carDescription}>{item.description}</Text>
        )}

        <View style={styles.carInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Year</Text>
            <Text style={styles.infoValue}>{item.year || 'N/A'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Mileage</Text>
            <Text style={styles.infoValue}>{item.mileage || 'N/A'} km</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Transmission</Text>
            <Text style={styles.infoValue}>{item.transmission || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.priceAndActions}>
          <Text style={styles.price}>PKR {item.price || '0'}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.iconButton,
                favorites.has(item.id) ? styles.favoriteButtonActive : styles.favoriteButtonInactive,
              ]}
              onPress={() => handleToggleFavorite(item)}
            >
              <Ionicons
                name={favorites.has(item.id) ? 'heart' : 'heart-outline'}
                size={20}
                color="#F4B400"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton]}
              onPress={() => handleContact(item.sellerId, item.name)}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F4B400" />
        <Text style={styles.loadingText}>Loading Cars...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔍 Search Cars</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or model..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {filteredCars.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="car" size={60} color="#F4B400" />
          <Text style={styles.emptyText}>No cars found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCars}
          renderItem={renderCarCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}